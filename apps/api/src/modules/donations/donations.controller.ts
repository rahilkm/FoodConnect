import {
  Controller, Get, Post, Patch, Body, Param, Query,
  UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DonationsService } from './donations.service';
import { CreateDonationDto, SelectNgoDto, AssignVolunteerDto, RejectDonationDto, UpdateDonationDto } from './dto/donation.dto';
import { CurrentUser, Roles } from '../../common/decorators/auth.decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@foodconnect/types';

@ApiTags('donations')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @Roles(UserRole.DONOR)
  @ApiOperation({ summary: 'Create a new donation' })
  create(@CurrentUser() user: any, @Body() dto: CreateDonationDto) {
    return this.donationsService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List donations (filtered by role)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(@CurrentUser() user: any, @Query() query: any) {
    const filter: Record<string, unknown> = {};
    if (user.role === UserRole.DONOR) filter['donorUserId'] = user.sub;
    if (query.status) filter['status'] = query.status;
    return this.donationsService.findAll(filter, query.page, query.limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get donation details' })
  findOne(@Param('id') id: string) {
    return this.donationsService.findById(id);
  }

  @Post(':id/accept')
  @Roles(UserRole.NGO_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'NGO accepts a donation' })
  accept(@Param('id') id: string, @CurrentUser() user: any, @Body() body: SelectNgoDto) {
    return this.donationsService.acceptDonation(id, user.sub, body.ngoId);
  }

  @Post(':id/reject')
  @Roles(UserRole.NGO_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'NGO rejects a donation' })
  reject(@Param('id') id: string, @CurrentUser() user: any, @Body() body: RejectDonationDto) {
    return this.donationsService.rejectDonation(id, user.sub, '', body.reason);
  }

  @Post(':id/assign-volunteer')
  @Roles(UserRole.NGO_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign volunteer to a donation' })
  assignVolunteer(@Param('id') id: string, @CurrentUser() user: any, @Body() body: AssignVolunteerDto) {
    return this.donationsService.assignVolunteer(id, body.volunteerId, user.sub);
  }

  @Post(':id/pickup-complete')
  @Roles(UserRole.VOLUNTEER, UserRole.NGO_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark pickup as complete' })
  pickupComplete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.donationsService.markPickupComplete(id, user.sub);
  }

  @Post(':id/delivery-complete')
  @Roles(UserRole.VOLUNTEER, UserRole.NGO_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark delivery as complete' })
  deliveryComplete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.donationsService.markDelivered(id, user.sub);
  }
}
