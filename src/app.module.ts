import { Module } from '@nestjs/common';
import { AuthorsModule } from './author/author.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './config/app-config.module';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    ConfigModule,
    AuthorsModule,
    AppConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
