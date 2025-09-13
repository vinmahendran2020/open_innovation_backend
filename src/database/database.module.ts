import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseSourceService } from './datasource.service.js';
import { DatabaseService } from './database.service.js';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [DatabaseSourceService],
      useFactory: (dbSourceService: DatabaseSourceService) => dbSourceService.dataSource.options,
    }),
  ],
  providers: [DatabaseService, DatabaseSourceService],
  exports: [DatabaseService, DatabaseSourceService],
})
export class DatabaseModule {}