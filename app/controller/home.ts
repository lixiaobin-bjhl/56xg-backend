import { Controller } from 'egg'

export default class HomeController extends Controller {
    public async index() {
        let { ctx } = this
        ctx.body = await ctx.service.test.sayHi('egg')
    }

    public async login() {
        let { ctx } = this
        let user = ctx.request.body.user
        let u = {
            id: user,
            name: user
        }
        ctx.session['user'] = JSON.stringify(u)
        ctx.body = await ctx.helper.success(u)
    }

    public async info() {
        let { ctx } = this
        ctx.body = ctx.helper.success(ctx.session['user'] ? JSON.parse(ctx.session['user']) : null)
    }
}