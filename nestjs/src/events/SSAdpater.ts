import { IoAdapter } from '@nestjs/platform-socket.io';

import * as ss from 'socket.io-stream';
export class SSAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    return ss();
  }
}
