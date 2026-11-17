import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class CategoriesService {
  constructor(
      private readonly prisma: PrismaService,
    ) {}
 async findAll() {
  const categories = await this.prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: 'asc' },
  });

  return categories.map((category) => ({
    id: category.id,
    parentId: category.parentId,
    name: category.name,
    createdAt: category.createdAt,
    slug: category.slug,

    file: category.fileId
      ? `https://directus-production-e198.up.railway.app/assets/${category.fileId}`
      : null,
  }));
}

  async getAttributes(categoryId: number) {
  const data = await this.prisma.categoryAttribute.findMany({
    where: {
      categoryId: BigInt(categoryId),
    },
    include: {
      attribute: true,
    },
  });

  return data.map(item => ({
    id: item.attribute.id,
    name: item.attribute.name,
    dataType: item.attribute.valueType,
    isRequired: item.isRequired,
  }));
}
  /*create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }*/

}