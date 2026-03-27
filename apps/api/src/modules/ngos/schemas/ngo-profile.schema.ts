import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { VerificationStatus, NeedLevel, DonationType } from '@foodconnect/types';

export type NgoProfileDocument = NgoProfile & Document;

@Schema({ timestamps: true, collection: 'ngo_profiles' })
export class NgoProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerUserId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ enum: Object.values(VerificationStatus), default: VerificationStatus.UNVERIFIED })
  verificationStatus: VerificationStatus;

  @Prop()
  registrationNumber?: string;

  @Prop({ trim: true })
  contactPhone?: string;

  @Prop({ lowercase: true, trim: true })
  contactEmail?: string;

  @Prop({ type: [Object], default: [] })
  serviceAreas: Array<{ label: string; radiusKm: number; coordinates?: [number, number] }>;

  @Prop({ type: [String], enum: Object.values(DonationType), default: [] })
  acceptedDonationTypes: DonationType[];

  @Prop({ default: false })
  pickupSupported: boolean;

  @Prop({ default: 60 })
  averagePickupEtaMinutes: number;

  @Prop({ default: 30 })
  averageResponseMinutes: number;

  @Prop({ enum: Object.values(NeedLevel), default: NeedLevel.MEDIUM })
  currentNeedLevel: NeedLevel;

  @Prop({ default: 100 })
  dailyCapacity: number;

  @Prop({ default: 100 })
  currentAvailableCapacity: number;

  @Prop({ default: false })
  coldStorage: boolean;

  @Prop()
  storageNotes?: string;

  @Prop({ default: 0.5, min: 0, max: 1 })
  reliabilityScore: number;

  @Prop({ default: 0 })
  mealsServedCount: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Object })
  address?: { street: string; city: string; pincode: string; state: string };

  @Prop({ type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: [Number] })
  geoPoint?: { type: string; coordinates: [number, number] };

  @Prop({ type: [String], default: [] })
  proofGallery: string[];

  createdAt: Date;
  updatedAt: Date;
}

export const NgoProfileSchema = SchemaFactory.createForClass(NgoProfile);
NgoProfileSchema.index({ ownerUserId: 1 });
NgoProfileSchema.index({ slug: 1 }, { unique: true });
NgoProfileSchema.index({ geoPoint: '2dsphere' });
NgoProfileSchema.index({ verificationStatus: 1, isActive: 1 });
