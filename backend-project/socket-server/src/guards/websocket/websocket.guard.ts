import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class WebsocketGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //Gọi client socket
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake.headers.authorization.split(' ')[1];
    if (token !== 'ahihi') {
      throw new WsException('Unauthorized');
    }

    return true;
  }
}
