const Controller = require('egg').Controller
class DefaultController extends Controller {
    /**
     * 客户端心跳处理
     */
    async ping(socket) {
        let list = await this.ctx.helper.getSocketList()
        const query = socket.handshake.query
        list[query.uid].lastTimestamp = Number(new Date())
        list[query.uid].online = 1
        list[query.uid].sid = socket.id
        await this.app.redis.set('ht:xq:cache:sockets', JSON.stringify(list))
    }
}

export default DefaultController
