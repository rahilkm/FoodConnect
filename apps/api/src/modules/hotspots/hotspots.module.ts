import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotspotsController } from './hotspots.controller';
import { HotspotsService } from './hotspots.service';
import { Hotspot, HotspotSchema } from './schemas/hotspot.schema';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hotspot.name, schema: HotspotSchema }]),
    AuditModule, NotificationsModule,
  ],
  controllers: [HotspotsController],
  providers: [HotspotsService],
  exports: [HotspotsService, MongooseModule],
})
export class HotspotsModule {}
