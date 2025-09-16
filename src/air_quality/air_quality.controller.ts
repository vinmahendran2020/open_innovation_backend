import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  Get,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AirQualityService } from './air_quality.service';
import { FilevalidationPipe } from '../filevalidation.pipe';
import { multerConfig } from 'config/multer.config';
import {
  airQualityQuerySchema,
  IAirQualityQueryDto,
} from './air_quality-query.dto';
import { ZodValidationPipe } from './air_quality_validation.pipe';

@Controller('air-quality')
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @UsePipes(FilevalidationPipe)
  async upload(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.airQualityService.uploadFileStream(file.path);
      return { message: 'Air quality data uploaded', ...result };
    } catch (error) {
      console.error('Upload failed:', error);
      throw new InternalServerErrorException(
        'Failed to upload air quality data',
      );
    }
  }

  @Get('all')
  @UsePipes(new ZodValidationPipe(airQualityQuerySchema))
  async getAll(@Query() query: IAirQualityQueryDto) {
    return await this.airQualityService.findByParameter(query);
  }
}
