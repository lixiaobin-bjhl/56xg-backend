import { Controller } from 'egg'

export default class RoomController extends Controller {
    public async list() {
        const { ctx } = this
        ctx.body = ctx.helper.success(await ctx.service.room.list())
    }

    public async add() {
        const { ctx } = this
        ctx.body = ctx.helper.success(await ctx.service.room.add())
    }

    public async join() {
        let { ctx } = this
        let result = await ctx.service.room.join()
        if (typeof result === 'string') {
            ctx.body = this.ctx
        } else {
            ctx.body = ctx.helper.success(result)
        }
    }
}