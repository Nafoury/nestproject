import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttributeGroupsService } from './attribute-groups.service';
import { CreateAttributeGroupDto } from './dto/create-attribute-group.dto';
import { UpdateAttributeGroupDto } from './dto/update-attribute-group.dto';

@Controller('attribute-groups')
export class AttributeGroupsController {
  constructor(private readonly attributeGroupsService: AttributeGroupsService) {}

  @Post()
  create(@Body() createAttributeGroupDto: CreateAttributeGroupDto) {
    return this.attributeGroupsService.create(createAttributeGroupDto);
  }

  @Post('search')
findAll(@Body() body: { categorySlug?: string }) {
  return this.attributeGroupsService.findAll(body.categorySlug);
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeGroupsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttributeGroupDto: UpdateAttributeGroupDto) {
    return this.attributeGroupsService.update(+id, updateAttributeGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeGroupsService.remove(+id);
  }
}
