import { Controller } from 'egg'

export default class RoomController extends Controller {
    public async list() {
        const { ctx } = this
        ctx.body = this.ctx.helper.success(await ctx.service.room.list())
    }

    public async add() {
        const { ctx } = this
        ctx.body = this.ctx.helper.success(await ctx.service.room.add())
    }

    public async join() {
        let { ctx } = this
        ctx.body = this.ctx.helper.success(await ctx.service.room.join())
    }
}