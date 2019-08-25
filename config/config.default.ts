import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1566266472492_815'

    // add your egg config in here
    config.middleware = []
    config.redis = {
        client: {
            port: 6379,          // Redis port
            host: '118.190.206.102',   // Redis host
            password: 'lixiaobin',
            db: 0
        },
        agent: true
    }
    config.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    }
    config.security = {
        domainWhiteList: ['http://127.0.0.1:7001'],
        csrf: {
            ignore: '/'
        }
    }
    // config.sessionRedis = {
    //     name: 'session'
    // }
    // add your special config in here
    const bizConfig = {
        sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    }

    // the return config will combines to EggAppConfig
    return {
        ...config,
        ...bizConfig,
    }
}
