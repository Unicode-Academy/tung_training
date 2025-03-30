import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
  },
  namespace: '/notification',
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    console.log('[Notification] Server Socket initialized');
  }

  handleConnection(client: Socket) {
    console.log('[Notification] Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('[Notification] Client disconnected', client.id);
  }

  @SubscribeMessage('send-message')
  handleSendMessage(client: any, payload: any) {
    console.log('Notification');

    this.server.emit('new-message', payload);
  }
}

//Socket Server --> Init --> Connect --> Listen --> Emit --> Disconnect
