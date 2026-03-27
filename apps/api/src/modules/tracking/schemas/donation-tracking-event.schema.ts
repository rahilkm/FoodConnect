import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DonationStatus, UserRole } from '@foodconnect/types';

export type DonationTrackingEventDocument = DonationTrackingEvent & Document;

@Schema({ timestamps: true, collection: 'donation_tracking_events' })
export class DonationTrackingEvent {
  @Prop({ type: Types.ObjectId, ref: 'Donation', required: true })
  donationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  actorUserId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(UserRole) })
  actorRole: UserRole;

  @Prop({ required: true, enum: Object.values(DonationStatus) })
  status: DonationStatus;

  @Prop()
  note?: string;

  @Prop({ type: Object })
  metadata?: Record<string, unknown>;
}

export const DonationTrackingEventSchema = SchemaFactory.createForClass(DonationTrackingEvent);
DonationTrackingEventSchema.index({ donationId: 1, createdAt: 1 });
