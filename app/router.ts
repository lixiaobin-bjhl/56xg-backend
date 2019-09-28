
import { Application } from 'egg'

export default (app: Application) => {
    const { controller, router } = app

    router.get('/', controller.home.index)

    router.post('/room/list.json', controller.room.list)
    router.post('/room/add.json', app.middleware.auth(), controller.room.add)
    router.post('/room/join.json', app.middleware.auth(), controller.room.join)
    router.post('/room/detail.json', app.middleware.auth(), controller.room.detail)
    router.post('/room/leave.json', app.middleware.auth(), controller.room.leave)

    router.get('/mj/shuffle.json', controller.mj.shuffle)
    router.post('/mj/deal.json', controller.mj.deal)

    router.post('/game/start.json', app.middleware.auth(), controller.game.start)
    router.post('/game/deal.json', app.middleware.auth(), controller.game.deal)

    router.post('/login.json', controller.home.login)
    router.post('/info.json', controller.home.info)

    app.io.of('/').route('join-room', controller.message.joinRoom)
    app.io.of('/').route('chupai', controller.game.chupai)
    app.io.of('/').route('heartbeat', controller.message.ping)

    let nsp = app.io.of('/')

    nsp.on('connection', async (socket) => {
        let sockets = await app.redis.get('cache:sockets')
        let list = {}
        let sid = socket.id
        const query = socket.handshake.query
        let roomId = query.roomId
        let uid = query.uid

        if (roomId) {
            socket.join(roomId)
            app.logger.info(uid + ' join room ' + roomId)
        }
        if (sockets) {
            list = JSON.parse(sockets)
        }
        list[uid] = {
            uid,
            sid,
            online: 1,
            lastTimestamp: Number(new Date())
        }
        await app.redis.set('cache:sockets', JSON.stringify(list))
        await socket.broadcast.emit('message', {
            type: 'online',
            uid,
            sid
        })
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