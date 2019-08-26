
import { Application } from 'egg'

export default (app: Application) => {
    const { controller, router } = app

    router.get('/', controller.home.index)
    router.post('/room/list.json', controller.room.list)
    router.post('/room/add.json', controller.room.add)

    app.io.of('/').route('login', controller.login.index)
    let nsp = app.io.of('/')
    nsp.on('connection', async (socket) => {
        const query = socket.handshake.query
        console.log(query.name + ' connection')
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