import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Hotspot, HotspotDocument } from './schemas/hotspot.schema';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { HotspotStatus, AuditAction, UserRole, NotificationType } from '@foodconnect/types';

@Injectable()
export class HotspotsService {
  constructor(
    @InjectModel(Hotspot.name) private hotspotModel: Model<HotspotDocument>,
    private auditService: AuditService,
    private notificationsService: NotificationsService,
  ) {}

  async create(ngoId: string, data: Partial<Hotspot>) {
    return this.hotspotModel.create({ ngoId: new Types.ObjectId(ngoId), ...data });
  }

  async findAll(ngoId?: string, status?: string) {
    const filter: Record<string, unknown> = {};
    if (ngoId) filter['ngoId'] = new Types.ObjectId(ngoId);
    if (status) filter['status'] = status;
    return this.hotspotModel.find(filter).lean();
  }

  async findById(id: string) {
    const h = await this.hotspotModel.findById(id).lean();
    if (!h) throw new NotFoundException({ code: 'HOTSPOT_NOT_FOUND', message: 'Hotspot not found' });
    return h;
  }

  async update(id: string, data: Partial<Hotspot>) {
    return this.hotspotModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
  }

  async displace(id: string, actorId: string, reason: string) {
    const hotspot = await this.hotspotModel.findById(id);
    if (!hotspot) throw new NotFoundException({ code: 'HOTSPOT_NOT_FOUND', message: 'Hotspot not found' });
    if (hotspot.status === HotspotStatus.DISPLACED) {
      throw new BadRequestException({ code: 'HOTSPOT_DISPLACED', message: 'Hotspot is already displaced' });
    }
    const before = { status: hotspot.status };
    hotspot.status = HotspotStatus.DISPLACED;
    hotspot.displacementRisk = false;
    await hotspot.save();

    await this.auditService.log({
      actorUserId: actorId,
      actorRole: UserRole.NGO_MANAGER,
      action: AuditAction.HOTSPOT_DISPLACED,
      entityType: 'Hotspot',
      entityId: id,
      before,
      after: { status: HotspotStatus.DISPLACED },
      reason,
    });

    return hotspot;
  }

  async setStatus(id: string, status: HotspotStatus, actorId: string) {
    const h = await this.hotspotModel.findByIdAndUpdate(
      id,
      { status, lastVerifiedAt: new Date() },
      { new: true },
    ).lean();

    await this.auditService.log({
      actorUserId: actorId,
      actorRole: UserRole.NGO_MANAGER,
      action: AuditAction.HOTSPOT_STATUS_CHANGED,
      entityType: 'Hotspot',
      entityId: id,
      after: { status },
    });

    return h;
  }

  async findNearby(lat: number, lng: number, radiusKm = 10) {
    return this.hotspotModel.find({
      geoPoint: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radiusKm * 1000,
        },
      },
      status: HotspotStatus.ACTIVE,
    }).lean();
  }
}
