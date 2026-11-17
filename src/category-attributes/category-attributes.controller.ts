import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryAttributesService } from './category-attributes.service';
import { CreateCategoryAttributeDto } from './dto/create-category-attribute.dto';
import { UpdateCategoryAttributeDto } from './dto/update-category-attribute.dto';

@Controller('category-attributes')
export class CategoryAttributesController {
  constructor(private readonly categoryAttributesService: CategoryAttributesService) {}

  @Post()
  create(@Body() dto: CreateCategoryAttributeDto) {
    return this.categoryAttributesService.create(dto);
  }

  @Get()
  findAll() {
    return this.categoryAttributesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryAttributesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryAttributeDto: UpdateCategoryAttributeDto) {
    return this.categoryAttributesService.update(+id, updateCategoryAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryAttributesService.remove(+id);
  }
}
