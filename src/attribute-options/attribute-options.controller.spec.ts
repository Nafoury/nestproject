import { Test, TestingModule } from '@nestjs/testing';
import { AttributeOptionsController } from './attribute-options.controller';
import { AttributeOptionsService } from './attribute-options.service';

describe('AttributeOptionsController', () => {
  let controller: AttributeOptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttributeOptionsController],
      providers: [AttributeOptionsService],
    }).compile();

    controller = module.get<AttributeOptionsController>(AttributeOptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
