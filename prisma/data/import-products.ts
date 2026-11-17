
import { PrismaClient,AttributeValueType } from "@prisma/client";
import * as XLSX from "xlsx";

function extractRange(value: string) {
  const matches = value.match(/-?\d+(\.\d+)?/g);

  if (!matches || matches.length === 0) return null;

  if (matches.length === 1) {
    const number = Number(matches[0]);

    return {
      min: number,
      max: number,
    };
  }

  return {
    min: Number(matches[0]),
    max: Number(matches[1]),
  };
}
function extractDimensions(value: string) {
  const matches = value.match(/-?\d+(\.\d+)?/g);

  if (!matches || matches.length < 3) return null;

  return {
    length: Number(matches[0]),
    width: Number(matches[1]),
    height: Number(matches[2]),
  };
}

export async function importProducts(prisma: PrismaClient) {
  const workbook = XLSX.readFile(
    "prisma/data/data Entry file of Teltonika.xlsx"
  );

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: false,
  }) as any[][];

  const PRODUCT_START_COLUMN = 4;
  const ATTRIBUTE_START_ROW = 10;

  const productNames = rows[1].slice(PRODUCT_START_COLUMN);

  const products = new Map<string, bigint>();

  console.log(`Found ${productNames.length} products`);

  // =============================
  // Create Products
  // =============================

  for (const productName of productNames) {
    if (!productName) continue;

    let product = await prisma.product.findFirst({
      where: {
        title: productName,
      },
    });

    if (!product) {
      product = await prisma.product.create({
        data: {
          title: productName,
          description: null,
          price: 0,
          userId: BigInt(1),
          categoryId: BigInt(1),
        },
      });

      console.log(`Created ${productName}`);
    }

    products.set(productName, product.id);
  }

  console.log("Products Imported");

  // Attributes that should be stored as min/max
  const rangeAttributes = [
    "input_voltage_range",
    "operating_temperature",
    "storage_temperature",
    "operating_temperature_without_battery",
    "storage_temperature_without_battery",
    "battery_charging_temperature",
    "battery_discharging_temperature",
  ];

  // =====================================
  // Import Product Attributes
  // =====================================

  for (
    let rowIndex = ATTRIBUTE_START_ROW;
    rowIndex < rows.length;
    rowIndex++
  ) {
    const row = rows[rowIndex];

    if (!row) continue;

    const attributeName = row[0];
    const details = row[1];

    if (!attributeName) continue;
    // =======================================
// Special case: Dimension
// =======================================

console.log("Attribute Name:", attributeName);
if (attributeName.toString().trim().toLowerCase() === "dimension") {
  for (let col = PRODUCT_START_COLUMN; col < row.length; col++) {
    const value = row[col];

    if (!value) continue;

    const dimensions = extractDimensions(value.toString());

    if (!dimensions) continue;

    const productName = productNames[col - PRODUCT_START_COLUMN];
    const productId = products.get(productName);

    if (!productId) continue;

    const lengthAttribute = await prisma.attribute.findUnique({
      where: { slug: "length" },
    });

    const widthAttribute = await prisma.attribute.findUnique({
      where: { slug: "width" },
    });

    const heightAttribute = await prisma.attribute.findUnique({
      where: { slug: "height" },
    });

    if (lengthAttribute) {
      await prisma.productAttribute.upsert({
        where: {
          productId_attributeId: {
            productId,
            attributeId: lengthAttribute.id,
          },
        },
        update: {
          numberValue: dimensions.length,
        },
        create: {
          productId,
          attributeId: lengthAttribute.id,
          numberValue: dimensions.length,
        },
      });
    }

    if (widthAttribute) {
      await prisma.productAttribute.upsert({
        where: {
          productId_attributeId: {
            productId,
            attributeId: widthAttribute.id,
          },
        },
        update: {
          numberValue: dimensions.width,
        },
        create: {
          productId,
          attributeId: widthAttribute.id,
          numberValue: dimensions.width,
        },
      });
    }

    if (heightAttribute) {
      await prisma.productAttribute.upsert({
        where: {
          productId_attributeId: {
            productId,
            attributeId: heightAttribute.id,
          },
        },
        update: {
          numberValue: dimensions.height,
        },
        create: {
          productId,
          attributeId: heightAttribute.id,
          numberValue: dimensions.height,
        },
      });
    }
  }

  continue;
}

    // Skip section titles
    if (!details) continue;

    const slug = attributeName
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[()]/g, "")
      .replace(/[^\w_]/g, "");

    const attribute = await prisma.attribute.findUnique({
      where: {
        slug,
      },
    });

    if (!attribute) {
      console.log(`Attribute not found: ${slug}`);
      continue;
    }

    console.log(`Importing ${attribute.name}`);

    for (let col = PRODUCT_START_COLUMN; col < row.length; col++) {
      const value = row[col];

      if (value === undefined || value === null || value === "") continue;

      const productName = productNames[col - PRODUCT_START_COLUMN];
      const productId = products.get(productName);

      if (!productId) continue;

      const exists = await prisma.productAttribute.findFirst({
        where: {
          productId,
          attributeId: attribute.id,
        },
      });

      if (exists) continue;

      const data: any = {
        productId,
        attributeId: attribute.id,
      };
      

      switch (attribute.valueType) {
        case AttributeValueType.text: {

  const text = value.toString().trim();

  if (attribute.allowMultiple) {

    const values = text
      .split(/\s*\+\s*|\s*,\s*|\s*;\s*/)
      .map(v => v.trim())
      .filter(Boolean);

    const productAttribute = await prisma.productAttribute.upsert({
      where: {
        productId_attributeId: {
          productId,
          attributeId: attribute.id,
        },
      },
      update: {},
      create: {
        productId,
        attributeId: attribute.id,
      },
    });

    for (const optionValue of values) {

      const option = await prisma.attributeOption.upsert({
        where: {
          attributeId_value: {
            attributeId: attribute.id,
            value: optionValue,
          },
        },
        update: {},
        create: {
          attributeId: attribute.id,
          value: optionValue,
          displayName: optionValue,
        },
      });

      await prisma.productAttributeOption.upsert({
        where: {
          productAttributeId_attributeOptionId: {
            productAttributeId: productAttribute.id,
            attributeOptionId: option.id,
          },
        },
        update: {},
        create: {
          productAttributeId: productAttribute.id,
          attributeOptionId: option.id,
        },
      });
    }

    continue;
  }

  data.textValue = text;
  break;
}

        case AttributeValueType.number: {
          const text = value.toString().trim();

          if (rangeAttributes.includes(attribute.slug)) {
            const range = extractRange(text);

            if (!range) continue;

            data.numberMin = range.min;
            data.numberMax = range.max;
          } else {
            const number = Number(
              text.replace(",", ".").replace(/[^\d.-]/g, "")
            );

            if (isNaN(number)) continue;

            data.numberValue = number;
          }

          break;
        }

        case AttributeValueType.boolean: {
          const bool = value.toString().trim().toLowerCase();

          data.booleanValue =
            bool === "yes" ||
            bool === "true" ||
            bool === "supported" ||
            bool === "1";

          break;
        }
      }

      await prisma.productAttribute.create({
        data,
      });
    }
  }

  console.log("Import Finished");
}