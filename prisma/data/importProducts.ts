import path from "path";
import crypto from "crypto";
import * as XLSX from "xlsx";
import { PrismaClient, Prisma } from "@prisma/client";
import { ATTRIBUTE_COLUMNS, CORE_COLUMN_COUNT, AttrColumnConfig } from "./attributeColumns";

/**
 * -----------------------------------------------------------------------
 * FIXED INPUT PATH
 * Adjust this to wherever the filled workbook actually lives in your repo.
 * -----------------------------------------------------------------------
 */
const EXCEL_PATH = path.resolve(__dirname, "../../prisma/data/Filtrix_Product_Data_Entry.xlsx");

const SHEET_NAME = "Products";

// The sheet has no owner/user column - every imported product is assigned to this
// fixed account automatically. Change this email (and/or the create{} block below)
// if you want imported products attributed to a different account.
const DEFAULT_OWNER_EMAIL = "admin@test.com";

// Row layout in the "Products" sheet (see build script / Instructions tab):
//  Row 1: group headers (merged)
//  Row 2: attribute name headers
//  Row 3: format hints
//  Row 4: example row (yellow) - always skipped
//  Row 5+: real data
const HEADER_ROWS = 4;
const DATA_START_ROW_INDEX = HEADER_ROWS; // 0-based index into the row array

// Core column indices (0-based), matching CORE_COLUMN_COUNT = 6
const COL = {
  PRODUCT_ID: 0,
  TITLE: 1,
  DESCRIPTION: 2,
  PRICE: 3,
  CATEGORY: 4,
  FEATURED: 5,
};

interface ImportSummary {
  rowsProcessed: number;
  productsCreated: number;
  productsUpdated: number;
  rowsSkipped: number;
  attributeValuesWritten: number;
  warnings: string[];
  errors: string[];
}

export async function importProducts(prisma: PrismaClient): Promise<void> {
  const summary: ImportSummary = {
    rowsProcessed: 0,
    productsCreated: 0,
    productsUpdated: 0,
    rowsSkipped: 0,
    attributeValuesWritten: 0,
    warnings: [],
    errors: [],
  };

  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets[SHEET_NAME];
  if (!sheet) {
    throw new Error(
      `Sheet "${SHEET_NAME}" not found in ${EXCEL_PATH}. Found sheets: ${workbook.SheetNames.join(", ")}`
    );
  }

  // header: 1 => array-of-arrays, raw cell values, blank cells => undefined
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: true,
    defval: undefined,
  });

  // Pre-cache: attribute lookups by "group||name" so we only hit the DB once per attribute.
  const attributeCache = new Map<string, { id: bigint } | null>();

  // Every imported product is attributed to this one account (no owner column in the sheet).
  // Placeholder credentials mirror the pattern you gave - not usable for real login as-is.
  const defaultUser = await prisma.user.upsert({
    where: { email: DEFAULT_OWNER_EMAIL },
    update: {},
    create: {
      email: DEFAULT_OWNER_EMAIL,
      firstName: "Admin",
      lastName: "User",
      phone: "",
      password: crypto.randomBytes(24).toString("hex"),
    },
  });
  console.log(`Total rows found in sheet: ${rows.length}. Starting processing from row index ${DATA_START_ROW_INDEX}.`);
  for (let r = DATA_START_ROW_INDEX; r < rows.length; r++) {
    const row = rows[r];
    const excelRowNumber = r + 1; // 1-based, for error messages

    if (!row || row.every((v) => v === undefined || v === "")) {
      console.log(`[Skip] Row ${excelRowNumber}: Skipped because the row is fully blank.`);
      continue; // fully blank row, silently skip
    }

    const title = cleanStr(row[COL.TITLE]);
    if (!title) {
      // No title = not a real product row.
      console.log(`[Skip] Row ${excelRowNumber}: Skipped because title is missing (Column index ${COL.TITLE}).`);
      continue;
    }

    summary.rowsProcessed++;

    try {
      const priceRaw = row[COL.PRICE];
      const categorySlug = cleanStr(row[COL.CATEGORY]);
      const description = cleanStr(row[COL.DESCRIPTION]) ?? null;
      const featured = parseYesNo(row[COL.FEATURED]) ?? false;
      const productIdRaw = cleanStr(row[COL.PRODUCT_ID]);

      if (priceRaw === undefined || priceRaw === null || priceRaw === "") {
        console.log(`[Skip] Row ${excelRowNumber} ("${title}"): Skipped because Price is missing.`);
        summary.errors.push(`Row ${excelRowNumber} ("${title}"): missing Price - row skipped.`);
        summary.rowsSkipped++;
        continue;
      }
      const price = new Prisma.Decimal(String(priceRaw));

      if (!categorySlug) {
        console.log(`[Skip] Row ${excelRowNumber} ("${title}"): Skipped because Category is missing.`);
        summary.errors.push(`Row ${excelRowNumber} ("${title}"): missing Category - row skipped.`);
        summary.rowsSkipped++;
        continue;
      }

      // ---- Category: find by slug, create if missing (flat, no parent) ----
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
          slug: categorySlug,
          name: categorySlug,
          parentId: null,
        },
      });

      const user = defaultUser;

      // ---- Product: match by Title + owner (per your instruction), else create ----
      const existingProduct = await prisma.product.findFirst({
        where: { title, userId: user.id },
      });

      let productId: bigint;
      if (existingProduct) {
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            description,
            price,
            categoryId: category.id,
            isFeatured: featured,
          },
        });
        productId = existingProduct.id;
        summary.productsUpdated++;
      } else {
        const created = await prisma.product.create({
          data: {
            title,
            description,
            price,
            categoryId: category.id,
            isFeatured: featured,
            userId: user.id,
          },
        });
        productId = created.id;
        summary.productsCreated++;
      }

      // ---- Attribute columns ----
      let colIndex = CORE_COLUMN_COUNT;
      for (const cfg of ATTRIBUTE_COLUMNS) {
        const nCols = cfg.nCols;
        const cellIndexes = nCols === 1 ? [colIndex] : [colIndex, colIndex + 1];
        colIndex += nCols;

        const written = await writeAttributeValue({
          prisma,
          productId,
          cfg,
          rawValues: cellIndexes.map((ci) => row[ci]),
          excelRowNumber,
          title,
          attributeCache,
          summary,
        });
        if (written) summary.attributeValuesWritten++;
      }
    } catch (err: any) {
      console.log(`[Error] Row ${excelRowNumber} ("${title}"): Threw an exception -> ${err?.message ?? err}`);
      summary.errors.push(`Row ${excelRowNumber} ("${title}"): ${err?.message ?? err}`);
      summary.rowsSkipped++;
    }
  }

  printSummary(summary);
}

