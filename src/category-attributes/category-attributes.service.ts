import { Injectable } from '@nestjs/common';
import { CreateCategoryAttributeDto } from './dto/create-category-attribute.dto';
import { UpdateCategoryAttributeDto } from './dto/update-category-attribute.dto';
import { PrismaService } from 'prisma/prisma.service';
@Injectable()
export class CategoryAttributesService {
   constructor(
      private readonly prisma: PrismaService,
    ) {}
  async create(dto: CreateCategoryAttributeDto) {
    return this.prisma.categoryAttribute.create({
      data: {
        categoryId: BigInt(dto.categoryId),
        attributeId: BigInt(dto.attributeId),
        isRequired: dto.isRequired,
      },
    });
  }

 async findAll() {
  return this.prisma.categoryAttribute.findMany({
    include: {
      category: true,
      attribute: {
        include: {
          group: true,
        },
      },
    },
  });
}

  findOne(id: number) {
    return `This action returns a #${id} categoryAttribute`;
  }

  update(id: number, updateCategoryAttributeDto: UpdateCategoryAttributeDto) {
    return `This action updates a #${id} categoryAttribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoryAttribute`;
  }
}
