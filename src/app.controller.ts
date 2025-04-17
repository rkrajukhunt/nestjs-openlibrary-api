import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ApiOperation } from '@nestjs/swagger';
import { AppConfigService } from './config/app-config.service';

@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private readonly configService: AppConfigService,
  ) {}

  @Get('/health')
  @HealthCheck()
  @ApiOperation({ summary: 'Check API health status' })
  check() {
    const openLibraryApiUrl = this.configService.openLibraryConfig.baseUrl;

    // Log the Open Library API URL for debugging
    console.log('Open Library API URL:', openLibraryApiUrl);

    return this.health.check([
      // Check if the Open Library API is reachable
      () =>
        this.http.pingCheck(
          'openLibraryApi',
          `${openLibraryApiUrl}/search/authors.json`,
        ),

      // Check disk storage
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 1,
        }),

      // Check memory usage
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024), // 300MB
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024), // 300MB
    ]);
  }
}
