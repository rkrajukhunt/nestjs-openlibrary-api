import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';

import { AppConfigModule } from 'src/config/app-config.module';
import { AppConfigService } from 'src/config/app-config.service';

import knexConfig from './knexfile';

@Module({
  imports: [
    KnexModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        const environment = configService.environment;
        return {
          config: knexConfig[environment],
        };
      },
    }),
  ],
  exports: [KnexModule],
})
export class DatabaseModule {}
