import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DonorsService } from './donors.service';
import { CurrentUser, Roles } from '../../common/decorators/auth.decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@foodconnect/types';

@ApiTags('donors')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.DONOR)
@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my donor profile' })
  getMe(@CurrentUser() user: any) {
    return this.donorsService.getOrCreateProfile(user.sub);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update my donor profile' })
  updateMe(@CurrentUser() user: any, @Body() body: any) {
    return this.donorsService.updateProfile(user.sub, body);
  }
}
