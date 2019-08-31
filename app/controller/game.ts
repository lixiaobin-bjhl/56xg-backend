import { Controller } from 'egg'

export default class GameController extends Controller {
    public async start() {
        let { ctx } = this
        ctx.body = await ctx.service.game.start(ctx.request.query.roomId)
    }
}