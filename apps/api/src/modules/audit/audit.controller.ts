import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { Roles } from '../../common/decorators/auth.decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@foodconnect/types';

@ApiTags('audit')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('audit-logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'List audit logs (admin only)' })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('action') action?: string) {
    const filter: Record<string, unknown> = {};
    if (action) filter['action'] = action;
    return this.auditService.findAll(page, limit, filter);
  }
}
