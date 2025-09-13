import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { DatabaseSourceService } from './data-source';

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