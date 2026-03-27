import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RouteStatus, RouteStopStatus } from '@foodconnect/types';

export type RouteDocument = Route & Document;

@Schema({ timestamps: true, collection: 'routes' })
export class Route {
  @Prop({ type: Types.ObjectId, ref: 'NgoProfile', required: true })
  ngoId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  volunteerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Donation', required: true })
  donationId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  routeCode: string;

  @Prop({ required: true, enum: Object.values(RouteStatus), default: RouteStatus.PLANNED })
  status: RouteStatus;

  @Prop()
  plannedStartAt?: Date;

  @Prop()
  plannedEndAt?: Date;

  @Prop()
  actualStartAt?: Date;

  @Prop()
  actualEndAt?: Date;

  @Prop({
    type: [
      {
        hotspotId: { type: Types.ObjectId, ref: 'Hotspot' },
        label: String,
        order: Number,
        status: { type: String, enum: Object.values(RouteStopStatus), default: RouteStopStatus.PENDING },
        estimatedArrivalAt: Date,
        actualArrivalAt: Date,
        completedAt: Date,
        quantityDelivered: Number,
        proofFiles: [String],
        fieldNotes: String,
        issueReason: String,
      },
    ],
    default: [],
  })
  stops: Array<{
    hotspotId: Types.ObjectId;
    label: string;
    order: number;
    status: RouteStopStatus;
    estimatedArrivalAt?: Date;
    actualArrivalAt?: Date;
    completedAt?: Date;
    quantityDelivered?: number;
    proofFiles?: string[];
    fieldNotes?: string;
    issueReason?: string;
  }>;

  @Prop({ type: [Object], default: [] })
  rerouteHistory: Array<{
    triggeredAt: Date;
    reason: string;
    oldStopIds: string[];
    newStopIds: string[];
    actorId: string;
  }>;

  @Prop({ type: [Object], default: [] })
  issueLog: Array<{
    reportedAt: Date;
    reportedBy: string;
    description: string;
    resolved: boolean;
  }>;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
RouteSchema.index({ ngoId: 1 });
RouteSchema.index({ volunteerId: 1 });
RouteSchema.index({ donationId: 1 });
RouteSchema.index({ status: 1 });
