import { Injectable } from '@nestjs/common';
import { CreateAttributeOptionDto } from './dto/create-attribute-option.dto';
import { UpdateAttributeOptionDto } from './dto/update-attribute-option.dto';
import { PrismaService } from 'prisma/prisma.service';



@Injectable()
export class AttributeOptionsService {
  constructor(
      private readonly prisma: PrismaService,
    ) {}
  async create(dto: CreateAttributeOptionDto) {
  return this.prisma.attributeOption.create({
    data: {
      attributeId: BigInt(dto.attributeId),
      value: dto.value,
    },
  });
}

  findAll() {
    return this.prisma.attributeOption.findMany();
  }

  async findOne(id: number) {
    return this.prisma.attributeOption.findUnique({
      where: {
        id: BigInt(id),
      },
    });
  }

  update(id: number, updateAttributeOptionDto: UpdateAttributeOptionDto) {
    return `This action updates a #${id} attributeOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} attributeOption`;
  }
}
