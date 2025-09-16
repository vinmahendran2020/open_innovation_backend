import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { AirQuality } from '../entities/air_quality.entity';
import { AirQualityDto } from './air_quality.dto';
import csvParser from 'csv-parser';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAirQualityQueryDto } from './air_quality-query.dto';

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

  async findByDataRange(query: IAirQualityQueryDto): Promise<AirQuality[]> {
    const qb = this.airQualityRepository.createQueryBuilder('aq');
    if (query.startDate) {
      qb.andWhere('aq.date >= :startDate', { startDate: query.startDate });
    }
    if (query.endDate) {
      qb.andWhere('aq.date <= :endDate', { endDate: query.endDate });
    }
    return await qb.getMany();
  }

  async findByParameter(
    query: IAirQualityQueryDto,
  ): Promise<{ data: AirQuality[]; count: number }> {
    const qb = this.airQualityRepository.createQueryBuilder('aq');

    let groupExpr: string;
    switch (query.frequency) {
      case 'daily':
        groupExpr = `DATE_TRUNC('day', aq.date)`;
        break;
      case 'weekly':
        groupExpr = `DATE_TRUNC('week', aq.date)`;
        break;
      case 'monthly':
        groupExpr = `DATE_TRUNC('month', aq.date)`;
        break;
      case 'yearly':
        groupExpr = `DATE_TRUNC('year', aq.date)`;
        break;
      default:
        groupExpr = '';
    }
    if (groupExpr) {
      qb.select(`${groupExpr}`, 'aq_date')
        .addSelect(`AVG(aq.co_gt)`, 'aq_co_gt')
        .addSelect(`AVG(aq.nox_gt)`, 'aq_nox_gt')
        .addSelect(`AVG(aq.no2_gt)`, 'aq_no2_gt')
        .addSelect(`AVG(aq.c6h6_gt)`, 'aq_c6h6_gt')
        .addSelect(`AVG(aq.t)`, 'aq_t')
        .addSelect(`AVG(aq.rh)`, 'aq_rh')
        .addSelect(`AVG(aq.ah)`, 'aq_ah')
        .addSelect(`AVG(aq.pt08_s1_co)`, 'aq_pt08_s1_co')
        .addSelect(`AVG(aq.pt08_s2_nmhc)`, 'aq_pt08_s2_nmhc')
        .addSelect(`AVG(aq.pt08_s3_nox)`, 'aq_pt08_s3_nox')
        .addSelect(`AVG(aq.pt08_s4_no2)`, 'aq_pt08_s4_no2')
        .addSelect(`AVG(aq.pt08_s5_o3)`, 'aq_pt08_s5_o3')
        .groupBy('aq_date')
        .orderBy('aq_date', 'ASC');
    } else if (query.parameter) {
      qb.select(`aq.${query.parameter}`);
    }
    if (query.startDate) {
      qb.andWhere(`aq.date >= :startDate`, { startDate: query.startDate });
    }
    if (query.endDate) {
      qb.andWhere(`aq.date <= :endDate`, { endDate: query.endDate });
    }
    const data: AirQuality[] = await qb.getRawMany();
    console.log(qb.getSql());
    const count = data.length;
    return { data, count };
  }
}
