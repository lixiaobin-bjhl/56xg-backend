// This file is created by egg-ts-helper@1.25.5
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGame from '../../../app/controller/game';
import ExportHome from '../../../app/controller/home';
import ExportLogin from '../../../app/controller/login';
import ExportMessage from '../../../app/controller/message';
import ExportMj from '../../../app/controller/mj';
import ExportRoom from '../../../app/controller/room';

declare module 'egg' {
  interface IController {
    game: ExportGame;
    home: ExportHome;
    login: ExportLogin;
    message: ExportMessage;
    mj: ExportMj;
    room: ExportRoom;
  }
}
