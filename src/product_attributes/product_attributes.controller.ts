import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductAttributesService } from './product_attributes.service';
import { CreateProductAttributeDto } from './dto/create-product_attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product_attribute.dto';

@Controller('product-attributes')
export class ProductAttributesController {
  constructor(private readonly productAttributesService: ProductAttributesService) {}

  @Post()
  create(@Body() dto: CreateProductAttributeDto) {
    return this.productAttributesService.create(dto);
  }

  @Get()
  findAll() {
    return this.productAttributesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productAttributesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductAttributeDto) {
    return this.productAttributesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productAttributesService.remove(id);
  }
}
