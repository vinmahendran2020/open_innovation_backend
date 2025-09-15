/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { airQualityColumnMapping } from './air_quality.column-mapping';

export interface IAirQualityQueryDto {
  parameter?: keyof typeof airQualityColumnMapping;
  startDate?: string;
  endDate?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

const snakeToCamel = (obj: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (_, g: string) =>
        g.toUpperCase(),
      );
      return [camelKey, value];
    }),
  );
};

export const airQualityQuerySchema = z
  .object({
    parameter: z
      .enum([
        ...Object.keys(airQualityColumnMapping).filter(
          (key) => key !== 'date' && key !== 'time',
        ),
      ])
      .optional(),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    end_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
  })
  .refine((data) => data.start_date || data.end_date, {
    message: 'Either start_date or end_date must be provided',
    path: ['start_date', 'end_date'],
  })
  .transform((data) => snakeToCamel(data));

export class AirQualityQueryDto extends createZodDto(airQualityQuerySchema) {}
