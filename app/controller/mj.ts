import { Controller } from 'egg'

export default class MJController extends Controller {
    public async shuffle() {
        let { ctx } = this
        ctx.body = ctx.helper.success(ctx.service.mj.shuffle())
    }
}