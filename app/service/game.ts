
import { Service } from 'egg'
import Game from '../classes/Game'
import Room from '../classes/Room'
let Hashids  = require('hashids/cjs')

/**
 * ms service
 */
export default class GameService extends Service {
    /**
     * 开始游戏
     */
    async start() {
        let { ctx } = this
        let user = await ctx.helper.getUser()
        let room: Room = await ctx.service.room.getRoomByRoomId(user.roomId)
        let games = await ctx.helper.getGames()

        let game = new Game({
            number: new Hashids(new Date().toString(), 10).encode(1),
            room
        })
        user.gameNumber = game.number
        ctx.session.user = JSON.stringify(user)
        games[game.number] = game
        await this.updateGames(games)
        return game
    }

    /**
     * 创建一个游戏
     */
    async createGame(roomId) {
        let { ctx } = this
        let room: Room = await ctx.service.room.getRoomByRoomId(roomId)
        let game = new Game({
            number: new Hashids(new Date().toString(), 10).encode(1),
            room
        })
        room.game = game
        let rooms = ctx.helper.getRooms()
        rooms[roomId] = room
        await ctx.service.room.updateRooms(rooms)
        await ctx.helper.sendMessage(roomId, 'start-game', rooms)
        return room
    }

    /**
     * 根据游戏id 找到游戏
     */
    async getGameByGameNumber(number) {
        let { ctx } = this
        let games = await ctx.helper.getGames()
        let game = games[number]
        if (game) {
            return game
        }
        return null
    }

    /**
     * 发牌
     */
    async deal() {
        let { ctx } = this
        let games = await ctx.helper.getGames()
        let user = await ctx.helper.getUser()
        let g = await this.getGameByGameNumber(user.gameNumber)
        if (g) {
            let game: Game = new Game(g)
            game.deal()
            games[game.number] = game
            await this.updateGames(games)
            return game
        } else {
            return
        }
    }
    async updateGames(games) {
        await this.ctx.app.redis.set('games', JSON.stringify(games))
    }
}
