import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { appConfig } from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DonorsModule } from './modules/donors/donors.module';
import { NgosModule } from './modules/ngos/ngos.module';
import { VolunteersModule } from './modules/volunteers/volunteers.module';
import { DonationsModule } from './modules/donations/donations.module';
import { MatchingModule } from './modules/matching/matching.module';
import { HotspotsModule } from './modules/hotspots/hotspots.module';
import { RoutesModule } from './modules/routes/routes.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { RecurringSupportModule } from './modules/recurring-support/recurring-support.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuditModule } from './modules/audit/audit.module';
import { HealthModule } from './modules/health/health.module';
import { JobsModule } from './jobs/jobs.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env', '../../env/.env.example'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/foodconnect'),
        connectionFactory: (connection) => {
          connection.on('connected', () => console.log('✅ MongoDB connected'));
          connection.on('error', (err) => console.error('❌ MongoDB error:', err));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL', 60) * 1000,
          limit: configService.get<number>('THROTTLE_LIMIT', 30),
        },
      ],
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    DonorsModule,
    NgosModule,
    VolunteersModule,
    DonationsModule,
    MatchingModule,
    HotspotsModule,
    RoutesModule,
    TrackingModule,
    RecurringSupportModule,
    NotificationsModule,
    UploadsModule,
    AnalyticsModule,
    AdminModule,
    AuditModule,
    HealthModule,
    JobsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
