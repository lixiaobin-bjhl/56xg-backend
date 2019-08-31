import { Controller } from 'egg'
import Game from '../classes/Game'
import Room from '../classes/Room'
import GameUser from '../classes/GameUser'

export default class MJController extends Controller {
    public async shuffle() {
        let { ctx } = this
        ctx.body = ctx.helper.success(ctx.service.mj.shuffle())
    }
    /**
     * 发牌
     */
    public async deal() {
        let { ctx } = this
        let mahjongs = ctx.service.mj.shuffle()
        let roomId = ctx.request.body.roomId
        let room: Room = await ctx.service.room.getRoomByRoomId(roomId)
        if (room) {
            let gameUsers = {}
            room.seats.forEach((item: any) => {
                gameUsers[item.userId] = new GameUser(item.userId)
            })
            let game = new Game({
                mahjongs,
                gameUsers,
                room
            })
            let zhuangjia: GameUser = gameUsers[room.seats[0].userId]
            // 设置庄家
            game.turn = zhuangjia.id
            game.deal()
            ctx.body = ctx.helper.success(game)
        }
    }
}