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
  namespace: '/chat',
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  db: any = [];
  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    console.log('[Chat] Server Socket initialized');
  }

  handleConnection(client: Socket) {
    const user = client.handshake.headers['x-user'];
    this.db[user as string] = client.id;
    // console.log(this.db);

    console.log('[Chat] Client connected', client.id, user);
  }

  handleDisconnect(client: Socket) {
    console.log('[Chat] Client disconnected', client.id);
  }

  // @SubscribeMessage('send-message')
  // handleSendMessage(client: any, payload: any) {
  //   // console.log(client.id, payload);
  //   // this.server.emit('new-message', payload); //Gửi cho tất cả client kết nối với server socket
  //   //Chỉ gửi client vừa gửi lên
  //   // client.emit('new-message', payload);

  //   const socketIdTo = this.db[payload.userTo];
  //   if (socketIdTo) {
  //     this.server.to(socketIdTo).emit('new-message', payload);
  //   }
  // }

  // @SubscribeMessage('join-room')
  // handleJoinRoom(client: Socket, payload: any) {
  //   client.join(payload);
  //   client.emit('joined-room', `Đã join phòng ${payload} thành công`);
  // }

  // @SubscribeMessage('send-room')
  // handleSendRoom(client: Socket, payload: any) {
  //   //Gửi tin nhắn tới các thành viên trong room
  //   this.server.to(payload.room).emit('new-message', payload.message);
  // }

  // @SubscribeMessage('send-message2')
  // handleSendMessage2(client: any, payload: any) {
  //   console.log(client.id, payload);
  //   // this.server.to(client.id).emit('new-message', payload);
  // }

  @SubscribeMessage('send-message')
  handleSendMessage(client: any, payload: any) {
    console.log('Chat');

    this.server.emit('new-message', payload);
  }
}

//Socket Server --> Init --> Connect --> Listen --> Emit --> Disconnect
