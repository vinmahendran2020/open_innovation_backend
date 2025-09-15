import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AirQualityModule } from './air_quality/air_quality.module.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './config/multer.config.js';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register(multerConfig),
    AirQualityModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
