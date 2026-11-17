import { Injectable } from '@nestjs/common';
import { CreateAttributeGroupDto } from './dto/create-attribute-group.dto';
import { UpdateAttributeGroupDto } from './dto/update-attribute-group.dto';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class AttributeGroupsService {

   constructor(
    private readonly prisma: PrismaService,
  ) {}



  create(createAttributeGroupDto: CreateAttributeGroupDto) {
    return 'This action adds a new attributeGroup';
  }

  async findAll(categorySlug?: string) {
    const groups = await this.prisma.attributeGroup.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    include: {
    attributes: {
      where: categorySlug
        ? {
            categories: {
              some: {
                category: {
                  slug: categorySlug,
                },
              },
            },
          }
        : undefined,
      orderBy: {
        id: "asc",
      },
    },
  },
});

    const shaped = await Promise.all(
  groups.map(async (group) => {
    const attributes = await Promise.all(
      group.attributes.map(async (attr) => {
        let range: { min: number; max: number } | null = null;
        let options: { value: string; displayName: string }[] = [];

        if (attr.valueType === "number") {
          const [singleAgg, rangeAgg] = await Promise.all([
            this.prisma.productAttribute.aggregate({
              where: { attributeId: attr.id, numberValue: { not: null } },
              _min: { numberValue: true },
              _max: { numberValue: true },
            }),
            this.prisma.productAttribute.aggregate({
              where: { attributeId: attr.id, numberMin: { not: null }, numberMax: { not: null } },
              _min: { numberMin: true },
              _max: { numberMax: true },
            }),
          ]);

          const candidateMins: number[] = [];
          const candidateMaxes: number[] = [];

          if (singleAgg._min.numberValue !== null) {
            candidateMins.push(Number(singleAgg._min.numberValue));
            candidateMaxes.push(Number(singleAgg._max.numberValue));
          }
          if (rangeAgg._min.numberMin !== null) {
            candidateMins.push(Number(rangeAgg._min.numberMin));
            candidateMaxes.push(Number(rangeAgg._max.numberMax));
          }

          if (candidateMins.length > 0) {
            range = {
              min: Math.min(...candidateMins),
              max: Math.max(...candidateMaxes),
            };
          }
        }

        // if (attr.valueType === "text") {
        //   const rows = await this.prisma.productAttribute.findMany({
        //     where: { attributeId: attr.id, textValue: { not: null } },
        //     select: { textValue: true },
        //     distinct: ["textValue"],
        //     orderBy: { textValue: "asc" },
        //   });
        //   options = rows
        //     .filter((r) => r.textValue !== null)
        //     .map((r) => ({
        //       value: r.textValue as string,
        //       displayName: r.textValue as string,
        //     }));
        // }

        if (attr.valueType === "text") {
          const rows = await this.prisma.productAttribute.findMany({
            where: { attributeId: attr.id, textValue: { not: null } },
            select: { textValue: true },
            distinct: ["textValue"],
          
          });

          const values = rows
            .map((r) => r.textValue)
            .filter((v): v is string => v !== null);

        
          const leadingNumber = (v: string): number | null => {
            const match = v.match(/-?\d+(\.\d+)?/);
            return match ? parseFloat(match[0]) : null;
          };

          values.sort((a, b) => {
            const na = leadingNumber(a);
            const nb = leadingNumber(b);
            if (na !== null && nb !== null && na !== nb) return na - nb;
            if (na !== null && nb === null) return -1;
            if (na === null && nb !== null) return 1;
            return a.localeCompare(b);
          });

          options = values.map((v) => ({ value: v, displayName: v }));
        }
                
        if (
          attr.filterType === "checkbox" ||
          attr.filterType === "radio" ||
          attr.filterType === "intersection" ||
          attr.filterType === "radio_min" || 
          attr.filterType === "checkbox_min" 
        ) {
          const attrOptions = await this.prisma.attributeOption.findMany({
            where: { attributeId: attr.id },
            orderBy: { sortOrder: "asc" },
          });
          if (attrOptions.length > 0) {
            let mapped = attrOptions.map((o) => ({
              value: o.value,
              displayName: o.displayName ?? o.value,
            }));
            //this is the sorting logic for text options
            const allNumeric = mapped.every((o) => /^-?\d+(\.\d+)?/.test(o.value));
              if (allNumeric) {
                mapped = [...mapped].sort(
                  (a, b) => parseFloat(a.value) - parseFloat(b.value),
                );
              }
            options = mapped;
          }
        }


        // Visibility rules: "show this attribute only when the attribute
        // it depends on currently satisfies ⁠ operator ⁠ ⁠ value ⁠".
        const rules = await this.prisma.attributeVisibility.findMany({
          where: { attributeId: attr.id },
        });

        const visibilityRules = rules.map((rule) => ({
          dependsOnAttributeId: rule.dependsOnAttributeId.toString(),
          operator: rule.operator,
          value: rule.value,
        }));

        return {
          id: attr.id.toString(),
          slug: attr.slug,
          name: attr.name,
          section: attr.section,
          description: attr.description,
          valueType: attr.valueType,
          numberType: attr.numberType,
          filterType: attr.filterType,
          unit: attr.unit,
          allowMultiple: attr.allowMultiple,
          maxSelections: attr.maxSelections,
          range,
          options,
          visibilityRules,
        };
      }),
    );

    return {
      id: group.id.toString(),
      name: group.name,
      sortOrder: group.sortOrder,
      attributes,
    };
  }),
);

    // drop empty groups
    return shaped.filter((g) => g.attributes.length > 0);
  }

  findOne(id: number) {
    return `This action returns a #${id} attributeGroup`;
  }

  update(id: number, updateAttributeGroupDto: UpdateAttributeGroupDto) {
    return `This action updates a #${id} attributeGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} attributeGroup`;
  }
}