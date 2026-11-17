import { Module } from '@nestjs/common';
import { AttributeOptionsService } from './attribute-options.service';
import { AttributeOptionsController } from './attribute-options.controller';

@Module({
  controllers: [AttributeOptionsController],
  providers: [AttributeOptionsService],
})
export class AttributeOptionsModule {}
