import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RecurringSupportPlan, RecurringSupportPlanDocument } from './schemas/recurring-support-plan.schema';
import { AuditService } from '../audit/audit.service';
import { RecurringMode, RecurringPlanStatus, AuditAction, UserRole } from '@foodconnect/types';

@Injectable()
export class RecurringSupportService {
  constructor(
    @InjectModel(RecurringSupportPlan.name) private planModel: Model<RecurringSupportPlanDocument>,
    private auditService: AuditService,
  ) {}

  async create(donorUserId: string, data: any) {
    const nextRunAt = this.calcNextRun(data.mode);
    return this.planModel.create({ donorUserId: new Types.ObjectId(donorUserId), ...data, nextRunAt });
  }

  async findByDonor(donorUserId: string) {
    return this.planModel.find({ donorUserId }).lean();
  }

  async findById(id: string) {
    const p = await this.planModel.findById(id).lean();
    if (!p) throw new NotFoundException({ code: 'RECURRING_PLAN_NOT_FOUND', message: 'Plan not found' });
    return p;
  }

  async pause(id: string, actorId: string) {
    return this.updateStatus(id, RecurringPlanStatus.PAUSED, actorId);
  }

  async resume(id: string, actorId: string) {
    const plan = await this.planModel.findById(id);
    if (!plan) throw new NotFoundException({ code: 'RECURRING_PLAN_NOT_FOUND', message: 'Plan not found' });
    plan.status = RecurringPlanStatus.ACTIVE;
    plan.nextRunAt = this.calcNextRun(plan.mode);
    await plan.save();

    await this.auditService.log({
      actorUserId: actorId,
      actorRole: UserRole.DONOR,
      action: AuditAction.RECURRING_PLAN_CHANGED,
      entityType: 'RecurringSupportPlan',
      entityId: id,
      after: { status: RecurringPlanStatus.ACTIVE },
    });
    return plan;
  }

  async cancel(id: string, actorId: string) {
    return this.updateStatus(id, RecurringPlanStatus.CANCELLED, actorId);
  }

  async getDuePlans() {
    return this.planModel.find({
      status: RecurringPlanStatus.ACTIVE,
      nextRunAt: { $lte: new Date() },
    }).lean();
  }

  async advanceNextRun(id: string, mode: RecurringMode) {
    const nextRunAt = this.calcNextRun(mode);
    return this.planModel.findByIdAndUpdate(id, { nextRunAt }, { new: true });
  }

  private async updateStatus(id: string, status: RecurringPlanStatus, actorId: string) {
    const plan = await this.planModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!plan) throw new NotFoundException({ code: 'RECURRING_PLAN_NOT_FOUND', message: 'Plan not found' });

    await this.auditService.log({
      actorUserId: actorId,
      actorRole: UserRole.DONOR,
      action: AuditAction.RECURRING_PLAN_CHANGED,
      entityType: 'RecurringSupportPlan',
      entityId: id,
      after: { status },
    });
    return plan;
  }

  private calcNextRun(mode: RecurringMode): Date {
    const d = new Date();
    if (mode === RecurringMode.WEEKLY) d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    return d;
  }
}
