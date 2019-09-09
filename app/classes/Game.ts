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
    turn = -1
    chupaiCount = 0
    // 当前出的牌
    chupai = -1
    // 操作记录
    actionList: Array<any> []
    constructor(options) {
        this.number = options.number
        this.room = options.room
        this.roomId = options.room.id
        let gameUsers = {}
        options.room.seats.forEach((item: any) => {
            gameUsers[item.userId] = new GameUser(item)
        })
        this.gameUsers = gameUsers
        this.mahjongs = options.mahjongs || this.shuffle()
        this.createTime = options.createTime || new Date().getTime()
        this.chupaiCount = options.chupaiCount
        this.actionList = options.actionList
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
     * 检测是否有人胡牌
     *
     * @param {number} seatIndex 坐位号
     * @param {number} pai 别人出的牌
     */
    checkUserCanHu(seatIndex, pai) {
        let gameUser = this.getUserBySeatIndex(seatIndex)
        gameUser.canHu = false
        for (let k in gameUser.tingMap) {
            if (pai == k) {
                gameUser.canHu = true
            }
        }
    }

    /**
     * 检测是否有人胡牌
     *
     * @param {number} seatIndex 坐位号
     * @param {number} pai 别人出的牌
     */
    checkUserCanPeng(seatIndex, pai) {
        let gameUser = this.getUserBySeatIndex(seatIndex)
        let count = gameUser.countMap[pai]
        if (count && count >= 2) {
            gameUser.canPeng = true
        }
    }

    /**
     * 检测是否可以顶杠
     *
     * @param {number} seatIndex 坐位号
     * @param {number} pai 别人出的牌
     */
    checkUserCanDianGang(seatIndex, pai) {
        // 如果没有牌了，则不能再杠
        if (this.mahjongs.length <= this.currentIndex) {
            return
        }
        let gameUser = this.getUserBySeatIndex(seatIndex)
        let count = gameUser.countMap[pai]
        if (count != null && count >= 3) {
            gameUser.canGang = true
            gameUser.gangPai.push(pai)
            return
        }
    }

    /**
     * 通过玩家坐位号获取用户对象
     *
     * @param {number} seatIndex 坐位号
     */
    getUserBySeatIndex(seatIndex) {
        let users = Object.keys(this.gameUsers)
        for (let i = 0; i < 40; ++i) {
            let gameUser = this.gameUsers[users[i]]
            if (gameUser.seatIndex === seatIndex) {
                return this.gameUsers[users[i]]
            }
        }
    }

    /**
     * 记录用户的操作
     *
     * @param {number} seatIndex 坐位号
     * @param {number} action 行为号
     * @param {number} pai 牌号
     */
    recordGameAction(seatIndex, action, pai) {
        this.actionList.push(seatIndex)
        this.actionList.push(action)
        if (pai != null) {
            this.actionList.push(pai)
        }
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
        if (this.turn > -1) {
            // 庄家，多模一张牌
            this.getUserBySeatIndex(this.turn).mopai(this)
        }
    }
}