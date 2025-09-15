import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseSourceService } from './datasource.service.js';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseSourceService,
    }),
  ],
  providers: [DatabaseSourceService],
  exports: [DatabaseSourceService],
})
export class DatabaseModule {}