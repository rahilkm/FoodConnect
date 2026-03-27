import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { RecurringSupportModule } from '../modules/recurring-support/recurring-support.module';
import { NotificationsModule } from '../modules/notifications/notifications.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from '../modules/auth/schemas/refresh-token.schema';
import { NgoProfile, NgoProfileSchema } from '../modules/ngos/schemas/ngo-profile.schema';
import { Donation, DonationSchema } from '../modules/donations/schemas/donation.schema';

@Module({
  imports: [
    RecurringSupportModule,
    NotificationsModule,
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: NgoProfile.name, schema: NgoProfileSchema },
      { name: Donation.name, schema: DonationSchema },
    ]),
  ],
  providers: [JobsService],
})
export class JobsModule {}
