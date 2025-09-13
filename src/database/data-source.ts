import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { join } from 'path';

@Injectable()
export class DatabaseSourceService {
  public readonly dataSource: DataSource;

  constructor(private readonly configService: ConfigService) {
    const config = {
      type: 'postgres' as const,
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME', 'postgres'),
      password: this.configService.get<string>('DB_PASSWORD', 'postgres'),
      database: this.configService.get<string>('DB_NAME', 'nestjs_db'),
      entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
      migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
      synchronize: false,
      logging: this.configService.get<string>('NODE_ENV') === 'development',
      ssl: this.configService.get<string>('NODE_ENV') === 'production'
        ? { rejectUnauthorized: false }
        : false,
      autoLoadEntities: true,
      retryAttempts: 5,
      retryDelay: 3000,
    };
    this.dataSource = new DataSource(config);
  }
}