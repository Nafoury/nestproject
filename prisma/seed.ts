import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedCategories } from "./data/categories";
import { seedGroups } from "./data/attribute-groups";
import { seedAttributes } from "./data/attributes";
import { seedProducts } from "./data/products";
import { seedUsers } from "./data/users";
import { seedCategoryAttributes } from "./data/category-attributes";
import { seedAttributeVisibility } from "./data/seedAttributeVisibility";
import { importProducts } from "./data/importProducts";
import { seedAttributeOptions } from "./data/attributeOptions"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter });

async function main() {
  await seedUsers(prisma);
  await seedCategories(prisma);
  await seedGroups(prisma);
  await seedAttributes(prisma);
  await seedAttributeOptions(prisma);
  await seedCategoryAttributes(prisma);
  await seedAttributeVisibility(prisma);
  await seedProducts(prisma);
  await importProducts(prisma);
  
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });