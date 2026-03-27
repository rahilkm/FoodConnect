import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { CurrentUser, Roles } from '../../common/decorators/auth.decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@foodconnect/types';

@ApiTags('routes')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @Roles(UserRole.NGO_MANAGER)
  @ApiOperation({ summary: 'Create a new route' })
  create(@Body() body: any) {
    return this.routesService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List routes for current role' })
  findAll(@CurrentUser() user: any, @Query('ngoId') ngoId?: string) {
    const filter: Record<string, unknown> = {};
    if (user.role === UserRole.VOLUNTEER) filter['volunteerId'] = user.sub;
    if (user.role === UserRole.NGO_MANAGER && ngoId) filter['ngoId'] = ngoId;
    return this.routesService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get route detail' })
  findOne(@Param('id') id: string) {
    return this.routesService.findById(id);
  }

  @Post(':id/start')
  @Roles(UserRole.VOLUNTEER, UserRole.NGO_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start a route' })
  start(@Param('id') id: string, @CurrentUser() user: any) {
    return this.routesService.start(id, user.sub);
  }

  @Post(':id/complete')
  @Roles(UserRole.VOLUNTEER, UserRole.NGO_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete a route' })
  complete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.routesService.complete(id, user.sub);
  }

  @Post(':id/reroute')
  @Roles(UserRole.NGO_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reroute a route (NGO override)' })
  reroute(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    return this.routesService.reroute(id, body.reason, body.newStops, user.sub);
  }

  @Post(':id/issue')
  @Roles(UserRole.VOLUNTEER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Report a route issue' })
  reportIssue(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    return this.routesService.reportIssue(id, body.description, user.sub);
  }

  @Post(':id/stops/:stopIndex/arrive')
  @Roles(UserRole.VOLUNTEER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark arrival at stop' })
  arriveAtStop(@Param('id') id: string, @Param('stopIndex') stopIndex: string, @CurrentUser() user: any) {
    return this.routesService.arriveAtStop(id, stopIndex, user.sub);
  }

  @Post(':id/stops/:stopIndex/complete')
  @Roles(UserRole.VOLUNTEER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete a route stop' })
  completeStop(@Param('id') id: string, @Param('stopIndex') stopIndex: string, @Body() body: any, @CurrentUser() user: any) {
    return this.routesService.completeStop(id, stopIndex, body, user.sub);
  }
}
