import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { NotificationType } from '@foodconnect/types';

interface SendNotificationDto {
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {}

  async sendToUser(userId: string, dto: SendNotificationDto): Promise<Notification> {
    return this.notificationModel.create({
      userId: new Types.ObjectId(userId),
      ...dto,
    });
  }

  async findForUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total, unread] = await Promise.all([
      this.notificationModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.notificationModel.countDocuments({ userId }),
      this.notificationModel.countDocuments({ userId, readAt: null }),
    ]);
    return { data, total, unread, page, limit };
  }

  async markRead(id: string, userId: string) {
    return this.notificationModel.findOneAndUpdate(
      { _id: id, userId },
      { readAt: new Date() },
      { new: true },
    ).lean();
  }

  async markAllRead(userId: string) {
    await this.notificationModel.updateMany({ userId, readAt: null }, { readAt: new Date() });
  }
}
