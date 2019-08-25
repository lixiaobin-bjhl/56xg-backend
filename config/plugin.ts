
import { EggPlugin } from 'egg'

const plugin: EggPlugin = {
    io: {
        enable: true,
        package: 'egg-socket.io'
    },
    redis: {
        enable: true,
        package: 'egg-redis'
    },
    cors: {
        enable: true,
        package: 'egg-cors'
    },
    sessionRedis: {
        enable: true,
        package: 'egg-session-redis'
    }
    // static: true,
    // nunjucks: {
    //   enable: true,
    //   package: 'egg-view-nunjucks',
    // }
}

export default plugin
