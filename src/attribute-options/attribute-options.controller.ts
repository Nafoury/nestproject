import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttributeOptionsService } from './attribute-options.service';
import { CreateAttributeOptionDto } from './dto/create-attribute-option.dto';
import { UpdateAttributeOptionDto } from './dto/update-attribute-option.dto';

@Controller('attribute-options')
export class AttributeOptionsController {
  constructor(private readonly attributeOptionsService: AttributeOptionsService) {}

  @Post()
  create(@Body() dto: CreateAttributeOptionDto) {
    return this.attributeOptionsService.create(dto);
  }

  @Get()
  findAll() {
    return this.attributeOptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeOptionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttributeOptionDto: UpdateAttributeOptionDto) {
    return this.attributeOptionsService.update(+id, updateAttributeOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeOptionsService.remove(+id);
  }
}
