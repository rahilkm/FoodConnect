import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/auth.decorators';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check' })
  check() {
    const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbState[this.connection.readyState] || 'unknown',
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}
