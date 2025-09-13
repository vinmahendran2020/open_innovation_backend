import { Module } from '@nestjs/common';
import { AirQualityController } from './air_quality.controller.js';

@Module({
  controllers: [AirQualityController]
})
export class AirQualityModule {}
