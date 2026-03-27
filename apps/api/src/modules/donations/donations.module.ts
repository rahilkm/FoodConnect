import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonationsController } from './donations.controller';
import { DonationsService } from './donations.service';
import { Donation, DonationSchema } from './schemas/donation.schema';
import { DonorProfile, DonorProfileSchema } from '../donors/schemas/donor-profile.schema';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MatchingModule } from '../matching/matching.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Donation.name, schema: DonationSchema },
      { name: DonorProfile.name, schema: DonorProfileSchema },
    ]),
    AuditModule,
    NotificationsModule,
    MatchingModule,
  ],
  controllers: [DonationsController],
  providers: [DonationsService],
  exports: [DonationsService, MongooseModule],
})
export class DonationsModule {}
