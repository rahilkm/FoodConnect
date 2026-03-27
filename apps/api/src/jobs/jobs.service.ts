import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as cron from 'node-cron';
import { RecurringSupportService } from '../modules/recurring-support/recurring-support.service';
import { NotificationsService } from '../modules/notifications/notifications.service';
import { RefreshToken, RefreshTokenDocument } from '../modules/auth/schemas/refresh-token.schema';
import { NgoProfile, NgoProfileDocument } from '../modules/ngos/schemas/ngo-profile.schema';
import { Donation, DonationDocument } from '../modules/donations/schemas/donation.schema';
import { NotificationType, DonationStatus } from '@foodconnect/types';

@Injectable()
export class JobsService implements OnModuleInit {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly recurringSupportService: RecurringSupportService,
    private readonly notificationsService: NotificationsService,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>,
    @InjectModel(NgoProfile.name) private ngoModel: Model<NgoProfileDocument>,
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
  ) {}

  onModuleInit() {
    this.logger.log('🕐 Registering background jobs (node-cron)');

    // Every hour: trigger due recurring plans
    cron.schedule('0 * * * *', async () => {
      this.logger.log('Job: Recurring plan trigger');
      await this.triggerRecurringPlans();
    });

    // Every day at midnight: expire stale donations
    cron.schedule('0 0 * * *', async () => {
      this.logger.log('Job: Expire stale donations');
      await this.expireStaledonations();
    });

    // Every day at 2am: cleanup expired refresh tokens
    cron.schedule('0 2 * * *', async () => {
      this.logger.log('Job: Cleanup expired refresh tokens');
      await this.cleanupExpiredRefreshTokens();
    });

    // Every week: recalculate NGO reliability scores
    cron.schedule('0 3 * * 0', async () => {
      this.logger.log('Job: Recalculate reliability scores');
      await this.recalculateReliabilityScores();
    });

    this.logger.log('✅ All background jobs registered');
  }

  private async triggerRecurringPlans() {
    try {
      const duePlans = await this.recurringSupportService.getDuePlans();
      this.logger.log(`Found ${duePlans.length} due recurring plans`);

      for (const plan of duePlans) {
        // Advance the next run date
        await this.recurringSupportService.advanceNextRun(
          (plan as any)._id.toString(),
          plan.mode,
        );

        // Notify donor
        await this.notificationsService.sendToUser(plan.donorUserId.toString(), {
          type: NotificationType.RECURRING_TRIGGERED,
          title: 'Recurring Donation Triggered',
          body: 'Your recurring support plan has generated a new donation.',
          link: '/donor/recurring',
        });
      }
    } catch (err) {
      this.logger.error('Error in triggerRecurringPlans:', err);
    }
  }

  private async expireStaledonations() {
    try {
      const now = new Date();
      const result = await this.donationModel.updateMany(
        {
          expiresAt: { $lt: now },
          status: { $in: [DonationStatus.DRAFT, DonationStatus.POSTED, DonationStatus.RECOMMENDED] },
        },
        { status: DonationStatus.EXPIRED },
      );
      if (result.modifiedCount > 0) {
        this.logger.log(`Expired ${result.modifiedCount} donations`);
      }
    } catch (err) {
      this.logger.error('Error in expireStaledonations:', err);
    }
  }

  private async cleanupExpiredRefreshTokens() {
    try {
      const result = await this.refreshTokenModel.deleteMany({
        expiresAt: { $lt: new Date() },
      });
      if (result.deletedCount > 0) {
        this.logger.log(`Cleaned up ${result.deletedCount} expired refresh tokens`);
      }
    } catch (err) {
      this.logger.error('Error in cleanupExpiredRefreshTokens:', err);
    }
  }

  private async recalculateReliabilityScores() {
    try {
      const ngos = await this.ngoModel.find({ isActive: true }).lean();
      for (const ngo of ngos) {
        const ngoId = (ngo as any)._id;
        const [totalAccepted, delivered] = await Promise.all([
          this.donationModel.countDocuments({ selectedNgoId: ngoId }),
          this.donationModel.countDocuments({ selectedNgoId: ngoId, status: DonationStatus.DELIVERED }),
        ]);
        if (totalAccepted > 0) {
          const score = Math.min(delivered / totalAccepted, 1);
          await this.ngoModel.findByIdAndUpdate(ngoId, { reliabilityScore: parseFloat(score.toFixed(2)) });
        }
      }
      this.logger.log('Reliability scores recalculated');
    } catch (err) {
      this.logger.error('Error in recalculateReliabilityScores:', err);
    }
  }
}
