/**
 * 游戏玩家类
 */

import Game from './Game'

export default class GameUser {
    id: string|number
    // 手牌
    holds: Array<number> = []
    // 坐位号
    seatIndex: number
    // 是否可以杠
    canGang = false
    // 是否可碰
    canPeng = false
    // 是否可胡
    canHu = false
    // 是否可以出牌
    canChuPai = false
    // 统计牌信息，用于计算碰、杠、糊操作等
    countMap: Object = {}
    // 听牌内容
    tingMap: {}
    // 记录玩家可杠的牌
    gangPai: []
    constructor(options) {
        Object.assign(this, options)
    }

    /**
     * 用户是否有操作
     */
    hasOperations() {
        if (this.canGang || this.canPeng || this.canHu) {
            return true
        }
        return false
    }

    /**
     * 检测是否可以听牌
     */
    checkCanTingPai() {
        this.tingMap = {}
        // 检查是否是七对 前提是没有碰，也没有杠 ，即手上拥有13张牌
        if (this.holds.length == 13) {
            // 有5对牌
            let danPai = -1
            let pairCount = 0
            let longqidui = false
            for (let k in this.countMap) {
                let c = this.countMap[k]
                if (c == 2 || c == 3) {
                    pairCount++
                } else if (c == 4) {
                    longqidui = true
                    pairCount += 2
                }
                if (c == 1 || c == 3) {
                    // 如果已经有单牌了，表示不止一张单牌， 不可能是7对了
                    if (danPai >= 0) {
                        break
                    }
                    danPai = Number(k)
                }
            }

            if (pairCount === 6) {
                this.tingMap[danPai] = {
                    // 龙7对8番 普通7对番
                    fan: longqidui ? 8 : 4,
                    pattern: '7pairs'
                }
            }
            // 7对了，就别往下检测了
            return
        }

        // 检查是否是对对胡  因为没有吃，所以只需要检查手上的牌
        // 对对胡叫牌有两种情况
        // 1、N坎 + 1张单牌
        // 2、N-1坎 + 两对牌
        let singleCount = 0
        let pairCount = 0
        let arr: Array<string> = []
        for (let k in this.countMap) {
            let c = this.countMap[k]
            if (c == 1) {
                singleCount++
                arr.push(k)
            } else if (c == 2) {
                pairCount++
                arr.push(k)
            } else if (c == 4) {
                // 手上有4个一样的牌
                singleCount++
                pairCount += 2
            }
        }
        // 吊单张或两对倒
        if ((pairCount == 2 && singleCount == 0) || (pairCount == 0 && singleCount == 1)) {
            arr.forEach((pai) => {
                if (!this.tingMap[pai]) {
                    this.tingMap[pai] = {
                        pattern: 'duidui',
                        fan: 2
                    }
                }
            })
        }
        this.checkTingPai(0, 9)
    }

    /**
     * 检测某花色牌是否成圆，0-9 是筒   9-18是条
     *
     * @param {number} begin
     * @param {number} end
     */
    checkTingPai(begin, end) {
        for (let i = begin; i < end; ++i) {
            // 如果这牌已经在和了，就不用检查了
            if (this.tingMap[i] != null) {
                continue
            }
            // 将牌加入到手排及计数中，加入手牌看是否可以胡牌，如果可以胡，说明就是听这个牌
            let old = this.countMap[i]
            if (!old) {
                old = 0
                this.countMap[i] = 1
            } else {
                this.countMap[i]++
            }
            this.holds.push(i)
            // 逐个判定手上的牌
            let ret = this.checkCanHu()
            if (ret) {
                // 平胡 0番
                this.tingMap[i] = {
                    pattern: 'normal',
                    fan: 1
                }
            }
            // 搞完以后，撤消刚刚加的牌
            this.countMap[i] = old
            this.holds.pop()
        }
    }

