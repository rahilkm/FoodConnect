import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { NgoProfile, NgoProfileSchema } from '../ngos/schemas/ngo-profile.schema';
import { Donation, DonationSchema } from '../donations/schemas/donation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NgoProfile.name, schema: NgoProfileSchema },
      { name: Donation.name, schema: DonationSchema },
    ]),
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
  exports: [MatchingService],
})
export class MatchingModule {}
