import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NgosService } from '../ngos/ngos.service';
import { UsersService } from '../users/users.service';
import { AuditService } from '../audit/audit.service';
import { CurrentUser, Roles } from '../../common/decorators/auth.decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole, VerificationStatus } from '@foodconnect/types';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class VerifyNgoDto {
  @ApiProperty({ enum: VerificationStatus })
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

@ApiTags('admin')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly ngosService: NgosService,
    private readonly usersService: UsersService,
    private readonly auditService: AuditService,
  ) {}

  @Get('users')
  @ApiOperation({ summary: 'List all users (admin)' })
  listUsers(@Query('page') page?: number, @Query('role') role?: string, @Query('search') search?: string) {
    return this.usersService.findAll(page, undefined, role, search);
  }

  @Patch('users/:id/toggle-active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle user active status (admin)' })
  toggleUser(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.usersService.setActive(id, body.isActive);
  }

  @Get('ngos')
  @ApiOperation({ summary: 'List all NGOs (admin view)' })
  listNgos(@Query('page') page?: number, @Query('search') search?: string) {
    return this.ngosService.findAll(page, undefined, search);
  }

  @Post('ngos/:id/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update NGO verification status' })
  verifyNgo(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: VerifyNgoDto) {
    return this.ngosService.updateVerification(id, dto.status, user.sub, dto.reason);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'View audit logs (admin)' })
  getAuditLogs(@Query('page') page?: number, @Query('action') action?: string) {
    const filter: Record<string, unknown> = {};
    if (action) filter['action'] = action;
    return this.auditService.findAll(page, undefined, filter);
  }
}
