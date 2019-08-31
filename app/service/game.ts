
import { Service } from 'egg'

/**
 * ms service
 */
export default class GameService extends Service {
    /**
     * 开始游戏
     */
    async start(roomId) {
        let { ctx } = this
        // let user = ctx.session.user
        let room = ctx.service.room.getRoomByRoomId(roomId)
        return room
    }
}
