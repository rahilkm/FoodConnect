import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Donation, DonationDocument } from './schemas/donation.schema';
import { DonorProfile, DonorProfileDocument } from '../donors/schemas/donor-profile.schema';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MatchingService } from '../matching/matching.service';
import { DonationStatus, AuditAction, NotificationType, UserRole } from '@foodconnect/types';
import { CreateDonationDto, UpdateDonationDto } from './dto/donation.dto';

@Injectable()
export class DonationsService {
  constructor(
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
    @InjectModel(DonorProfile.name) private donorProfileModel: Model<DonorProfileDocument>,
    private auditService: AuditService,
    private notificationsService: NotificationsService,
    private matchingService: MatchingService,
  ) {}

  async create(donorUserId: string, dto: CreateDonationDto) {
    const profile = await this.donorProfileModel.findOne({ userId: donorUserId });
    if (!profile) throw new BadRequestException({ code: 'DONOR_PROFILE_MISSING', message: 'Complete your donor profile first' });

    const donation = await this.donationModel.create({
      donorUserId: new Types.ObjectId(donorUserId),
      donorProfileId: profile._id,
      ...dto,
      status: DonationStatus.POSTED,
    });

    // Auto-generate recommendations
    try {
      await this.matchingService.getRecommendations(donation._id.toString());
    } catch { /* non-blocking */ }

    return donation;
  }

  async findAll(filter: Record<string, unknown> = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.donationModel.find(filter).skip(skip).limit(limit).populate('selectedNgoId', 'name slug').lean(),
      this.donationModel.countDocuments(filter),
    ]);
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const donation = await this.donationModel.findById(id)
      .populate('selectedNgoId', 'name slug verificationStatus')
      .populate('donorUserId', 'fullName email')
      .lean();
    if (!donation) throw new NotFoundException({ code: 'DONATION_NOT_FOUND', message: 'Donation not found' });
    return donation;
  }

  async acceptDonation(id: string, ngoUserId: string, ngoId: string) {
    const donation = await this.donationModel.findById(id);
    if (!donation) throw new NotFoundException({ code: 'DONATION_NOT_FOUND', message: 'Donation not found' });
    if (![DonationStatus.POSTED, DonationStatus.RECOMMENDED].includes(donation.status)) {
      throw new BadRequestException({ code: 'DONATION_INVALID_STATE', message: 'Donation cannot be accepted in current state' });
    }
    const before = { status: donation.status };
    donation.status = DonationStatus.ACCEPTED;
    donation.selectedNgoId = new Types.ObjectId(ngoId);
    await donation.save();

    await this.auditService.log({
      actorUserId: ngoUserId,
      actorRole: UserRole.NGO_MANAGER,
      action: AuditAction.DONATION_ACCEPTED,
      entityType: 'Donation',
      entityId: id,
      before,
      after: { status: DonationStatus.ACCEPTED, ngoId },
    });

    await this.notificationsService.sendToUser(donation.donorUserId.toString(), {
      type: NotificationType.DONATION_ACCEPTED,
      title: 'Donation Accepted!',
      body: 'Your donation has been accepted by an NGO.',
      link: `/donor/donations/${id}`,
    });

    return donation;
  }

  async rejectDonation(id: string, ngoUserId: string, ngoId: string, reason?: string) {
    const donation = await this.donationModel.findById(id);
    if (!donation) throw new NotFoundException({ code: 'DONATION_NOT_FOUND', message: 'Donation not found' });
    if (![DonationStatus.POSTED, DonationStatus.RECOMMENDED, DonationStatus.ACCEPTED].includes(donation.status)) {
      throw new BadRequestException({ code: 'DONATION_INVALID_STATE', message: 'Cannot reject in current state' });
    }
    const before = { status: donation.status };
    donation.status = DonationStatus.POSTED;
    donation.selectedNgoId = undefined;
    await donation.save();

    await this.auditService.log({
      actorUserId: ngoUserId,
      actorRole: UserRole.NGO_MANAGER,
      action: AuditAction.DONATION_REJECTED,
      entityType: 'Donation',
      entityId: id,
      before,
      after: { status: DonationStatus.POSTED },
      reason,
    });

    return donation;
  }

  async assignVolunteer(id: string, volunteerId: string, actorId: string) {
    const donation = await this.donationModel.findById(id);
    if (!donation) throw new NotFoundException({ code: 'DONATION_NOT_FOUND', message: 'Donation not found' });
    if (donation.status !== DonationStatus.ACCEPTED) {
      throw new BadRequestException({ code: 'DONATION_INVALID_STATE', message: 'Volunteer can only be assigned after NGO acceptance' });
    }
    donation.status = DonationStatus.VOLUNTEER_ASSIGNED;
    donation.selectedVolunteerId = new Types.ObjectId(volunteerId);
    await donation.save();

    await this.auditService.log({
      actorUserId: actorId,
      actorRole: UserRole.NGO_MANAGER,
      action: AuditAction.VOLUNTEER_ASSIGNED,
      entityType: 'Donation',
      entityId: id,
      after: { volunteerId },
    });

    await this.notificationsService.sendToUser(donation.donorUserId.toString(), {
      type: NotificationType.VOLUNTEER_ASSIGNED,
      title: 'Volunteer Assigned',
      body: 'A volunteer has been assigned to pick up your donation.',
      link: `/donor/donations/${id}`,
    });

    return donation;
  }

  async markPickupComplete(id: string, actorId: string) {
    const donation = await this.donationModel.findById(id);
    if (!donation) throw new NotFoundException({ code: 'DONATION_NOT_FOUND', message: 'Donation not found' });
    if (donation.status !== DonationStatus.VOLUNTEER_ASSIGNED) {
      throw new BadRequestException({ code: 'DONATION_INVALID_STATE', message: 'Pickup can only be marked after volunteer is assigned' });
    }
    donation.status = DonationStatus.PICKUP_COMPLETE;
    await donation.save();

    await this.notificationsService.sendToUser(donation.donorUserId.toString(), {
      type: NotificationType.PICKUP_COMPLETE,
      title: 'Pickup Complete',
      body: 'Your donation has been picked up and is on its way.',
      link: `/donor/donations/${id}`,
    });
    return donation;
  }

  async markDelivered(id: string, actorId: string) {
    const donation = await this.donationModel.findById(id);
    if (!donation) throw new NotFoundException({ code: 'DONATION_NOT_FOUND', message: 'Donation not found' });
    if (donation.status !== DonationStatus.PICKUP_COMPLETE) {
      throw new BadRequestException({ code: 'DONATION_INVALID_STATE', message: 'Donation cannot be marked delivered before pickup is complete' });
    }
    donation.status = DonationStatus.DELIVERED;
    await donation.save();

    await this.notificationsService.sendToUser(donation.donorUserId.toString(), {
      type: NotificationType.DELIVERY_COMPLETE,
      title: 'Delivery Complete! 🎉',
      body: 'Your donation has been delivered. Thank you for your generosity!',
      link: `/donor/donations/${id}`,
    });
    return donation;
  }
}
