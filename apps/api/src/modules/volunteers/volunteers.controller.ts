import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VolunteersService } from './volunteers.service';
import { CurrentUser, Roles } from '../../common/decorators/auth.decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole, VolunteerAvailability } from '@foodconnect/types';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class AvailabilityDto {
  @ApiProperty({ enum: VolunteerAvailability })
  @IsEnum(VolunteerAvailability)
  status: VolunteerAvailability;
}

@ApiTags('volunteers')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.VOLUNTEER)
@Controller('volunteers')
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my volunteer profile' })
  getMe(@CurrentUser() user: any) {
    return this.volunteersService.getOrCreateProfile(user.sub);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update volunteer profile' })
  updateMe(@CurrentUser() user: any, @Body() body: any) {
    return this.volunteersService.updateProfile(user.sub, body);
  }

  @Patch('me/availability')
  @ApiOperation({ summary: 'Update volunteer availability' })
  updateAvailability(@CurrentUser() user: any, @Body() body: AvailabilityDto) {
    return this.volunteersService.updateAvailability(user.sub, body.status);
  }
}
