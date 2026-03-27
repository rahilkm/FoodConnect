import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NgosController } from './ngos.controller';
import { NgosService } from './ngos.service';
import { NgoProfile, NgoProfileSchema } from './schemas/ngo-profile.schema';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NgoProfile.name, schema: NgoProfileSchema }]),
    AuditModule,
  ],
  controllers: [NgosController],
  providers: [NgosService],
  exports: [NgosService, MongooseModule],
})
export class NgosModule {}
