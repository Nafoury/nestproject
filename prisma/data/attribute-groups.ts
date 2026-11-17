import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter });
export const attributeGroups = [
  {
    name: "Brand",
    slug: "brand",
    sortOrder: 1,
  },
  {
    name: "Physical Specification",
    slug: "physical_specification",
    sortOrder: 2,
  },
  {
    name: "Environmental Specification",
    slug: "environmental_specification",
    sortOrder: 3,
  },
  {
    name: "Electrical Specification",
    slug: "electrical_specification",
    sortOrder: 4,
  },
  {
    name: "Connectivity Specification",
    slug: "connectivity_specification",
    sortOrder: 5,
  },
  
  {
    name: "GNSS Specification",
    slug: "gnss_specification",
    sortOrder: 6,
  },
  {
    name: "Storage Specification",
    slug: "storage_specification",
    sortOrder: 7,
  },
  {
    name: "Input Output / Interfaces",
    slug: "input_output_interfaces",
    sortOrder: 8,
  },
  {
    name: "Device Management",
    slug: "device_management",
    sortOrder: 9,
  },
  {
    name: "Functionalities and Features",
    slug: "functionalities_features",
    sortOrder: 9,
  },
  {
    name: "Certification and Compliance",
    slug: "certification_compliance",
    sortOrder: 10,
  },
  {
    name: "Warranty and Support",
    slug: "warranty_support",
    sortOrder: 11,
  },
  {
    name: "Country of Origin & Distribution",
    slug: "country_origin_distribution",
    sortOrder: 12,
  },
];

export async function seedGroups(prisma: PrismaClient) {
  for (const group of attributeGroups) {
    await prisma.attributeGroup.upsert({
      where: {
        slug: group.slug,
      },
      update: {},
      create: group,
    });
  }
}