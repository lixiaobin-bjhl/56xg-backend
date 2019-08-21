import 'egg';

declare module 'egg' {
    interface EggRedisOptions {
        Redis?: Redis;
        default?: object;
        app?: boolean;
        agent?: boolean;
        client?: ClusterOptions;
        clients?: Record<string, RedisOptions>;
    }

    interface Application {
        redis: Redis;
    }
    interface EggAppConfig {
        redis: EggRedisOptions;
    }

    export interface Application {
        io: EggIOServer & EggSocketNameSpace & EggSocketIO;
    }

    export interface Context {
        socket: Socket;
    }
    interface EggSocketNameSpace extends SocketNameSpace {
    // Forward the event to the Controller
        route(event: string, handler: Function): any;
        on(event: string, handler: Function): any;
        socket: {
            broadcast: {
                emit(event: string, arg: object): any;
            };
        };
        sockets: {
            to(socket: string): any;
            broadcast: {
                emit(event: string, arg: object): any;
            };
        };
    }

    // Because SocketIO's Server's of's interface
    // doesn't have 'route'. So we must rewrite it
    interface EggIOServer extends SocketServer {
        of(nsp: string): EggSocketNameSpace;
    }
    interface EggSocketIO {
        middleware: CustomMiddleware;
        controller: CustomController;
    }

    /**
   * your own Middleware
   *
   * @example
   *```bash
   * {
   *    auth: auth;
   *    filter: filter;
   * }
   * ```
   */
    interface CustomMiddleware {}

    /**
   * your own Controler
   * ```bash
   * {
   *    chat: Chat
   * }
   * ```
   */
    interface CustomController {}
}
