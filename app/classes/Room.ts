/**
 * 房间类
 */

export default class Room {
    // 房间id
    id = 0
    // 房间名称
    name = ''
    // 房间坐位
    seats: Array<Seat> = []
    // 当前的游戏对象
    game
    constructor(option: any) {
        this.id = option.id
        this.name = option.name
        this.seats = option.seats || []
    }
    addSeat(seat) {
        if (this.seats.length < 3) {
            this.seats.push(seat)
        }
    }
    /**
     * 获取已占座位的数量
     *
     * @returns number
     */
    getSeatCount() {
        return this.seats.filter((item) => {
            return item.userId
        }).length
    }
}