// This file is created by egg-ts-helper@1.25.5
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/Test';
import ExportGame from '../../../app/service/game';
import ExportMj from '../../../app/service/mj';
import ExportRoom from '../../../app/service/room';

declare module 'egg' {
  interface IService {
    test: ExportTest;
    game: ExportGame;
    mj: ExportMj;
    room: ExportRoom;
  }
}