// -----------------------------------------------------------------------
// Attribute value writer
// -----------------------------------------------------------------------

async function writeAttributeValue(args: {
  prisma: PrismaClient;
  productId: bigint;
  cfg: AttrColumnConfig;
  rawValues: unknown[];
  excelRowNumber: number;
  title: string;
  attributeCache: Map<string, { id: bigint } | null>;
  summary: ImportSummary;
}): Promise<boolean> {
  const { prisma, productId, cfg, rawValues, excelRowNumber, title, attributeCache, summary } = args;

  // Blank cell(s) => attribute not applicable to this product; leave untouched, skip.
  const allBlank = rawValues.every((v) => v === undefined || v === null || v === "");
  if (allBlank) return false;

  const attribute = await resolveAttribute(prisma, cfg, attributeCache);
  if (!attribute) {
    summary.warnings.push(
      `Row ${excelRowNumber} ("${title}"): attribute "${cfg.name}" (group "${cfg.group}") ` +
        `was not found in the database (looked up by AttributeGroup.name + Attribute.name) - value skipped. ` +
        `Check that this attribute has already been seeded with that exact group/name.`
    );
    return false;
  }

  switch (cfg.valueType) {
    case "number": {
      if (cfg.nCols === 1) {
        const n = parseNumber(rawValues[0]);
        if (n === null) {
          summary.warnings.push(
            `Row ${excelRowNumber} ("${title}"): "${cfg.name}" value "${rawValues[0]}" is not a valid number - skipped.`
          );
          return false;
        }
        await upsertProductAttribute(prisma, productId, attribute.id, {
          numberValue: new Prisma.Decimal(n),
          numberMin: null,
          numberMax: null,
          booleanValue: null,
          textValue: null,
        });
      } else {
        const min = parseNumber(rawValues[0]);
        const max = parseNumber(rawValues[1]);
        if (min === null || max === null) {
          summary.warnings.push(
            `Row ${excelRowNumber} ("${title}"): "${cfg.name}" Min/Max values are incomplete or invalid ` +
              `(Min="${rawValues[0]}", Max="${rawValues[1]}") - skipped.`
          );
          return false;
        }
        await upsertProductAttribute(prisma, productId, attribute.id, {
          numberValue: null,
          numberMin: new Prisma.Decimal(min),
          numberMax: new Prisma.Decimal(max),
          booleanValue: null,
          textValue: null,
        });
      }
      return true;
    }

    case "boolean": {
      const b = parseYesNo(rawValues[0]);
      if (b === null) {
        summary.warnings.push(
          `Row ${excelRowNumber} ("${title}"): "${cfg.name}" value "${rawValues[0]}" is not Yes/No - skipped.`
        );
        return false;
      }
      await upsertProductAttribute(prisma, productId, attribute.id, {
        numberValue: null,
        numberMin: null,
        numberMax: null,
        booleanValue: b,
        textValue: null,
      });
      return true;
    }

    case "text-single": {
      const value = cleanStr(rawValues[0]);
      if (!value) return false;
      const pa = await upsertProductAttribute(prisma, productId, attribute.id, {
        numberValue: null,
        numberMin: null,
        numberMax: null,
        booleanValue: null,
        textValue: null,
      });
      await syncOptionValues(prisma, attribute.id, pa.id, [value]);
      return true;
    }

    case "text-multi": {
      const raw = cleanStr(rawValues[0]);
      if (!raw) return false;
      const values = raw
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
      if (values.length === 0) return false;
      const pa = await upsertProductAttribute(prisma, productId, attribute.id, {
        numberValue: null,
        numberMin: null,
        numberMax: null,
        booleanValue: null,
        textValue: null,
      });
      await syncOptionValues(prisma, attribute.id, pa.id, values);
      return true;
    }
  }

  return false;
}

