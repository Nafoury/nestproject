import { Injectable } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class AttributesService implements OnModuleInit {

  constructor(
      private readonly prisma: PrismaService,
    ) {}

  //create a map to store the attribute slugs and their corresponding IDs
  private attributeMap = new Map<
  string,
  {
    id: bigint;
    valueType: string;
    numberType: string | null;
    allowMultiple: boolean;
    filterType: string;
    maxSelections: number | null;
  }
>();

   async onModuleInit() {
    // Fetch all attributes from the database and populate the attributeMap
    const attributes = await this.prisma.attribute.findMany();

    for (const attribute of attributes) {
      this.attributeMap.set(attribute.slug,{
        id:attribute.id,
        valueType:attribute.valueType,
        numberType:attribute.numberType,
        allowMultiple:attribute.allowMultiple,
        filterType:attribute.filterType,
        maxSelections: attribute.maxSelections,
      });
    }

    
}
getAttributes(slug: string){
  return this.attributeMap.get(slug)
}
  

  private generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");
}

  async create(dto: CreateAttributeDto) {

    const slug =this.generateSlug(dto.name)
  return this.prisma.attribute.create({
    data: {
      name: dto.name,
      slug:slug,
      valueType: dto.valueType,
      numberType: dto.numberType,
      allowMultiple: dto.allowMultiple ?? false,
      filterType: dto.filterType,
      
      group: {
    connect: {
      id: BigInt(dto.groupId),
    },
  },
    },
  });

}
async findAll() {
  return this.prisma.attribute.findMany();
}
 

  findOne(id: number) {
    return `This action returns a #${id} attribute`;
  }

  update(id: number, updateAttributeDto: UpdateAttributeDto) {
    return `This action updates a #${id} attribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} attribute`;
  }

  async getCategoryAttributes(categorySlug: string) {
  const attributes = await this.prisma.categoryAttribute.findMany({
    where: {
      category: {
        slug: categorySlug,
      },
    },
    include: {
      attribute: {
        include: {
          visibilityRules: {
            include: {
              dependsOn: true,
            },
          },
        },
      },
    },
  });

  return attributes.map(({ attribute }) => ({
    id: attribute.id,
    name: attribute.name,
    slug: attribute.slug,
    section: attribute.section,
    description: attribute.description,
    valueType: attribute.valueType,
    numberType: attribute.numberType,
    filterType: attribute.filterType,
    unit: attribute.unit,
    allowMultiple: attribute.allowMultiple,

    visibility: attribute.visibilityRules.map(rule => ({
      dependsOnAttributeId: rule.dependsOnAttributeId,
      dependsOnSlug: rule.dependsOn.slug,
      operator: rule.operator,
      value: rule.value,
    })),
  }));
}
}
