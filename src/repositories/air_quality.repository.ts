import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AirQuality } from '../entities/air_quality.entity';

@Injectable()
export class AirQualityRepository extends Repository<AirQuality> {}
