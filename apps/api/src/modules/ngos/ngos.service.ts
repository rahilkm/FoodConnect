import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NgoProfile, NgoProfileDocument } from './schemas/ngo-profile.schema';
import { AuditService } from '../audit/audit.service';
import { VerificationStatus, AuditAction, UserRole } from '@foodconnect/types';

@Injectable()
export class NgosService {
  constructor(
    @InjectModel(NgoProfile.name) private ngoModel: Model<NgoProfileDocument>,
    private auditService: AuditService,
  ) {}

  async create(ownerUserId: string, data: Partial<NgoProfile>) {
    const slug = this.toSlug((data.name as string) || 'ngo') + '-' + Date.now().toString(36);
    const existing = await this.ngoModel.findOne({ ownerUserId });
    if (existing) throw new ConflictException({ code: 'NGO_ALREADY_EXISTS', message: 'You already have an NGO profile' });
    return this.ngoModel.create({ ownerUserId: new Types.ObjectId(ownerUserId), slug, ...data });
  }

  async findAll(page = 1, limit = 20, search?: string) {
    const filter: Record<string, unknown> = { isActive: true };
    if (search) filter['$or'] = [
      { name: { $regex: search, $options: 'i' } },
      { 'serviceAreas.label': { $regex: search, $options: 'i' } },
    ];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.ngoModel.find(filter).skip(skip).limit(limit).lean(),
      this.ngoModel.countDocuments(filter),
    ]);
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const ngo = await this.ngoModel.findById(id).lean();
    if (!ngo) throw new NotFoundException({ code: 'NGO_NOT_FOUND', message: 'NGO not found' });
    return ngo;
  }

  async findByOwner(ownerUserId: string) {
    return this.ngoModel.findOne({ ownerUserId }).lean();
  }

  async update(id: string, data: Partial<NgoProfile>) {
    return this.ngoModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
  }

  async updateVerification(id: string, status: VerificationStatus, adminId: string, reason?: string) {
    const before = await this.ngoModel.findById(id).lean();
    if (!before) throw new NotFoundException({ code: 'NGO_NOT_FOUND', message: 'NGO not found' });

    await this.ngoModel.findByIdAndUpdate(id, { verificationStatus: status });

    await this.auditService.log({
      actorUserId: adminId,
      actorRole: UserRole.ADMIN,
      action: AuditAction.NGO_VERIFICATION_CHANGED,
      entityType: 'NgoProfile',
      entityId: id,
      before: { verificationStatus: before.verificationStatus },
      after: { verificationStatus: status },
      reason,
    });

    return this.findById(id);
  }

  private toSlug(text: string): string {
    return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
}
