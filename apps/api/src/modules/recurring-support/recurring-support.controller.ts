import { Controller, Get, Post, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RecurringSupportService } from './recurring-support.service';
import { CurrentUser, Roles } from '../../common/decorators/auth.decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@foodconnect/types';

@ApiTags('recurring-support')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.DONOR)
@Controller('recurring-support')
export class RecurringSupportController {
  constructor(private readonly service: RecurringSupportService) {}

  @Post()
  @ApiOperation({ summary: 'Create a recurring support plan' })
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.service.create(user.sub, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get my recurring plans' })
  findAll(@CurrentUser() user: any) {
    return this.service.findByDonor(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific recurring plan' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post(':id/pause')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pause a recurring plan' })
  pause(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.pause(id, user.sub);
  }

  @Post(':id/resume')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resume a recurring plan' })
  resume(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.resume(id, user.sub);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a recurring plan' })
  cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.cancel(id, user.sub);
  }
}
