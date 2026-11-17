import { Test, TestingModule } from '@nestjs/testing';
import { ProdcutImagesService } from './prodcut-images.service';

describe('ProdcutImagesService', () => {
  let service: ProdcutImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdcutImagesService],
    }).compile();

    service = module.get<ProdcutImagesService>(ProdcutImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
