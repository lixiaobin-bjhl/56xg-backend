
import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/', controller.home.index);
    router.get('/socketList.io', controller.message.list);
    // 心跳
    app.io.of('/').route('heartbeat', controller.message.ping);
    // 评论
    app.io.of('/').route('comment', controller.message.comment);
    app.io.of('/').route('move-task', controller.message.moveTask);
    app.io.of('/').route('assign-task', controller.message.assignTask);

    let nsp = app.io.of('/');
    nsp.on('connection', async (socket) => {
        let sockets = await app.redis.get('ht:xq:cache:sockets');
        const query = socket.handshake.query;
        let list = {};
        let sid = socket.id;
        let uid = query.uid;
        let umail = query.umail;
        if (sockets) {
            list = JSON.parse(sockets);
        }
        list[uid] = {
            uid,
            sid,
            umail,
            online: 1,
            lastTimestamp: Number(new Date())
        };
        await app.redis.set('ht:xq:cache:sockets', JSON.stringify(list));
        app.logger.info('online', umail);
        // await app.io.sockets.to(sid).emit('message'
        await socket.broadcast.emit('message', {
            type: 'online',
            uid,
            sid,
            umail
        });
    });
    nsp.on('disconnecting', () => {
        console.log('disconnecting');
    });
    nsp.on('disconnect', () => {
        console.log('disconnect');
    });
    nsp.on('error', () => {
        console.log('error');
    });
};