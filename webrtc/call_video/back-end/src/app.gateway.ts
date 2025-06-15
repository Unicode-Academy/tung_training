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

  hostSocketId: string;

  afterInit(server: Server) {
    console.log('Server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const room = this.rooms.find((room) =>
      room.clients.find((user: any) => user.socketId === client.id),
    );
    if (room) {
      const user = room.clients[0];
      room.clients = room.clients.filter(
        (user: any) => user.socketId !== client.id,
      );

      this.server.to(this.hostSocketId).emit('leave-meet', user);
    }
  }

  @SubscribeMessage('create-meet')
  createMeet(client: Socket, payload: any) {
    if (this.rooms.find((room) => room.roomId === payload.roomId)) {
      client.emit('error', 'Room already exists');
      return;
    }
    this.rooms.push({ ...payload, clients: [] });
    this.hostSocketId = client.id;
    this.server.emit('created-meet', this.rooms);

    // console.log(this.rooms);
  }

  @SubscribeMessage('join-meet')
  joinMeet(client: Socket, payload: any) {
    const room = this.rooms.find((room) => room.roomId === payload.roomId);
    if (!room) {
      client.emit('error', 'Room not found');
      return;
    }
    payload.user.socketId = client.id;
    room.clients.push(payload.user);
    this.server.to(this.hostSocketId).emit('joined-meet', room.clients);

    // console.log(this.rooms);
  }

  @SubscribeMessage('offer')
  offer(client: Socket, payload: any) {
    const { offer, socketId } = payload;
    this.server.to(socketId).emit('offer', payload);
  }

  @SubscribeMessage('answer')
  answer(client: Socket, payload: any) {
    this.server.to(this.hostSocketId).emit('answer', payload);
  }

  @SubscribeMessage('candidate')
  candidate(client: Socket, payload: any) {
    const { message, socketId } = payload;
    if (!socketId) {
      this.server.to(this.hostSocketId).emit('candidate', message);
      return;
    }
    this.server.to(socketId).emit('candidate', message);
  }
}
