/**
 * 游戏类
 */

import GameUser from './GameUser'

export default class Game {
    createTime: number
    number: string
    currentIndex = 0
    mahjongs: Array<number> = []
    gameUsers: Object = {}
    turn = 0
    chupaiCount = 0
    // 当前出的牌
    chupai = -1
    // 操作记录
    actionList: Array<any> []
    constructor(options) {
        this.number = options.number
        let gameUsers = {}
        options.seats.forEach((item: any, index) => {
            // 玩家是否有坐位号，有坐位号说明初始化过
            if (options.gameUsers && typeof options.gameUsers[item.userId].seatIndex == 'number') {
                gameUsers[item.userId] = new GameUser(options.gameUsers[item.userId])
            } else {
                item.seatIndex = index
                gameUsers[item.userId] = new GameUser(item)
            }
        })
        this.gameUsers = gameUsers
        this.mahjongs = options.mahjongs || this.shuffle()
        this.createTime = options.createTime || new Date().getTime()
        this.chupaiCount = options.chupaiCount || 0
        this.actionList = options.actionList || []
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
        let gameUser = this.getGameUserBySeatIndex(seatIndex)
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
        let gameUser = this.getGameUserBySeatIndex(seatIndex)
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
        let gameUser = this.getGameUserBySeatIndex(seatIndex)
        let count = gameUser.countMap[pai]
        if (count && count >= 3) {
            gameUser.canGang = true
            gameUser.gangPai.push(pai)
            return
        }
    }

    /**
     * 通过玩家id找到gameUser
     *
     * @param {number|string} userId
     */
    getGameUserByUserId(userId) {
        let users = Object.keys(this.gameUsers)
        for (let i = 0; i < users.length; ++i) {
            let gameUser = this.gameUsers[users[i]]
            if (gameUser.userId === userId) {
                return this.gameUsers[users[i]]
            }
        }
    }

    /**
     * 通过玩家坐位号获取用户对象
     *
     * getGameUserBySeatIndex seatIndex 坐位号
     */
    getGameUserBySeatIndex(seatIndex) {
        let users = Object.keys(this.gameUsers)
        for (let i = 0; i < users.length; ++i) {
            if (i === seatIndex) {
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
        for (let i = 0; i < 39; ++i) {
            let gameUser = this.gameUsers[users[seatIndex]]
            gameUser.mopai(this)
            seatIndex++
            seatIndex %= 3
        }
        // 庄家，多模一张牌
        this.getGameUserBySeatIndex(this.turn).mopai(this)
    }
}