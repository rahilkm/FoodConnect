import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Donation, DonationDocument } from '../donations/schemas/donation.schema';
import { NgoProfile, NgoProfileDocument } from '../ngos/schemas/ngo-profile.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { DonationStatus, UserRole } from '@foodconnect/types';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
    @InjectModel(NgoProfile.name) private ngoModel: Model<NgoProfileDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getAdminOverview() {
    const [
      totalDonations,
      delivered,
      active,
      totalNgos,
      verifiedNgos,
      totalUsers,
      donationsByType,
      recentDonations,
    ] = await Promise.all([
      this.donationModel.countDocuments(),
      this.donationModel.countDocuments({ status: DonationStatus.DELIVERED }),
      this.donationModel.countDocuments({ status: { $in: [DonationStatus.POSTED, DonationStatus.ACCEPTED, DonationStatus.VOLUNTEER_ASSIGNED] } }),
      this.ngoModel.countDocuments({ isActive: true }),
      this.ngoModel.countDocuments({ verificationStatus: { $in: ['verified', 'trusted'] } }),
      this.userModel.countDocuments({ isActive: true }),
      this.donationModel.aggregate([{ $group: { _id: '$donationType', count: { $sum: 1 } } }]),
      this.donationModel.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return {
      donations: { total: totalDonations, delivered, active },
      ngos: { total: totalNgos, verified: verifiedNgos },
      users: { total: totalUsers },
      donationsByType,
      recentDonations,
    };
  }

  async getDonorAnalytics(donorUserId: string) {
    const [total, delivered, active, byType] = await Promise.all([
      this.donationModel.countDocuments({ donorUserId }),
      this.donationModel.countDocuments({ donorUserId, status: DonationStatus.DELIVERED }),
      this.donationModel.countDocuments({ donorUserId, status: { $nin: [DonationStatus.DELIVERED, DonationStatus.CANCELLED, DonationStatus.EXPIRED] } }),
      this.donationModel.aggregate([
        { $match: { donorUserId } },
        { $group: { _id: '$donationType', count: { $sum: 1 }, totalQty: { $sum: '$quantity' } } },
      ]),
    ]);
    return { total, delivered, active, byType };
  }

  async getNgoAnalytics(ngoId: string) {
    const [accepted, delivered, active, routeStats] = await Promise.all([
      this.donationModel.countDocuments({ selectedNgoId: ngoId }),
      this.donationModel.countDocuments({ selectedNgoId: ngoId, status: DonationStatus.DELIVERED }),
      this.donationModel.countDocuments({ selectedNgoId: ngoId, status: { $in: [DonationStatus.ACCEPTED, DonationStatus.VOLUNTEER_ASSIGNED] } }),
      this.donationModel.aggregate([
        { $match: { selectedNgoId: ngoId } },
        { $group: { _id: '$donationType', count: { $sum: 1 } } },
      ]),
    ]);
    return { accepted, delivered, active, donationsByType: routeStats };
  }
}
