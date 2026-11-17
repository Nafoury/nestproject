import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductSearchService } from './product-search.service';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService , private readonly productSearchService: ProductSearchService,) {}


  @Post("search")
search(@Body() filters: ProductFilterDto= {}) {
  return this.productsService.findAll(filters);
}

 @Get('search')
  searchByTitle(@Query('q') query: string) {
    return this.productSearchService.search(query);
  }
  @Post()
create(@Body() dto: CreateProductDto) {
  return this.productsService.create(dto);
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
  
}