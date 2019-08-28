import { Service } from 'egg'

export default class Room extends Service {
    /**
     * 获取房间列表
     */
    async list() {
        let { ctx } = this
        let rooms = await ctx.app.redis.get('rooms')
        if (rooms) {
            rooms = JSON.parse(rooms)
        }
        return rooms
    }

    /**
     * 创建房间
     */
    async add() {
        let query = this.ctx.request.body
        let roomInfo = await this.createRoom(query.name)
        return roomInfo
    }
    /**
     * 创建一个6位房间号
     */
    generateRoomId() {
        let roomId = ''
        for (let i = 0; i < 6; ++i) {
            roomId += String(Math.floor(Math.random() * 10))
        }
        return Number(roomId)
    }
    async getRoomByUserId(userId) {
        let { ctx } = this
        let rooms = await ctx.app.redis.get('rooms')
        let result = null
        if (rooms) {
            rooms = JSON.parse(rooms)
        }
        for (let key in rooms) {
            if (rooms.hasOwnProperty(key)) {
                if (rooms[key].seats.some((item) => {
                    return item.userId == userId
                })) {
                    result = rooms[key]
                    break
                }
            }
        }
        return result
    }
    /**
     * 创建房间
     *
     * @param {string} name 房间名称
     */
    async createRoom(name: string) {
        let roomId = this.generateRoomId()
        let userId = await this.ctx.session.user
        interface RoomInfo {
            id: number;
            name: string;
            seats: Array<object>;
        }
        let roomInfo: RoomInfo = {
            id: roomId,
            name,
            seats: []
        }
        interface Seat {
            userId: string | number;
        }
        for (let i = 0; i < 4; ++i) {
            let uId: string|number = ''
            // 创建者占第一个坐
            if (!i) {
                uId = userId
            }
            let seat: Seat = {
                userId: uId
            }
            roomInfo.seats.push(seat)
        }
        let rooms = await this.ctx.app.redis.get('rooms') || '{}'
        rooms = JSON.parse(rooms)
        rooms[roomId] = roomInfo
        await this.ctx.app.redis.set('rooms', JSON.stringify(rooms))
        return roomInfo
    }
    /**
     * 加入房间
     *
     * @param {number} roomId 房间id
     */
    async join() {
        let { ctx } = this
        let roomId = ctx.request.body.roomId
        let rooms = await ctx.app.redis.get('rooms')
        let user = ctx.session.user
        rooms = JSON.parse(rooms)
        let room =  rooms[roomId]
        if (room) {
            let seats = room.seats
            // 占房间中剩余的第一个空位
            if (!seats.some((item): boolean => {
                if (!item.userId) {
                    item.userId = user
                    return true
                }
                return false
            })) {
                return '房间已满'
            }
        } else {
            this.app.logger.error('房间不存在', JSON.stringify({
                user,
                roomId
            }))
        }
    }
}
