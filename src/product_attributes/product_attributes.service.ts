import { Injectable } from '@nestjs/common';
import { CreateProductAttributeDto } from './dto/create-product_attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product_attribute.dto';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

import { AttributeValueType } from '@prisma/client';



@Injectable()
export class ProductAttributesService {
   constructor(
      private readonly prisma: PrismaService,
    ) {}
   async create(dto: CreateProductAttributeDto) {
    // نتأكد أن الـ Attribute موجود
    const attribute = await this.prisma.attribute.findUnique({
      where: {
        id: BigInt(dto.attributeId),
      },
    });

    if (!attribute) {
      throw new BadRequestException('Attribute not found');
    }

    // نتأكد أن المستخدم أرسل قيمة واحدة فقط
    const values = [
      dto.textValue,
      dto.numberValue,
      dto.booleanValue,
    ].filter((value) => value !== undefined);

    if (values.length !== 1) {
      throw new BadRequestException(
        'Exactly one value must be provided.',
      );
    }

    // التحقق من نوع القيمة
    if (
      attribute.valueType === AttributeValueType.text &&
      dto.textValue === undefined
    ) {
      throw new BadRequestException(
        'This attribute requires a text value.',
      );
    }

    if (
      attribute.valueType === AttributeValueType.number &&
      dto.numberValue === undefined
    ) {
      throw new BadRequestException(
        'This attribute requires a number value.',
      );
    }

    if (
      attribute.valueType === AttributeValueType.boolean &&
      dto.booleanValue === undefined
    ) {
      throw new BadRequestException(
        'This attribute requires a boolean value.',
      );
    }

    // إذا كل شيء صحيح نحفظه
    return this.prisma.productAttribute.create({
      data: {
        productId: BigInt(dto.productId),
        attributeId: BigInt(dto.attributeId),

        textValue: dto.textValue,
        numberValue: dto.numberValue,
        booleanValue: dto.booleanValue,
      },
    });
  }

  async findAll() {
  return this.prisma.productAttribute.findMany({
    include: {
      product: true,
      attribute: true,
    },
  });
}

  async findOne(id: string) {
    return this.prisma.productAttribute.findUnique({
      where: {
        id: BigInt(id),
      },
    });
  }

  async update(id: string, dto: UpdateProductAttributeDto) {
    return this.prisma.productAttribute.update({
      where: {
        id: BigInt(id),
      },
      data: {
        textValue: dto.textValue,
        numberValue: dto.numberValue,
        booleanValue: dto.booleanValue,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.productAttribute.delete({
      where: {
        id: BigInt(id),
      },
    });
  }
}