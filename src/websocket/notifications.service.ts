/**
 * @author Arman Hazrati
 * Notifications service using WebSocket
 */
import { Injectable, Logger } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

export enum NotificationType {
  SERVICE_REQUEST_CREATED = 'service_request.created',
  SERVICE_REQUEST_UPDATED = 'service_request.updated',
  SERVICE_REQUEST_COMPLETED = 'service_request.completed',
  PROVIDER_RESPONSE_CREATED = 'provider_response.created',
  USER_CREATED = 'user.created',
  AUDIT_LOG_CREATED = 'audit_log.created',
  SYSTEM_NOTIFICATION = 'system.notification',
}

export interface Notification {
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly websocketGateway: WebsocketGateway) {}

  /**
   * Send notification to specific user
   */
  notifyUser(userId: string, notification: Notification) {
    this.logger.log(`Sending notification to user ${userId}: ${notification.type}`);
    this.websocketGateway.emitToUser(userId, 'notification', {
      ...notification,
      timestamp: new Date(),
    });
  }

  /**
   * Send notification to users with specific role
   */
  notifyRole(role: string, notification: Notification) {
    this.logger.log(`Sending notification to role ${role}: ${notification.type}`);
    this.websocketGateway.emitToRole(role, 'notification', {
      ...notification,
      timestamp: new Date(),
    });
  }

  /**
   * Broadcast notification to all users
   */
  broadcast(notification: Notification) {
    this.logger.log(`Broadcasting notification: ${notification.type}`);
    this.websocketGateway.broadcast('notification', {
      ...notification,
      timestamp: new Date(),
    });
  }

  /**
   * Send service request notification
   */
  notifyServiceRequestCreated(userId: string, requestId: string, data: any) {
    this.notifyUser(userId, {
      type: NotificationType.SERVICE_REQUEST_CREATED,
      title: 'Service Request Created',
      message: `Your service request #${requestId} has been created successfully`,
      data: { requestId, ...data },
      timestamp: new Date(),
      priority: 'medium',
    });

    // Notify admins
    this.notifyRole('ADMIN', {
      type: NotificationType.SERVICE_REQUEST_CREATED,
      title: 'New Service Request',
      message: `New service request #${requestId} has been created`,
      data: { requestId, ...data },
      timestamp: new Date(),
      priority: 'medium',
    });
  }

  /**
   * Send service request update notification
   */
  notifyServiceRequestUpdated(userId: string, requestId: string, status: string) {
    this.notifyUser(userId, {
      type: NotificationType.SERVICE_REQUEST_UPDATED,
      title: 'Service Request Updated',
      message: `Your service request #${requestId} status changed to ${status}`,
      data: { requestId, status },
      timestamp: new Date(),
      priority: 'high',
    });
  }

  /**
   * Send service request completed notification
   */
  notifyServiceRequestCompleted(userId: string, requestId: string) {
    this.notifyUser(userId, {
      type: NotificationType.SERVICE_REQUEST_COMPLETED,
      title: 'Service Request Completed',
      message: `Your service request #${requestId} has been completed`,
      data: { requestId },
      timestamp: new Date(),
      priority: 'high',
    });
  }

  /**
   * Send provider response notification
   */
  notifyProviderResponse(userId: string, requestId: string, providerId: string) {
    this.notifyUser(userId, {
      type: NotificationType.PROVIDER_RESPONSE_CREATED,
      title: 'New Response Received',
      message: `A provider has responded to your service request #${requestId}`,
      data: { requestId, providerId },
      timestamp: new Date(),
      priority: 'high',
    });
  }

  /**
   * Send system notification
   */
  sendSystemNotification(message: string, priority: 'low' | 'medium' | 'high' | 'urgent' = 'low') {
    this.broadcast({
      type: NotificationType.SYSTEM_NOTIFICATION,
      title: 'System Notification',
      message,
      timestamp: new Date(),
      priority,
    });
  }
}
