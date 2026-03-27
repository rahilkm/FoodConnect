import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { VolunteerAvailability, VehicleType } from '@foodconnect/types';

export type VolunteerProfileDocument = VolunteerProfile & Document;

@Schema({ timestamps: true, collection: 'volunteer_profiles' })
export class VolunteerProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'NgoProfile' })
  linkedNgoId?: Types.ObjectId;

  @Prop({ enum: Object.values(VolunteerAvailability), default: VolunteerAvailability.AVAILABLE })
  availabilityStatus: VolunteerAvailability;

  @Prop({ enum: Object.values(VehicleType), default: VehicleType.MOTORCYCLE })
  vehicleType: VehicleType;

  @Prop({ trim: true })
  currentAreaLabel?: string;

  @Prop({ type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: [Number] })
  geoPoint?: { type: string; coordinates: [number, number] };

  @Prop({ default: true })
  canPickup: boolean;

  @Prop({ default: true })
  canDeliver: boolean;
}

export const VolunteerProfileSchema = SchemaFactory.createForClass(VolunteerProfile);
VolunteerProfileSchema.index({ userId: 1 }, { unique: true });
VolunteerProfileSchema.index({ geoPoint: '2dsphere' });
VolunteerProfileSchema.index({ availabilityStatus: 1 });
