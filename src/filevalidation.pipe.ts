import {
  Injectable,
  PipeTransform,
  BadRequestException,
  Global,
} from '@nestjs/common';

@Injectable()
@Global()
export class FilevalidationPipe implements PipeTransform {
  transform(value: any) {
    const sizeLimit = 1000000;
    if (!value || !value.originalname || !value.originalname.endsWith('.csv')) {
      throw new BadRequestException('Only .csv files are allowed');
    }
    if (value.size > sizeLimit) {
      throw new BadRequestException('File size exceeds 10KB');
    }
    return value;
  }
}
