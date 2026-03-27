import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  DonationStatus, DonationType, FoodType,
  StorageRequirement,
} from '@foodconnect/types';

export type DonationDocument = Donation & Document;

@Schema({ timestamps: true, collection: 'donations' })
export class Donation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  donorUserId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'DonorProfile', required: true })
  donorProfileId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'NgoProfile' })
  selectedNgoId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  selectedVolunteerId?: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(DonationType) })
  donationType: DonationType;

  @Prop({ required: true, enum: Object.values(FoodType) })
  foodType: FoodType;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, enum: ['kg', 'liters', 'servings', 'boxes', 'packets', 'pieces'] })
  quantityUnit: string;

  @Prop({ required: true })
  preparedAt: Date;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: true })
  pickupRequired: boolean;

  @Prop({ type: Object, required: true })
  donorAddress: { street: string; city: string; pincode: string; state: string };

  @Prop({ type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: [Number] })
  donorGeoPoint?: { type: string; coordinates: [number, number] };

  @Prop({ trim: true })
  notes?: string;

  @Prop({ trim: true })
  allergenNotes?: string;

  @Prop({ enum: Object.values(StorageRequirement), default: StorageRequirement.ROOM_TEMP })
  storageRequirement: StorageRequirement;

  @Prop({ required: true, enum: Object.values(DonationStatus), default: DonationStatus.DRAFT })
  status: DonationStatus;

  @Prop({ type: Types.ObjectId, ref: 'DonationRecommendation' })
  recommendationSnapshotId?: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  createdAt: Date;
  updatedAt: Date;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);
DonationSchema.index({ donorUserId: 1 });
DonationSchema.index({ status: 1 });
DonationSchema.index({ selectedNgoId: 1 });
DonationSchema.index({ donorGeoPoint: '2dsphere' });
DonationSchema.index({ expiresAt: 1 });
