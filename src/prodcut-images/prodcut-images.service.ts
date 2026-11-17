import { Injectable } from '@nestjs/common';
import { CreateProdcutImageDto } from './dto/create-prodcut-image.dto';
import { UpdateProdcutImageDto } from './dto/update-prodcut-image.dto';
import { PrismaService } from 'prisma/prisma.service';
@Injectable()
export class ProdcutImagesService {
  constructor(
        private readonly prisma: PrismaService,
      ) {}
  async create(dto: CreateProdcutImageDto) {
     
      return await this.prisma.productImage.create({
    data:{
      productId:BigInt(dto.productId),
      fileId:dto.fileId,
      isPrimary:dto.isPrimary
    }
  })
  }

  findAll() {
    return `This action returns all prodcutImages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prodcutImage`;
  }

  update(id: number, updateProdcutImageDto: UpdateProdcutImageDto) {
    return `This action updates a #${id} prodcutImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} prodcutImage`;
  }
}
