import { Controller } from 'egg'
import Game from '../classes/Game'
import GameUser from '../classes/GameUser'
import actions from '../consts/actions'

export default class GameController extends Controller {
    public async start() {
        let { ctx } = this
        ctx.body = ctx.helper.success(await ctx.service.game.start())
    }

    public async deal() {
        let { ctx } = this
        ctx.body = ctx.helper.success(await ctx.service.game.deal())
    }

    /**
     * 出牌
     */
    public async chupai(socket) {
        let { ctx } = this
        let arg = socket.args[0]
        let pai = arg.pai
        let user = await ctx.helper.getUser()
        let gameData = await ctx.service.game.getGameByGameNumber(user.gameNumber)
        let game: Game = new Game(gameData)
        let gameUser: GameUser =  game.gameUsers[user.id]

        // 如果不该他出，则忽略
        if (game.turn != gameUser.seatIndex) {
            this.app.logger.error('not your turn game' + game.number + ' user' + user.name)
            return
        }

        if (gameUser.hasOperations()) {
            this.app.logger.error('plz guo before you chupai' + game.number + ' user' + user.name)
            return
        }

        // 从此人牌中扣除
        let index = gameUser.holds.indexOf(pai)
        if (index == -1) {
            this.app.logger.error('can not find pai' + pai + ' ' + game.number + ' user' + user.name)
            return
        }
        gameUser.canChuPai = false
        game.chupaiCount++
        gameUser.holds.splice(index, 1)
        gameUser.countMap[pai]--
        game.chupai = pai
        game.recordGameAction(gameUser.seatIndex, actions.ACTION_CHUPAI, pai)
        gameUser.checkCanTingPai()

        // userMgr.broacastInRoom('game_chupai_notify_push', { userId: seatData.userId, pai: pai }, seatData.userId, true)

        let users =  Object.keys(game.gameUsers)
        for (let i = 0; i < users.length; i++) {
            let theGameUser = game.gameUsers[users[i]]
            // 玩家自己不检查
            if (theGameUser.seatIndex === game.turn) {
                continue
            }
            game.checkUserCanHu(theGameUser.seatIndex, pai)
            game.checkUserCanPeng(theGameUser.seatIndex, pai)
            game.checkUserCanDianGang(theGameUser.seatIndex, pai)
            if (theGameUser.hasOperations()) {
                // sendOperations(game, ddd, game.chuPai)
            }
        }
    }
}