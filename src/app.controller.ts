import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'API Health Status',
    description: 'Check Api Health Status',
  })
  @ApiResponse({
    status: 500,
    description: 'Service Unavailable. The API is unhealthy.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Service Unavailable',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'OK!' })
  getHealth(): string {
    return this.appService.getHealth();
  }
}
