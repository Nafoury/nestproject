import path from "path";
import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";

const EXCEL_PATH = path.resolve(__dirname, "../../prisma/data/Attributes_and_Choices.xlsx");

export async function seedAttributeOptions(prisma: PrismaClient) {
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets["Attribute Choices"];
  
  if (!sheet) throw new Error(`Sheet "Attribute Choices" not found in ${EXCEL_PATH}.`);

  const rows = XLSX.utils.sheet_to_json<{
    "Attribute Group": string;
    "Attribute": string;
    "Attribute Slug": string;
    "Choices List": string;
  }>(sheet);

  for (const row of rows) {
    const slug = row["Attribute Slug"]?.trim();
    const choicesRaw = row["Choices List"];

    if (!slug || !choicesRaw) continue;

    const attribute = await prisma.attribute.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!attribute) {
      console.log(`[Warning] Attribute with slug "${slug}" not found in DB.`);
      continue;
    }

    const choices = String(choicesRaw)
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    for (let i = 0; i < choices.length; i++) {
      const choiceValue = choices[i];
      await prisma.attributeOption.upsert({
        where: {
          attributeId_value: {
            attributeId: attribute.id,
            value: choiceValue,
          },
        },
        update: {
          displayName: choiceValue,
          sortOrder: i,
        },
        create: {
          attributeId: attribute.id,
          value: choiceValue,
          displayName: choiceValue,
          sortOrder: i,
        },
      });
    }
  }

  console.log(`Attribute options seeded successfully.`);
}