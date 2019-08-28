import { Controller } from 'egg'

export default class HomeController extends Controller {
    public async index() {
        let { ctx } = this
        ctx.body = await ctx.service.test.sayHi('egg')
    }

    public async login() {
        let { ctx } = this
        ctx.session['user'] = ctx.request.body.user
        ctx.body = await ctx.helper.success({})
    }

    public async info() {
        let { ctx } = this
        ctx.body = ctx.helper.success(ctx.session['user'] || null)
    }
}