    /**
     * 检查是否可以胡牌
     */
    checkCanHu() {
        for (let k in this.countMap) {
            let c = this.countMap[k]
            if (c < 2) {
                continue
            }
            // 如果当前牌大于等于２，则将它选为将牌 TODO
            // 当前牌等于
            if (c === 2) {
                this.countMap[k] -= 2
            }

            // 逐个判定剩下的牌是否满足３Ｎ规则,一个牌会有以下几种情况
            // 1、0张，则不做任何处理
            // 2、2张，则只可能是与其它牌形成匹配关系
            // 3、3张，则可能是单张形成 A-2,A-1,A  A-1,A,A+1  A,A+1,A+2，也可能是直接成为一坎
            // 4、4张，则只可能是一坎+单张
            // kanzi = []
            // 按单张检测，是否团圆
            let ret = this.checkSingle()
            if (c === 2) {
                this.countMap[k] += 2
            }
            if (ret) {
                return true
            }
        }
    }

    checkSingle() {
        let holds = this.holds
        let selected = -1
        let c = 0
        for (let i = 0; i < holds.length; ++i) {
            let pai = holds[i]
            c = this.countMap[pai]
            if (c != 0) {
                selected = pai
                break
            }
        }
        // 如果没有找到剩余牌，则表示匹配成功了
        if (selected == -1) {
            return true
        }
        // 否则，进行匹配
        if (c == 3) {
            // 直接作为一坎
            this.countMap[selected] = 0
            let ret = this.checkSingle()
            // 立即恢复对数据的修改
            this.countMap[selected] = c
            if (ret === true) {
                return true
            }
        } else if (c == 4) {
            // 直接作为一坎
            this.countMap[selected] = 1
            let ret = this.checkSingle()
            // 立即恢复对数据的修改
            this.countMap[selected] = c
            // 如果作为一坎能够把牌匹配完，直接返回TRUE。
            if (ret === true) {
                return true
            }
        }
        // 按单牌处理
        return this.matchSingle(selected)
    }

    matchSingle(selected) {
        // 分开匹配 A-2,A-1,A
        let matched = true
        let v = selected % 9
        if (v < 2) {
            matched = false
        } else {
            for (let i = 0; i < 3; ++i) {
                let t = selected - 2 + i
                let cc = this.countMap[t]
                if (!cc) {
                    matched = false
                    break
                }
            }
        }
        // 匹配成功，扣除相应数值
        if (matched) {
            this.countMap[selected - 2]--
            this.countMap[selected - 1]--
            this.countMap[selected]--
            let ret = this.checkSingle()
            this.countMap[selected - 2]++
            this.countMap[selected - 1]++
            this.countMap[selected]++
            if (ret === true) {
                return true
            }
        }

        // 分开匹配 A-1,A,A + 1
        matched = true
        if (v < 1 || v > 7) {
            matched = false
        } else {
            for (let i = 0; i < 3; ++i) {
                let t = selected - 1 + i
                let cc = this.countMap[t]
                if (cc == null) {
                    matched = false
                    break
                }
                if (cc == 0) {
                    matched = false
                    break
                }
            }
        }

        // 匹配成功，扣除相应数值
        if (matched) {
            this.countMap[selected - 1]--
            this.countMap[selected]--
            this.countMap[selected + 1]--
            let ret = this.checkSingle()
            this.countMap[selected - 1]++
            this.countMap[selected]++
            this.countMap[selected + 1]++
            if (ret == true) {
                return true
            }
        }

        // 分开匹配 A,A+1,A + 2
        matched = true
        if (v > 6) {
            matched = false
        } else {
            for (let i = 0; i < 3; ++i) {
                let t = selected + i
                let cc = this.countMap[t]
                if (cc == null) {
                    matched = false
                    break
                }
                if (cc == 0) {
                    matched = false
                    break
                }
            }
        }

        // 匹配成功，扣除相应数值
        if (matched) {
            this.countMap[selected]--
            this.countMap[selected + 1]--
            this.countMap[selected + 2]--
            let ret = this.checkSingle()
            this.countMap[selected]++
            this.countMap[selected + 1]++
            this.countMap[selected + 2]++
            if (ret == true) {
                return true
            }
        }
        return false
    }

    /**
     * 摸牌
     *
     * @param game 游戏对象
     * @param userId 用户id
     *
     * @return pai 牌对象
     */
    mopai(game: Game) {
        // 搞穿了
        if (game.currentIndex == game.mahjongs.length) {
            return -1
        }
        let pai = game.mahjongs[game.currentIndex]
        let count = this.countMap[pai]
        if (typeof count === 'undefined') {
            count = 0
        }
        this.countMap[pai] = count + 1
        game.currentIndex++
        this.holds.push(pai)
        return pai
    }
}