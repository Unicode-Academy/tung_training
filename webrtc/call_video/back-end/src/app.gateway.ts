import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
interface RoomInterface {
  roomId: string;
  userId: string;
  clients: string[];
}
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  rooms: RoomInterface[] = [];

  afterInit(server: Server) {
    console.log('Server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // @SubscribeMessage('message')
  // handleMessage(client: Socket, payload: string): void {
  //   this.server.emit('message', `Server: Received your message -> ${payload}`);
  // }

  @SubscribeMessage('create-meet')
  createMeet(client: Socket, payload: any) {
    if (this.rooms.find((room) => room.roomId === payload.roomId)) {
      client.emit('error', 'Room already exists');
      return;
    }
    this.rooms.push({ ...payload, clients: [] });
    this.server.emit('create-meet', payload);

    console.log(this.rooms);
  }

  @SubscribeMessage('join-meet')
  joinMeet(client: Socket, payload: any) {}
}
