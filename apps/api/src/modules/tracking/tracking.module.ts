import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { DonationTrackingEvent, DonationTrackingEventSchema } from './schemas/donation-tracking-event.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DonationTrackingEvent.name, schema: DonationTrackingEventSchema }])],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {}
