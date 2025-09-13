import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityController } from './air_quality.controller.js';

describe('AirQualityController', () => {
  let controller: AirQualityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirQualityController],
    }).compile();

    controller = module.get<AirQualityController>(AirQualityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
