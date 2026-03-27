import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { NgosModule } from '../ngos/ngos.module';
import { UsersModule } from '../users/users.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [NgosModule, UsersModule, AuditModule],
  controllers: [AdminController],
})
export class AdminModule {}
