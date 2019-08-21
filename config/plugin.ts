
import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    io: {
        enable: true,
        package: 'egg-socket.io'
    }
    // static: true,
    // nunjucks: {
    //   enable: true,
    //   package: 'egg-view-nunjucks',
    // }
};

export default plugin;
