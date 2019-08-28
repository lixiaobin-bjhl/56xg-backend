
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
}

export default plugin
