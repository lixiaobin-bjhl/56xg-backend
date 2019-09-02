/**
 * 游戏类
 */

import GameUser from './GameUser'

export default class Game {
    createTime: number
    number: string
    currentIndex = 0
    roomId: number
    mahjongs: Array<number> = []
    room: Object = {}
    gameUsers: Object = {}
    turn: string|number

    constructor(options) {
        this.number = options.number
        this.room = options.room
        this.roomId = options.room.id
        let gameUsers = {}
        options.room.seats.forEach((item: any) => {
            gameUsers[item.userId] = new GameUser(item.userId)
        })
        this.gameUsers = gameUsers
        this.mahjongs = options.mahjongs || this.shuffle()
        this.createTime = options.createTime || new Date().getTime()
    }

    /**
     * 洗牌
     */
    shuffle() {
        // 筒 (0 ~ 8 表示筒子
        let index = 0
        let mahjongs: Array<number> = []
        for (let i = 0; i < 9; ++i) {
            for (let c = 0; c < 4; ++c) {
                mahjongs[index] = i
                index++
            }
        }
        // 条 9 ~ 17表示条子
        for (let i = 9; i < 18; ++i) {
            for (let c = 0; c < 4; ++c) {
                mahjongs[index] = i
                index++
            }
        }

        // 中发白
        // 18 ~ 21表示中发白
        for (let i = 18; i < 21; ++i) {
            for (let c = 0; c < 4; ++c) {
                mahjongs[index] = i
                index++
            }
        }
        // 打乱顺序
        for (let i = 0; i < mahjongs.length; ++i) {
            let lastIndex = mahjongs.length - 1 - i
            let index = Math.floor(Math.random() * lastIndex)
            let t = mahjongs[index]
            mahjongs[index] = mahjongs[lastIndex]
            mahjongs[lastIndex] = t
        }
        return mahjongs
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