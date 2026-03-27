import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { HotspotStatus } from '@foodconnect/types';

export type HotspotDocument = Hotspot & Document;

@Schema({ timestamps: true, collection: 'hotspots' })
export class Hotspot {
  @Prop({ type: Types.ObjectId, ref: 'NgoProfile', required: true })
  ngoId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  areaLabel: string;

  @Prop({
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  })
  geoPoint: { type: string; coordinates: [number, number] };

  @Prop({ type: [Object], default: [] })
  activeTimeWindows: Array<{ window: string; label?: string }>;

  @Prop({ default: 0 })
  averagePeopleCount: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true, enum: Object.values(HotspotStatus), default: HotspotStatus.ACTIVE })
  status: HotspotStatus;

  @Prop({ default: false })
  displacementRisk: boolean;

  @Prop()
  lastVerifiedAt?: Date;

  @Prop()
  notes?: string;

  @Prop({ type: Types.ObjectId, ref: 'Hotspot' })
  backupHotspotId?: Types.ObjectId;
}

export const HotspotSchema = SchemaFactory.createForClass(Hotspot);
HotspotSchema.index({ ngoId: 1 });
HotspotSchema.index({ geoPoint: '2dsphere' });
HotspotSchema.index({ status: 1 });
