module.exports = () => {
    return async function auth(ctx, next) {
        if (!ctx.session.user) {
            ctx.body = ctx.helper.error(1000000500, '用户未登录')
            return
        }
        await next()
    }
}