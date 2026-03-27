import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HotspotsService } from './hotspots.service';
import { CurrentUser, Roles, Public } from '../../common/decorators/auth.decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole, HotspotStatus } from '@foodconnect/types';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class DisplaceDto {
  @ApiProperty()
  @IsString() @IsNotEmpty()
  reason: string;
}

class SetStatusDto {
  @ApiProperty({ enum: HotspotStatus })
  @IsString()
  status: HotspotStatus;
}

@ApiTags('hotspots')
@Controller('hotspots')
export class HotspotsController {
  constructor(private readonly hotspotsService: HotspotsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List hotspots' })
  findAll(@Query('ngoId') ngoId?: string, @Query('status') status?: string) {
    return this.hotspotsService.findAll(ngoId, status);
  }

  @Public()
  @Get('nearby')
  @ApiOperation({ summary: 'Get nearby active hotspots' })
  findNearby(@Query('lat') lat: number, @Query('lng') lng: number, @Query('radiusKm') radiusKm?: number) {
    return this.hotspotsService.findNearby(lat, lng, radiusKm);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get hotspot by ID' })
  findOne(@Param('id') id: string) {
    return this.hotspotsService.findById(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.NGO_MANAGER)
  @Post()
  @ApiOperation({ summary: 'Create hotspot' })
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.hotspotsService.create(body.ngoId, body);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.NGO_MANAGER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update hotspot' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.hotspotsService.update(id, body);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.NGO_MANAGER)
  @Post(':id/displace')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark hotspot as displaced' })
  displace(@Param('id') id: string, @CurrentUser() user: any, @Body() body: DisplaceDto) {
    return this.hotspotsService.displace(id, user.sub, body.reason);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.NGO_MANAGER)
  @Post(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update hotspot status' })
  setStatus(@Param('id') id: string, @CurrentUser() user: any, @Body() body: SetStatusDto) {
    return this.hotspotsService.setStatus(id, body.status, user.sub);
  }
}
