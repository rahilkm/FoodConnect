import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MatchingService } from './matching.service';

@ApiTags('matching')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('donations/:donationId/recommendations')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get()
  @ApiOperation({ summary: 'Get ranked NGO recommendations for a donation' })
  getRecommendations(@Param('donationId') donationId: string): Promise<any> {
    return this.matchingService.getRecommendations(donationId);
  }
}
