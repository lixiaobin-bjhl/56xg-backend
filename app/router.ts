
import { Application } from 'egg'

export default (app: Application) => {
    const { controller, router } = app

    router.get('/', controller.home.index)

    router.post('/room/list.json', controller.room.list)
    router.post('/room/add.json', app.middleware.auth(), controller.room.add)
    router.post('/room/join.json', app.middleware.auth(), controller.room.join)

    router.get('/mj/shuffle.json', controller.mj.shuffle)
    router.post('/mj/deal.json', controller.mj.deal)

    router.post('/game/start.json', app.middleware.auth(), controller.game.start)
    router.post('/game/deal.json', app.middleware.auth(), controller.game.deal)

    router.post('/login.json', controller.home.login)
    router.post('/info.json', controller.home.info)

    // app.io.of('/').route('login', controller.login.index)
    let nsp = app.io.of('/')

    nsp.on('connection', async () => {
        // console.log(socket)
        console.log('connection')
    })
    nsp.on('disconnecting', () => {
        console.log('disconnecting')
    })
    nsp.on('disconnect', () => {
        console.log('disconnect')
    })
    nsp.on('error', () => {
        console.log('error')
    })
}