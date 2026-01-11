import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AiService } from './ai.service';
import { UseGuards } from '@nestjs/common';
// import { WsJwtGuard } from '../auth/ws-jwt.guard'; // To be implemented

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'ai',
})
export class AiGateway {
  @WebSocketServer()
  server: Server;

  constructor(private aiService: AiService) { }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.conversationId);
    return { event: 'subscribed', data: { conversationId: data.conversationId } };
  }

  async streamToken(conversationId: string, messageId: string, content: string, isFinal: boolean = false) {
    this.server.to(conversationId).emit('token', {
      messageId,
      content,
      isFinal,
    });
  }
}
