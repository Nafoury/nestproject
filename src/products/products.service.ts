import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { AttributesService } from 'src/attributes/attributes.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly attributesService: AttributesService,
    private readonly prisma: PrismaService,
  ) {}

  // Function to format the product data before returning it
  private formatProduct(product: any) {
  return {
    ...product,
    category: {
      id: product.category.id,
      name: product.category.name,
    },
    images: product.images.map((image: any) => ({
      id: image.id,
      url: `https://directus-production-e198.up.railway.app/assets/${image.fileId}`,
      isPrimary: image.isPrimary,
    })),

    attributes: product.attributes.map((attr: any) => {
      const options = attr.optionValues.map((item: any) => ({
        id: item.attributeOption.id,
        value: item.attributeOption.value,
        displayName: item.attributeOption.displayName,
      }));

      return {
        id: attr.attribute.id,
        name: attr.attribute.name,
        description: attr.attribute.description,

        value:
          attr.textValue ??
          attr.numberValue ??
          attr.booleanValue ??
          (attr.numberMin !== null && attr.numberMax !== null
            ? {
                min: attr.numberMin,
                max: attr.numberMax,
              }
            : options.length > 0
              ? options.length === 1
                ? options[0].value
                : options.map((option: any) => option.value)
              : null),

        minValue: attr.numberMin,
        maxValue: attr.numberMax,

        unit: attr.attribute.unit,
        filterType: attr.attribute.filterType,
        visibilityRules: attr.attribute.visibilityRules,

        options,
      };
    }),
  };
}

  async create(dto: CreateProductDto) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          title: dto.title,
          description: dto.description,
          price: dto.price,
          userId: BigInt(dto.userId),
          categoryId: BigInt(dto.categoryId),
        },
      });

      // Create Product Attributes
      for (const attribute of dto.attributes) {
        await tx.productAttribute.create({
          data: {
            productId: product.id,
            attributeId: BigInt(attribute.attributeId),
            textValue: attribute.textValue,
            numberValue: attribute.numberValue,
            booleanValue: attribute.booleanValue,
          },
        });
      }

      return product;
    });
  }

  async findAll(filters: ProductFilterDto) {
    console.log('filters =', filters);

    const andConditions: any[] = [];
    const where: any = {};

    const dynamicFilters = filters.filters ?? {};

    const price = dynamicFilters.price as
      | { min?: number; max?: number }
      | undefined;

    if (price) {
      where.price = {};

      if (price.min !== undefined) {
        where.price.gte = price.min;
      }

      if (price.max !== undefined) {
        where.price.lte = price.max;
      }
    }

    if (dynamicFilters) {
      for (const [slug, value] of Object.entries(dynamicFilters)) {
        // Price is stored directly on Product
        if (slug === 'price') {
          continue;
        }

        const attribute = this.attributesService.getAttributes(slug);

console.log('---------------------------');
console.log('FILTER SLUG:', slug);
console.log('FILTER VALUE:', value);
console.log('ATTRIBUTE:', attribute);
console.log('ATTRIBUTE ID:', attribute?.id);
console.log('FILTER TYPE:', attribute?.filterType);
console.log('ALLOW MULTIPLE:', attribute?.allowMultiple);
console.log('---------------------------');

        if (!attribute) {
          continue;
        }

        // ==========================================
        // Multiple options / Intersection filtering
        // ==========================================
        // ==========================================
// Option-based filtering
// checkbox / radio / intersection
// ==========================================
if (
  attribute.filterType === 'checkbox' ||
  attribute.filterType === 'radio' ||
  attribute.filterType === 'intersection' ||
  attribute.filterType === 'checkbox_min' 
) {
  const selectedOptions = Array.isArray(value) ? value : [value];

  // ==========================================
  // INTERSECTION
  // Product must contain ALL selected options
  // ==========================================
  if (attribute.filterType === 'intersection') {
  const capped =
    attribute.maxSelections != null
      ? selectedOptions.slice(0, attribute.maxSelections)
      : selectedOptions;

  for (const optionValue of capped) {
    andConditions.push({
      attributes: {
        some: {
          attributeId: attribute.id,
          OR: [
            { optionValues: { some: { attributeOption: { value: optionValue } } } },
            { textValue: optionValue },
          ],
        },
      },
    });
  }
}

  // ==========================================
  // CHECKBOX / RADIO
  // Product can contain ANY selected option
  // ==========================================
  else {
    andConditions.push({
      attributes: {
        some: {
          attributeId: attribute.id,
          OR: [
            {
              optionValues: {
                some: {
                  attributeOption: {
                    value: {
                      in: selectedOptions,
                    },
                  },
                },
              },
            },
            {
              textValue: {
                in: selectedOptions,
              },
            },
          ],
        },
      },
    });
  }

  continue;
}
  // ==========================================
// RADIO_MIN
// Selected option AND every option ranked
// above it (by sortOrder) match
// ==========================================
if (attribute.filterType === 'radio_min' || attribute.filterType === 'checkbox_min') {
  const selectedValue = Array.isArray(value) ? value[0] : value;

  const selectedOption = await this.prisma.attributeOption.findFirst({
    where: { attributeId: attribute.id, value: selectedValue },
  });

  if (selectedOption) {
    andConditions.push({
      attributes: {
        some: {
          attributeId: attribute.id,
          optionValues: {
            some: {
              attributeOption: { sortOrder: { gte: selectedOption.sortOrder } },
            },
          },
        },
      },
    });
  }

  continue;
}

// ==========================================
// TOGGLE_EXCLUDE
// Match products that do NOT have this
// boolean attribute set to true (covers both
// booleanValue: false AND no row at all)
// ==========================================
if (attribute.filterType === 'toggle_exclude') {
  const boolValue = value as boolean;

  if (boolValue === true) {
    andConditions.push({
      attributes: {
        some: { attributeId: attribute.id, booleanValue: true },
      },
    });
  } else if (boolValue === false) {
    andConditions.push({
      attributes: {
        none: { attributeId: attribute.id, booleanValue: true },
      },
    });
  }

  continue;
}

        switch (attribute.valueType) {
       case 'number': {
  const rangeValue = value as {
  min?: number;
  max?: number;
};

const min = rangeValue.min;
const max = rangeValue.max;

if (attribute.filterType === 'range_inverted') {
    const numberConditions: any[] = [];

    if (min !== undefined && max !== undefined) {
      numberConditions.push(
        { numberValue: { lt: min } },
        { numberValue: { gt: max } },
        { numberMax: { lt: min } },   // product's whole range sits below min
        { numberMin: { gt: max } },   // product's whole range sits above max
      );
    } else if (min !== undefined) {
      numberConditions.push(
        { numberValue: { lte: min } },
        { numberMin: { lte: min } },
      );
    } else if (max !== undefined) {
      numberConditions.push(
        { numberValue: { gte: max } },
        { numberMax: { gte: max } },
      );
    }

    if (numberConditions.length > 0) {
      andConditions.push({
        attributes: { some: { attributeId: attribute.id, OR: numberConditions } },
      });
    }
    break;
  }

const numberConditions: any[] = [];

// ==========================================
// 1. Product has a single numberValue
// Example:
// weight = 52
//
// Filter: 50 → 55
// => 52 matches
// ==========================================

const singleValueCondition: any = {};

if (min !== undefined) {
  singleValueCondition.gte = min;
}

if (max !== undefined) {
  singleValueCondition.lte = max;
}

if (Object.keys(singleValueCondition).length > 0) {
  numberConditions.push({
    numberValue: singleValueCondition,
  });
}


// ==========================================
// 2. Product has a range
// Example:
// temperature = -20 → 60
//
// Filter:
// -20 → 40
//
// Product range MUST contain the filter range.
//
// product.numberMin <= filter.min
// AND
// product.numberMax >= filter.max
// ==========================================

const productRangeCondition: any = {};

if (min !== undefined) {
  productRangeCondition.numberMin = {
    lte: min,
  };
}

if (max !== undefined) {
  productRangeCondition.numberMax = {
    gte: max,
  };
}

if (Object.keys(productRangeCondition).length > 0) {
  numberConditions.push(productRangeCondition);
}


// ==========================================
// Match either:
// 1. Single numberValue
// 2. Product range numberMin / numberMax
// ==========================================

andConditions.push({
  attributes: {
    some: {
      attributeId: attribute.id,
      OR: numberConditions,
    },
  },
});

break;
       }

          case 'text':
            andConditions.push({
              attributes: {
                some: {
                  attributeId: attribute.id,
                  textValue: Array.isArray(value)
                    ? { in: value }
                    : value,
                },
              },
            });

            break;

          case 'boolean':
            andConditions.push({
              attributes: {
                some: {
                  attributeId: attribute.id,
                  booleanValue: value as boolean,
                },
              },
            });

            break;
        }
      }
    }

    if (filters.categorySlug) {
      const category = await this.prisma.category.findUnique({
        where: {
          slug: filters.categorySlug,
        },
      });

      if (category) {
        where.categoryId = category.id;
      }
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const products = await this.prisma.product.findMany({
      where: where,

      include: {
        category: true,

        attributes: {
          include: {
            attribute: {
              include: {
                visibilityRules: true,
              },
            },

            optionValues: {
              include: {
                attributeOption: true,
              },
            },
          },
        },

        images: {
          orderBy: {
            isPrimary: 'desc',
          },
        },
      },
    });

    return products.map((product) => this.formatProduct(product));
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: BigInt(id),
      },

      include: {
        category: true,

        attributes: {
          include: {
            attribute: {
              include: {
                visibilityRules: true,
              },
            },

            optionValues: {
              include: {
                attributeOption: true,
              },
            },
          },
        },

        images: {
          orderBy: {
            isPrimary: 'desc',
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return this.formatProduct(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    return this.prisma.$transaction(async (tx) => {
      // Get existing product
      const existingProduct = await tx.product.findUnique({
        where: {
          id: BigInt(id),
        },
      });

      if (!existingProduct) {
        return null;
      }

      // Update product
      const product = await tx.product.update({
        where: {
          id: BigInt(id),
        },

        data: {
          title: dto.title,
          description: dto.description,
          price: dto.price,

          userId:
            dto.userId !== undefined
              ? BigInt(dto.userId)
              : undefined,

          categoryId:
            dto.categoryId !== undefined
              ? BigInt(dto.categoryId)
              : undefined,
        },
      });

      // If attributes were not sent
      if (!dto.attributes) {
        return product;
      }

      // Check if category changed
      const categoryChanged =
        dto.categoryId !== undefined &&
        BigInt(dto.categoryId) !== existingProduct.categoryId;

      // ===================================
      // Category changed
      // ===================================
      if (categoryChanged) {
        await tx.productAttribute.deleteMany({
          where: {
            productId: product.id,
          },
        });

        for (const attribute of dto.attributes) {
          await tx.productAttribute.create({
            data: {
              productId: product.id,
              attributeId: BigInt(attribute.attributeId),
              textValue: attribute.textValue,
              numberValue: attribute.numberValue,
              booleanValue: attribute.booleanValue,
            },
          });
        }

        return product;
      }

      // ===================================
      // Category did not change
      // ===================================
      for (const attribute of dto.attributes) {
        const existingAttribute =
          await tx.productAttribute.findFirst({
            where: {
              productId: product.id,
              attributeId: BigInt(attribute.attributeId),
            },
          });

        if (existingAttribute) {
          await tx.productAttribute.update({
            where: {
              id: existingAttribute.id,
            },

            data: {
              textValue: attribute.textValue,
              numberValue: attribute.numberValue,
              booleanValue: attribute.booleanValue,
            },
          });
        } else {
          await tx.productAttribute.create({
            data: {
              productId: product.id,
              attributeId: BigInt(attribute.attributeId),
              textValue: attribute.textValue,
              numberValue: attribute.numberValue,
              booleanValue: attribute.booleanValue,
            },
          });
        }
      }

      return product;
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({
      where: {
        id: BigInt(id),
      },
    });
  }
}
