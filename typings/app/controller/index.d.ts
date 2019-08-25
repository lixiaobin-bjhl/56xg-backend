// This file is created by egg-ts-helper@1.25.5
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportLogin from '../../../app/controller/login';
import ExportMessage from '../../../app/controller/message';
import ExportRoom from '../../../app/controller/room';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    login: ExportLogin;
    message: ExportMessage;
    room: ExportRoom;
  }
}
