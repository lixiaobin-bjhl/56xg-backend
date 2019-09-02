import { Controller } from 'egg'

export default class GameController extends Controller {
    public async start() {
        let { ctx } = this
        ctx.body = ctx.helper.success(await ctx.service.game.start())
    }

    public async deal() {
        let { ctx } = this
        ctx.body = ctx.helper.success(await ctx.service.game.deal())
    }
}