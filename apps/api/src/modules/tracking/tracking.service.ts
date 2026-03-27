import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DonationTrackingEvent, DonationTrackingEventDocument } from './schemas/donation-tracking-event.schema';
import { DonationStatus, UserRole } from '@foodconnect/types';

@Injectable()
export class TrackingService {
  constructor(@InjectModel(DonationTrackingEvent.name) private trackingModel: Model<DonationTrackingEventDocument>) {}

  async addEvent(donationId: string, actorUserId: string, actorRole: UserRole, status: DonationStatus, note?: string, metadata?: Record<string, unknown>) {
    return this.trackingModel.create({
      donationId: new Types.ObjectId(donationId),
      actorUserId: new Types.ObjectId(actorUserId),
      actorRole,
      status,
      note,
      metadata,
    });
  }

  async getTimeline(donationId: string) {
    return this.trackingModel.find({ donationId }).sort({ createdAt: 1 }).populate('actorUserId', 'fullName role').lean();
  }
}
