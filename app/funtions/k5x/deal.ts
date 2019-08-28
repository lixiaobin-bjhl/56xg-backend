/**
 * 发牌
 */

/**
 * @param {Object} game 游戏对象
 */
export default function (game: Game) {
    // 强制清0
    game.currentIndex = 0

    // // 每人13张 一共 13*3 ＝ 39张 庄家多一张 40张
    // let seatIndex = game.button
    // for (let i = 0; i < 52; ++i) {
    //     let mahjongs = game.gameSeats[seatIndex].holds
    //     if (mahjongs == null) {
    //         mahjongs = []
    //         game.gameSeats[seatIndex].holds = mahjongs
    //     }
    //     mopai(game, seatIndex)
    //     seatIndex++
    //     seatIndex %= 4
    // }

}