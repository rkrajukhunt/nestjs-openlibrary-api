import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('port');
  }

  get environment(): string {
    return this.configService.get<string>('environment');
  }

  get isDevelopment(): boolean {
    return this.environment === 'development';
  }

  get isProduction(): boolean {
    return this.environment === 'production';
  }

  get isTest(): boolean {
    return this.environment === 'test';
  }

  get databaseConfig() {
    return {
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
    };
  }

  get openLibraryConfig() {
    return {
      baseUrl: this.configService.get<string>('openLibrary.baseUrl'),
      timeout: this.configService.get<number>('openLibrary.timeout'),
      retryAttempts: this.configService.get<number>(
        'openLibrary.retryAttempts',
      ),
      retryDelay: this.configService.get<number>('openLibrary.retryDelay'),
    };
  }

  get cacheConfig() {
    return {
      ttl: this.configService.get<number>('cache.ttl'),
    };
  }

  get rateLimitConfig() {
    return {
      windowMs: this.configService.get<number>('rateLimit.windowMs'),
      max: this.configService.get<number>('rateLimit.max'),
    };
  }
}
