import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecurringSupportController } from './recurring-support.controller';
import { RecurringSupportService } from './recurring-support.service';
import { RecurringSupportPlan, RecurringSupportPlanSchema } from './schemas/recurring-support-plan.schema';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RecurringSupportPlan.name, schema: RecurringSupportPlanSchema }]),
    AuditModule,
  ],
  controllers: [RecurringSupportController],
  providers: [RecurringSupportService],
  exports: [RecurringSupportService],
})
export class RecurringSupportModule {}
