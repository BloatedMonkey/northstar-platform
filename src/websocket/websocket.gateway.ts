/**
 * @author Arman Hazrati
 * WebSocket Gateway for real-time features
 */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
    credentials: true,
  },
  namespace: '/',
})
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);
  private connectedClients = new Map<string, AuthenticatedSocket>();

  constructor(private readonly jwtService: JwtService) {}

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract token from handshake
      const token =
        client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn(`Client ${client.id} attempted connection without token`);
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      client.userId = payload.sub;
      client.userRole = payload.role;

      if (client.userId) {
        this.connectedClients.set(client.userId, client);
      }

      // Join user-specific room
      client.join(`user:${client.userId}`);

      // Join role-specific room
      if (client.userRole) {
        client.join(`role:${client.userRole}`);
      }

      this.logger.log(`Client connected: ${client.id} (User: ${client.userId})`);

      // Emit connection success
      client.emit('connected', {
        message: 'Successfully connected to WebSocket',
        userId: client.userId,
      });
    } catch (error) {
      this.logger.error(`Connection error for client ${client.id}:`, error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedClients.delete(client.userId);
      this.logger.log(`Client disconnected: ${client.id} (User: ${client.userId})`);
    } else {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: AuthenticatedSocket): { event: string; data: any } {
    return {
      event: 'pong',
      data: { timestamp: Date.now(), userId: client.userId },
    };
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @MessageBody() data: { channel: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ): { event: string; data: any } {
    client.join(data.channel);
    this.logger.log(`Client ${client.id} subscribed to channel: ${data.channel}`);
    return {
      event: 'subscribed',
      data: { channel: data.channel },
    };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(
    @MessageBody() data: { channel: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ): { event: string; data: any } {
    client.leave(data.channel);
    this.logger.log(`Client ${client.id} unsubscribed from channel: ${data.channel}`);
    return {
      event: 'unsubscribed',
      data: { channel: data.channel },
    };
  }

  /**
   * Emit event to specific user
   */
  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Emit event to users with specific role
   */
  emitToRole(role: string, event: string, data: any) {
    this.server.to(`role:${role}`).emit(event, data);
  }

  /**
   * Emit event to specific channel
   */
  emitToChannel(channel: string, event: string, data: any) {
    this.server.to(channel).emit(event, data);
  }

  /**
   * Broadcast event to all connected clients
   */
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  /**
   * Get connected client count
   */
  getConnectedCount(): number {
    return this.connectedClients.size;
  }

  /**
   * Check if user is connected
   */
  isUserConnected(userId: string): boolean {
    return this.connectedClients.has(userId);
  }
}
