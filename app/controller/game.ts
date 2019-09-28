import { Controller } from 'egg'

export default class GameController extends Controller {
    public async start() {
        let { ctx } = this
        let result = await ctx.service.game.createGame(ctx.request.body.roomId)
        ctx.body = ctx.helper.response(result)
    }

    /**
     * 分牌
     */
    public async deal() {
        let { ctx } = this
        let result = await ctx.service.game.deal()
        ctx.body = ctx.helper.response(result)
    }

    /**
     * 出牌
     */
    public async chupai(socket) {
        await this.ctx.service.game.chupai(socket)
    }
}