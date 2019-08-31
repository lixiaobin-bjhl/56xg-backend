/**
 * 游戏玩家类
 */

import Game from './Game'

export default class GameUser {
    id: string|number
    // 手牌
    holds: Array<number> = []
    // 统计牌信息，用于计算碰、杠、糊操作等。
    countMap: Object = {}
    constructor(options) {
        this.id = options.id
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