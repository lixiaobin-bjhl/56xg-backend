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

    public async detail() {
        const { ctx } = this
        let result =  await ctx.service.room.detail()
        ctx.body = ctx.helper.response(result)
    }

    public async leave() {
        const { ctx } = this
        let result = await ctx.service.room.leave()
        ctx.body = ctx.helper.response(result)
    }

    public async join() {
        let { ctx } = this
        let result = await ctx.service.room.join()
        ctx.body = ctx.helper.response(result)
    }
}