import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CurrentUser, Roles } from '../../common/decorators/auth.decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@foodconnect/types';

@ApiTags('analytics')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('admin')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin analytics overview' })
  adminOverview() {
    return this.analyticsService.getAdminOverview();
  }

  @Get('donor/:id')
  @Roles(UserRole.DONOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Donor analytics' })
  donorAnalytics(@Param('id') id: string) {
    return this.analyticsService.getDonorAnalytics(id);
  }

  @Get('ngo/:id')
  @Roles(UserRole.NGO_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'NGO analytics' })
  ngoAnalytics(@Param('id') id: string) {
    return this.analyticsService.getNgoAnalytics(id);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Public overview stats' })
  overview() {
    return this.analyticsService.getAdminOverview();
  }
}
