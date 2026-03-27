import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NgosService } from './ngos.service';
import { CurrentUser, Roles, Public } from '../../common/decorators/auth.decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@foodconnect/types';

@ApiTags('ngos')
@Controller('ngos')
export class NgosController {
  constructor(private readonly ngosService: NgosService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all active NGOs (public)' })
  findAll(@Query('page') page?: number, @Query('search') search?: string) {
    return this.ngosService.findAll(page, undefined, search);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get NGO by ID (public)' })
  findOne(@Param('id') id: string) {
    return this.ngosService.findById(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.NGO_MANAGER)
  @Post()
  @ApiOperation({ summary: 'Create NGO profile' })
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.ngosService.create(user.sub, body);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.NGO_MANAGER)
  @Get('me/profile')
  @ApiOperation({ summary: 'Get my NGO profile' })
  getMyProfile(@CurrentUser() user: any) {
    return this.ngosService.findByOwner(user.sub);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.NGO_MANAGER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update NGO profile' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.ngosService.update(id, body);
  }
}
