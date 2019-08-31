/**
 * 游戏类
 */
export default class Game {
    currentIndex = 0
    mahjongs: Array<number> = []
    room: Object = {}
    gameUsers: Object = {}
    turn: string|number
    constructor(options) {
        this.mahjongs = options.mahjongs
        this.room = options.room
        this.gameUsers = options.gameUsers
    }

    /**
     * k5x发牌
     */
    deal() {
        // 强制清0
        this.currentIndex = 0
        let seatIndex = 0
        let users = Object.keys(this.gameUsers)
        // 每人13张 一共 13*3 ＝ 39张 庄家多一张 40张
        for (let i = 0; i < 40; ++i) {
            let gameUser = this.gameUsers[users[seatIndex]]
            gameUser.mopai(this)
            seatIndex++
            seatIndex %= 3
        }
        // 庄家，多模一张牌
        if (this.turn) {
            this.gameUsers[this.turn].mopai(this)
        }
    }
}