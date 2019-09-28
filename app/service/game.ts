
import { Service } from 'egg'
import Game from '../classes/Game'
import Room from '../classes/Room'
import GameUser from '../classes/GameUser'
import actions from '../consts/actions'
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
        await ctx.helper.sendMessageToRoom(roomId, 'start-game', rooms)
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
        if (room) {
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
        } else {
            return '还没有进入房间'
        }

    }

    /**
     * 出牌
     */
    async chupai(socket) {
        let { ctx } = this
        let arg = socket.args[0]
        let pai = arg.pai
        let user = await ctx.helper.getUser()
        let roomId = user.roomId
        let rooms = await ctx.helper.getRooms()
        let room = rooms[roomId]
        let gameData = room.game
        let params = gameData

        Object.assign(params, {
            seats: room.seats
        })
        let game: Game = new Game(params)
        let gameUser: GameUser =  game.gameUsers[user.id]
        // 如果不该他出，则忽略
        if (game.turn != gameUser.seatIndex) {
            this.app.logger.error('not your turn game' + game.number + ' user ' + user.name)
            return
        }
        if (gameUser.hasOperations()) {
            this.app.logger.error('plz guo before you chupai' + game.number + ' user' + user.name)
            return
        }

        // 从此人牌中扣除
        let index = gameUser.holds.indexOf(pai)
        if (index === -1) {
            this.app.logger.error('can not find pai' + pai + ' ' + game.number + ' user' + user.name)
            return
        }
        gameUser.canChuPai = false
        game.chupaiCount++
        gameUser.holds.splice(index, 1)
        gameUser.countMap[pai]--
        gameUser.checkCanTingPai()

        game.chupai = pai
        game.gameUsers[user.id] = gameUser
        game.recordGameAction(gameUser.seatIndex, actions.ACTION_CHUPAI, pai)
        game.moveToNextUser()
        room.game = game
        rooms[roomId] = room
        await ctx.service.room.updateRooms(rooms)
        await ctx.helper.sendMessageToRoom(roomId, 'chupai', {
            pai: pai,
            game: game,
            gameUser: game.getGameUserByUserId(user.id)
        })
        await this.mopai(game, roomId)
        // let users =  Object.keys(game.gameUsers)
        // for (let i = 0; i < users.length; i++) {
        //     let theGameUser = game.gameUsers[users[i]]
        //     // 玩家自己不检查
        //     if (theGameUser.seatIndex === game.turn) {
        //         continue
        //     }
        //     game.checkUserCanHu(theGameUser.seatIndex, pai)
        //     game.checkUserCanPeng(theGameUser.seatIndex, pai)
        //     game.checkUserCanDianGang(theGameUser.seatIndex, pai)
        //     if (theGameUser.hasOperations()) {
        //         // sendOperations(game, ddd, game.chuPai)
        //     }
        // }
    }

    /**
     * 模牌
     *
     * @param {Game} game 当前游戏对象
     * @param {string|number} roomId 房间id
     */
    async mopai(game: Game, roomId) {
        let { ctx } = this
        let turn = game.turn
        let gameUser = game.getGameUserBySeatIndex(turn)
        gameUser.mopai(game)
        let rooms = await ctx.helper.getRooms()
        rooms[roomId].game = game
        await ctx.service.room.updateRooms(rooms)
        await ctx.helper.sendMessageToUser(gameUser.userId, 'mopai', {
            game: game
        })
    }
}