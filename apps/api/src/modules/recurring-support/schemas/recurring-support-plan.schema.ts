import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RecurringMode, RecurringPlanStatus, DonationType } from '@foodconnect/types';

export type RecurringSupportPlanDocument = RecurringSupportPlan & Document;

@Schema({ timestamps: true, collection: 'recurring_support_plans' })
export class RecurringSupportPlan {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  donorUserId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'DonorProfile', required: true })
  donorProfileId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'NgoProfile' })
  preferredNgoId?: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(RecurringMode) })
  mode: RecurringMode;

  @Prop({ required: true, enum: Object.values(DonationType) })
  donationType: DonationType;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  quantityUnit: string;

  @Prop({ required: true, enum: Object.values(RecurringPlanStatus), default: RecurringPlanStatus.ACTIVE })
  status: RecurringPlanStatus;

  @Prop({ required: true })
  nextRunAt: Date;

  @Prop()
  notes?: string;
}

export const RecurringSupportPlanSchema = SchemaFactory.createForClass(RecurringSupportPlan);
RecurringSupportPlanSchema.index({ donorUserId: 1 });
RecurringSupportPlanSchema.index({ status: 1, nextRunAt: 1 });
