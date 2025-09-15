import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AirQualityService } from './air_quality.service';
import { FilevalidationPipe } from '../filevalidation.pipe';
import { multerConfig } from 'config/multer.config';

@Controller('air-quality')
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @UsePipes(FilevalidationPipe)
  async upload(@UploadedFile() file: Express.Multer.File) {
    const result = await this.airQualityService.uploadFileStream(file.path);
    return { message: 'Air quality data uploaded', ...result };
  }
}
