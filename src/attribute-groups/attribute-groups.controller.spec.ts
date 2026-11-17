import { Test, TestingModule } from '@nestjs/testing';
import { AttributeGroupsController } from './attribute-groups.controller';
import { AttributeGroupsService } from './attribute-groups.service';

describe('AttributeGroupsController', () => {
  let controller: AttributeGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttributeGroupsController],
      providers: [AttributeGroupsService],
    }).compile();

    controller = module.get<AttributeGroupsController>(AttributeGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