async function resolveAttribute(
  prisma: PrismaClient,
  cfg: AttrColumnConfig,
  cache: Map<string, { id: bigint } | null>
): Promise<{ id: bigint } | null> {
  const key = `${cfg.group}||${cfg.name}`;
  if (cache.has(key)) return cache.get(key)!;

  // Matched by AttributeGroup.name + Attribute.name (case-insensitive, trimmed).
  // This assumes your Group column values ("Physical Specification", etc.) match
  // AttributeGroup.name exactly in the DB - adjust here if your groups are named differently.
  const found = await prisma.attribute.findFirst({
    where: {
      name: { equals: cfg.name, mode: "insensitive" },
      group: { name: { equals: cfg.group, mode: "insensitive" } },
    },
    select: { id: true },
  });

  cache.set(key, found);
  return found;
}

async function upsertProductAttribute(
  prisma: PrismaClient,
  productId: bigint,
  attributeId: bigint,
  values: {
    numberValue: Prisma.Decimal | null;
    numberMin: Prisma.Decimal | null;
    numberMax: Prisma.Decimal | null;
    booleanValue: boolean | null;
    textValue: string | null;
  }
) {
  return prisma.productAttribute.upsert({
    where: { productId_attributeId: { productId, attributeId } },
    update: values,
    create: { productId, attributeId, ...values },
  });
}

/**
 * Ensures each given option value exists as an AttributeOption for this attribute
 * (looked up first, only created if missing), then makes the ProductAttributeOption
 * links for this ProductAttribute match exactly the given set of values
 * (removes links to options no longer listed, adds links for new ones).
 */
async function syncOptionValues(
  prisma: PrismaClient,
  attributeId: bigint,
  productAttributeId: bigint,
  values: string[]
) {
  const optionIds: bigint[] = [];

  for (const value of values) {
    let option = await prisma.attributeOption.findFirst({
      where: { attributeId, value: { equals: value, mode: "insensitive" } },
    });
    if (!option) {
      option = await prisma.attributeOption.create({
        data: { attributeId, value },
      });
    }
    optionIds.push(option.id);
  }

  const existingLinks = await prisma.productAttributeOption.findMany({
    where: { productAttributeId },
    select: { id: true, attributeOptionId: true },
  });

  const toRemove = existingLinks.filter((l) => !optionIds.includes(l.attributeOptionId));
  if (toRemove.length > 0) {
    await prisma.productAttributeOption.deleteMany({
      where: { id: { in: toRemove.map((l) => l.id) } },
    });
  }

  const existingOptionIds = new Set(existingLinks.map((l) => l.attributeOptionId));
  const toAdd = optionIds.filter((id) => !existingOptionIds.has(id));
  for (const attributeOptionId of toAdd) {
    await prisma.productAttributeOption.create({
      data: { productAttributeId, attributeOptionId },
    });
  }
}

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------

function cleanStr(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

function parseNumber(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).trim());
  return Number.isFinite(n) ? n : null;
}

function parseYesNo(v: unknown): boolean | null {
  const s = cleanStr(v);
  if (!s) return null;
  const lower = s.toLowerCase();
  if (["yes", "y", "true", "1"].includes(lower)) return true;
  if (["no", "n", "false", "0"].includes(lower)) return false;
  return null;
}

function printSummary(summary: ImportSummary) {
  console.log("\n=== Product import summary ===");
  console.log(`Rows processed:          ${summary.rowsProcessed}`);
  console.log(`Products created:        ${summary.productsCreated}`);
  console.log(`Products updated:        ${summary.productsUpdated}`);
  console.log(`Rows skipped (errors):   ${summary.rowsSkipped}`);
  console.log(`Attribute values written:${summary.attributeValuesWritten}`);

  if (summary.warnings.length) {
    console.log(`\n--- Warnings (${summary.warnings.length}) ---`);
    for (const w of summary.warnings) console.log("  ! " + w);
  }
  if (summary.errors.length) {
    console.log(`\n--- Errors (${summary.errors.length}) ---`);
    for (const e of summary.errors) console.log("  x " + e);
  }
  console.log("===============================\n");
}
