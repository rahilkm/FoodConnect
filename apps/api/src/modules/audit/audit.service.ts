import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { AuditAction, UserRole } from '@foodconnect/types';
import { Types } from 'mongoose';

interface LogDto {
  actorUserId: string;
  actorRole: UserRole;
  action: AuditAction;
  entityType: string;
  entityId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  reason?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  constructor(@InjectModel(AuditLog.name) private auditModel: Model<AuditLogDocument>) {}

  async log(dto: LogDto): Promise<void> {
    await this.auditModel.create({
      actorUserId: new Types.ObjectId(dto.actorUserId),
      actorRole: dto.actorRole,
      action: dto.action,
      entityType: dto.entityType,
      entityId: dto.entityId,
      before: dto.before,
      after: dto.after,
      reason: dto.reason,
      metadata: dto.metadata,
    });
  }

  async findAll(page = 1, limit = 50, filter: Record<string, unknown> = {}) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.auditModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.auditModel.countDocuments(filter),
    ]);
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }
}
