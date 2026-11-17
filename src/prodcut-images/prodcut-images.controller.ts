import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProdcutImagesService } from './prodcut-images.service';
import { CreateProdcutImageDto } from './dto/create-prodcut-image.dto';
import { UpdateProdcutImageDto } from './dto/update-prodcut-image.dto';

@Controller('prodcut-images')
export class ProdcutImagesController {
  constructor(private readonly prodcutImagesService: ProdcutImagesService) {}

  @Post()
  create(@Body() dto: CreateProdcutImageDto) {

    return this.prodcutImagesService.create(dto);
  }

  @Get()
  findAll() {
    return this.prodcutImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prodcutImagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProdcutImageDto: UpdateProdcutImageDto) {
    return this.prodcutImagesService.update(+id, updateProdcutImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prodcutImagesService.remove(+id);
  }
}