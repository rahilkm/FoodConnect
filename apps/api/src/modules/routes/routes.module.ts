import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { Route, RouteSchema } from './schemas/route.schema';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]),
    AuditModule, NotificationsModule,
  ],
  controllers: [RoutesController],
  providers: [RoutesService],
  exports: [RoutesService, MongooseModule],
})
export class RoutesModule {}
