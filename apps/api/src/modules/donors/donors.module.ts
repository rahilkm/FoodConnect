import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';
import { DonorProfile, DonorProfileSchema } from './schemas/donor-profile.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DonorProfile.name, schema: DonorProfileSchema }])],
  controllers: [DonorsController],
  providers: [DonorsService],
  exports: [DonorsService, MongooseModule],
})
export class DonorsModule {}
