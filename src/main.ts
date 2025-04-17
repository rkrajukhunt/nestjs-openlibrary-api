import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { AppConfigService } from './config/app-config.service';

async function bootstrap() {
  // Create NestJS application
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    cors: true,
  });

  const configService = app.get(AppConfigService);

  const apiPrefix = 'api';
  const port = configService.port;
  const isProduction = configService.isProduction;

  // Set global prefix for all routes
  app.setGlobalPrefix(apiPrefix);

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Use global pipes and filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // Security middlewares
  app.use(helmet());
  app.use(compression());

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: configService.rateLimitConfig.windowMs,
      max: configService.rateLimitConfig.max,
      message: 'Too many requests from this IP, please try again later',
    }),
  );

  // Swagger API documentation
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Open Library Authors API')
      .setDescription('API for fetching and storing Open Library author data')
      .setVersion('1.0')
      .addTag('authors')
      .addTag('health')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
  }

  // Start the server
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
