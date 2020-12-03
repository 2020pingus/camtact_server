import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Response } from 'express';
import { RedisService } from 'nestjs-redis';
import { Observable } from 'rxjs';
import { Server, Socket } from 'socket.io';

// @UseInterceptors(new TransformInterceptor())
@WebSocketGateway(80, { secure: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private testers: Map<string, boolean>;
  private socketMaptesters: Map<string, string>;
  constructor() {
    this.testers = new Map();
    this.socketMaptesters = new Map();
  }

  handleDisconnect({ id }: any) {
    if (
      this.socketMaptesters.get(id) &&
      this.testers.get(this.socketMaptesters.get(id))
    ) {
      console.log(`unset ${this.socketMaptesters.get(id)}`);
      this.testers.delete(this.socketMaptesters.get(id));
    }
  }

  handleConnection(client: any, ...args: any[]) {
    console.log(`connected ${client.id}`);
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('tester_join')
  async identity(
    @MessageBody() id: string,
    @ConnectedSocket() socket: Socket,
  ): Promise<string> {
    if (this.testers.has(id)) {
      console.log(`already have ${id}`);
      return '0';
    }
    this.socketMaptesters.set(socket.id, id);
    this.testers.set(id, true);
    console.log(`set ${id}`);

    return '1';
  }
}

// class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler,
//   ): Observable<Response<T>> {
//     return next.handle().pipe(map((data) => ({ data })));
//   }
// }
