import { firebaseFirestore } from '../config/firebase';

interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export class NotificationService {
  // Save notification to Firestore
  async saveNotification(data: Omit<NotificationData, 'read' | 'createdAt'>): Promise<string> {
    try {
      const notificationData: NotificationData = {
        ...data,
        read: false,
        createdAt: new Date().toISOString(),
      };

      const docRef = await firebaseFirestore
        .collection('notifications')
        .add(notificationData);

      return docRef.id;
    } catch (error) {
      console.error('Failed to save notification:', error);
      throw error;
    }
  }

  // Get user notifications
  async getUserNotifications(userId: string, limit: number = 50): Promise<NotificationData[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection('notifications')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as NotificationData[];
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await firebaseFirestore
        .collection('notifications')
        .doc(notificationId)
        .update({ read: true });

      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  }

  // Send late check-in notification
  async sendLateCheckInNotification(userId: string, userName: string, time: string): Promise<void> {
    await this.saveNotification({
      userId,
      title: '⚠️ Late Check-in',
      message: `${userName} checked in late at ${time}`,
      type: 'warning',
    });
  }

  // Send leave request notification
  async sendLeaveRequestNotification(
    userId: string,
    userName: string,
    leaveType: string,
    dates: string
  ): Promise<void> {
    await this.saveNotification({
      userId,
      title: '📋 Leave Request',
      message: `${userName} requested ${leaveType} leave from ${dates}`,
      type: 'info',
    });
  }

  // Send leave approval notification
  async sendLeaveApprovalNotification(
    userId: string,
    userName: string,
    status: 'approved' | 'rejected',
    reason?: string
  ): Promise<void> {
    const statusText = status === 'approved' ? '✅ Approved' : '❌ Rejected';
    await this.saveNotification({
      userId,
      title: `Leave Request ${statusText}`,
      message: `Your leave request has been ${status}${reason ? `: ${reason}` : ''}`,
      type: status === 'approved' ? 'success' : 'error',
    });
  }
}

export const notificationService = new NotificationService();