/**
 * 洗牌
 */

export default function () {
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