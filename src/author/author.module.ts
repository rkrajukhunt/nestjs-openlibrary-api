import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthorsRepository } from './authors.repository';
import { AppConfigModule } from '../config/app-config.module';
import { AppConfigService } from '../config/app-config.service';
import { DatabaseModule } from 'src/db/db.module';
import { AuthorsService } from './author.service';
import { AuthorsController } from './author.controller';

@Module({
  imports: [
    DatabaseModule,
    AppConfigModule,
    HttpModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        timeout: configService.openLibraryConfig.timeout,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [AuthorsController],
  providers: [AuthorsService, AuthorsRepository],
  exports: [AuthorsService],
})
export class AuthorsModule {}
