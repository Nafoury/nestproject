import { Module } from '@nestjs/common';
import { ProdcutImagesService } from './prodcut-images.service';
import { ProdcutImagesController } from './prodcut-images.controller';

@Module({
  controllers: [ProdcutImagesController],
  providers: [ProdcutImagesService],
})
export class ProdcutImagesModule {}
