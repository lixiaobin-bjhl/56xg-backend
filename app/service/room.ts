import { Service } from 'egg'
import Room from '../classes/Room'

export default class RoomService extends Service {
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

    async detail() {
        let room = await this.getRoomByRoomId(this.ctx.request.body.roomId)
        if (room) {
            let sockets = await this.ctx.helper.getSocketList()
            room.seats.forEach((item) => {
                Object.assign(item, sockets[item.userId])
            })
            return room
        } else {
            return '房间不存在'
        }
    }

    /**
     * 离开房间
     */
    async leave() {
        let { ctx } = this
        let user = await ctx.helper.getUser()
        let roomId = user.roomId
        if (roomId) {
            let room = await this.getRoomByRoomId(roomId)
            debugger
            if (room) {
                for (let i = 0; i < room.seats.length; i++) {
                    if (room.seats[i].userId === user.id) {
                        room.seats[i] = {}
                        break
                    }
                }
            } else {
                return '你所在的房间不存在'
            }
            let rooms = await ctx.helper.getRooms()
            rooms[roomId] = room
            user.roomId = null
            ctx.session.user = JSON.stringify(user)
            await ctx.helper.sendMessageToRoom(roomId, 'leave-room', rooms)
            await this.updateRooms(rooms)
        } else {
            return '你还没有进入房间'
        }

    }

    /**
     * 根据房间id查找room对象
     *
     * @param {number} roomId  房间id
     */
    async getRoomByRoomId(roomId) {
        let { ctx } = this
        let rooms = await ctx.app.redis.get('rooms')
        if (rooms) {
            rooms = JSON.parse(rooms)
            return rooms[roomId]
        }
        return '房间不存在'
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
        let { ctx } = this
        let rooms = await ctx.helper.getRooms()
        let roomId = this.generateRoomId()
        // 房间重了, 重新新建
        if (rooms[roomId]) {
            this.createRoom(name)
            return
        }
        let user = await ctx.helper.getUser()
        let userId = user.id
        let room = new Room({
            id: roomId,
            name: name,
            createTime: new Date().getTime(),
            userId: userId,
            seats: []
        })
        for (let i = 0; i < 3; ++i) {
            let uId: string|number = ''
            // 创建者占第一个坐
            if (!i) {
                uId = userId
            }
            let seat: Seat = {
                userId: uId
            }
            room.addSeat(seat)
        }
        rooms[roomId] = room
        await this.updateRooms(rooms)
        return room
    }

    async updateRooms(rooms) {
        await this.ctx.app.redis.set('rooms', JSON.stringify(rooms))
    }
    /**
     * 加入房间
     *
     * @param {number} roomId 房间id
     */
    async join() {
        let { ctx } = this
        let roomId = ctx.request.body.roomId
        let rooms = await ctx.helper.getRooms()
        let user = await ctx.helper.getUser()
        let room = rooms[roomId]
        if (room) {
            let seats = room.seats
            // 看是否已经在房间中
            if (seats.some((item): boolean => {
                if (item.userId === user.id) {
                    return true
                }
                return false
            })) {
                user.roomId = roomId
                ctx.session.user = JSON.stringify(user)
                return {
                    count: seats.filter((item) => {
                        return item.userId
                    }).length,
                    roomId: roomId
                }
            }
            // 占房间中剩余的第一个空位
            if (!seats.some((item): boolean => {
                if (!item.userId) {
                    item.userId = user.id
                    return true
                }
                return false
            })) {
                return '房间已满'
            } else {
                let r: Room = new Room({
                    id: roomId,
                    name: room.name,
                    seats: room.seats
                })
                this.app.logger.info(user.id + ' join room ' + roomId)
                r.addSeat({
                    userId: user.id
                })
                rooms[roomId] = r
                user.roomId = roomId
                ctx.session.user = JSON.stringify(user)
                await this.updateRooms(rooms)
                let count = r.getSeatCount()
                // 人满了, 创建游戏
                if (count === 3) {
                    ctx.service.game.createGame(roomId)
                }
                return {
                    count: count,
                    roomId: roomId
                }
            }
        } else {
            this.app.logger.error('房间不存在', JSON.stringify({
                user,
                roomId
            }))
            return '房间不存在'
        }
    }
}
