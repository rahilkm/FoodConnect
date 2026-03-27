import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';

@ApiTags('tracking')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('donations')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get(':id/tracking')
  @ApiOperation({ summary: 'Get donation tracking timeline' })
  getTimeline(@Param('id') id: string) {
    return this.trackingService.getTimeline(id);
  }
}
