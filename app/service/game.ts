
import { Service } from 'egg'
import Game from '../classes/Game'
import Room from '../classes/Room'
let Hashids  = require('hashids/cjs')

/**
 * ms service
 */
export default class GameService extends Service {

    /**
     * 创建一个游戏
     */
    async createGame(roomId) {
        let { ctx } = this
        let room: Room = await ctx.service.room.getRoomByRoomId(roomId)
        // 正在游戏中，就不要再新创建游戏了
        if (room.game) {
            return room
        }
        let game = new Game({
            number: new Hashids(new Date().toString(), 10).encode(1),
            seats: room.seats
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
        let rooms = await ctx.helper.getRooms()
        let user = await ctx.helper.getUser()
        let room = rooms[user.roomId]
        let g = room.game
        if (g) {
            let params = g
            Object.assign(params, {
                seats: room.seats
            })
            let game: Game = new Game(params)
            // 游戏之前没有发过牌，就发一次牌
            if (!game.gameUsers[user.id].holds.length) {
                game.deal()
            }
            room.game = game
            rooms[user.roomId] = room
            await ctx.service.room.updateRooms(rooms)
            return room
        } else {
            return '还没有开始游戏'
        }
    }
}
