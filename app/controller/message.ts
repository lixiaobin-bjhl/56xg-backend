
const Controller = require('egg').Controller

class MessageController extends Controller {
    /**
     * 客户端心跳处理
     */
    async ping(socket) {
        let { ctx } = this
        let list = await ctx.helper.getSocketList()
        let user = await ctx.helper.getUser()
        let userId = user.id
        list[userId].lastTimestamp = Number(new Date())
        list[userId].online = 1
        list[userId].sid = socket.id
        await this.app.redis.set('cache:sockets', JSON.stringify(list))
    }
}

export default MessageController