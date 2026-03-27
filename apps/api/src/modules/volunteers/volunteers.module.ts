import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VolunteersController } from './volunteers.controller';
import { VolunteersService } from './volunteers.service';
import { VolunteerProfile, VolunteerProfileSchema } from './schemas/volunteer-profile.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: VolunteerProfile.name, schema: VolunteerProfileSchema }])],
  controllers: [VolunteersController],
  providers: [VolunteersService],
  exports: [VolunteersService, MongooseModule],
})
export class VolunteersModule {}
