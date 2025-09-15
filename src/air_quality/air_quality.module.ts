import { Module } from '@nestjs/common';
import { AirQualityController } from './air_quality.controller.js';
import { FilevalidationPipe } from '../filevalidation.pipe.js';
import { AirQualityService } from './air_quality.service';
import { AirQualityRepository } from '../repositories/air_quality.repository.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirQuality } from './../entities/air_quality.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([AirQuality])],
  controllers: [AirQualityController],
  providers: [FilevalidationPipe, AirQualityService, AirQualityRepository],
})
export class AirQualityModule {}
