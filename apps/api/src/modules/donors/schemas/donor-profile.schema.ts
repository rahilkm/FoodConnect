import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DonorType, AnonymityPreference, DonationType } from '@foodconnect/types';

export type DonorProfileDocument = DonorProfile & Document;

@Schema({ timestamps: true, collection: 'donor_profiles' })
export class DonorProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ enum: Object.values(DonorType), default: DonorType.INDIVIDUAL })
  donorType: DonorType;

  @Prop({ type: Object })
  defaultAddress?: {
    street: string;
    city: string;
    pincode: string;
    state: string;
  };

  @Prop({ type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: [Number] })
  geoPoint?: { type: string; coordinates: [number, number] };

  @Prop({ default: 10 })
  preferredRadiusKm: number;

  @Prop({ type: [String], enum: Object.values(DonationType) })
  preferredDonationTypes: DonationType[];

  @Prop({ default: true })
  wantsImpactReports: boolean;

  @Prop({ enum: Object.values(AnonymityPreference), default: AnonymityPreference.PUBLIC })
  anonymityPreference: AnonymityPreference;
}

export const DonorProfileSchema = SchemaFactory.createForClass(DonorProfile);
DonorProfileSchema.index({ userId: 1 }, { unique: true });
DonorProfileSchema.index({ geoPoint: '2dsphere' });
