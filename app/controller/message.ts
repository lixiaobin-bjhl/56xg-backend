
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

    /*
     * 加入房间
     */
    async joinRoom(socket) {
        let { ctx } = this
        let args = socket.args
        let roomId = args[0].roomId
        socket.join(roomId)
        if (args[1] && typeof args[1] == 'function') {
            args[1]()
        }
        await ctx.helper.sendMessage(roomId, 'join-room', {})
    }
}

export default MessageController