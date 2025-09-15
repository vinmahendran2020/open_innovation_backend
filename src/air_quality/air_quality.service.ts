import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { AirQuality } from '../entities/air_quality.entity';
import { AirQualityDto } from './air_quality.dto';
import csvParser from 'csv-parser';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AirQualityService {
  constructor(
    @InjectRepository(AirQuality)
    private readonly airQualityRepository: Repository<AirQuality>,
  ) {}

  async uploadFileStream(filePath: string): Promise<{ inserted: number }> {
    const batchSize = 100;
    let batch: AirQuality[] = [];
    let inserted = 0;

    const stream = fs.createReadStream(filePath, { encoding: 'utf-8' }).pipe(
      csvParser({
        separator: ';',
      }),
    );

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        console.error('Error reading file:', error);
        throw error;
      });

      stream.on('data', (data) => {
        const entity = this.mapCsvToEntity(Object.values(data));
        batch.push(entity);

        if (batch.length >= batchSize) {
          stream.pause();
          this.airQualityRepository
            .createQueryBuilder()
            .insert()
            .into(AirQuality)
            .values(batch)
            .execute()
            .then(() => {
              inserted += batch.length;
              batch = [];
              stream.resume();
            })
            .catch((error) => {
              console.error('Error inserting batch:', error);
              stream.destroy(error);
            });
        }
      });

      stream.on('end', () => {
        if (batch.length > 0) {
          this.airQualityRepository
            .createQueryBuilder()
            .insert()
            .into(AirQuality)
            .values(batch)
            .execute()
            .then(() => {
              inserted += batch.length;
              resolve({ inserted });
            })
            .catch((error) => {
              console.error('Error inserting final batch:', error);
              reject(error instanceof Error ? error : new Error(String(error)));
            });
        } else {
          resolve({ inserted });
        }
      });
      stream.on('error', (error) => {
        console.error('Error reading file:', error);
        reject(error);
      });
    });
  }

  async createFromDto(dto: AirQualityDto): Promise<AirQuality> {
    const entity = this.airQualityRepository.create(dto);
    return await this.airQualityRepository.save(entity);
  }

  private mapCsvToEntity(values: string[]): AirQuality {
    let date = values[0];
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const [day, month, year] = date.split('/');
      date = `${year}-${month}-${day}`;
    }
    let time = values[1];
    if (/^\d{2}\.\d{2}\.\d{2}$/.test(time)) {
      time = time.replace(/\./g, ':');
    }
    return {
      date,
      time,
      co_gt: parseFloat(values[2]),
      pt08_s1_co: parseFloat(values[3]),
      nmhc_gt: parseFloat(values[4]),
      c6h6_gt: parseFloat(values[5]),
      pt08_s2_nmhc: parseFloat(values[6]),
      nox_gt: parseFloat(values[7]),
      pt08_s3_nox: parseFloat(values[8]),
      no2_gt: parseFloat(values[9]),
      pt08_s4_no2: parseFloat(values[10]),
      pt08_s5_o3: parseFloat(values[11]),
      t: parseFloat(values[12]),
      rh: parseFloat(values[13]),
      ah: parseFloat(values[14]),
    } as AirQuality;
  }
}
