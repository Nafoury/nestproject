import { Test, TestingModule } from '@nestjs/testing';
import { ProdcutImagesController } from './prodcut-images.controller';
import { ProdcutImagesService } from './prodcut-images.service';

describe('ProdcutImagesController', () => {
  let controller: ProdcutImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdcutImagesController],
      providers: [ProdcutImagesService],
    }).compile();

    controller = module.get<ProdcutImagesController>(ProdcutImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
