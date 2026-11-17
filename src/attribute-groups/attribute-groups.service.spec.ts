import { Test, TestingModule } from '@nestjs/testing';
import { AttributeGroupsService } from './attribute-groups.service';

describe('AttributeGroupsService', () => {
  let service: AttributeGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttributeGroupsService],
    }).compile();

    service = module.get<AttributeGroupsService>(AttributeGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
