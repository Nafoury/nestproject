import { Module } from '@nestjs/common';
import { AttributeGroupsService } from './attribute-groups.service';
import { AttributeGroupsController } from './attribute-groups.controller';

@Module({
  controllers: [AttributeGroupsController],
  providers: [AttributeGroupsService],
})
export class AttributeGroupsModule {}
