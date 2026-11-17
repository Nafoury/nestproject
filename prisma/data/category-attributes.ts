import { PrismaClient } from "@prisma/client";

export async function seedCategoryAttributes(prisma: PrismaClient) {
  const mapping = {
    "gps-trackers": [
      "Brand",
      "Physical Specification",
      "Environmental Specification",
      "Electrical Specification",
      "Connectivity Specification",
      "GNSS Specification",
      "Storage Specification",
      "Input Output / Interfaces",
      "Device Management",
      "Functionalities and Features",
      "Certification and Compliance",
      "Warranty and Support",
      "Country of Origin & Distribution",
    ],
    "obd-devices": [
      "Brand",
      "Physical Specification",
      "Environmental Specification",
      "Electrical Specification",
      "Connectivity Specification",
      "GNSS Specification",
      "Storage Specification",
      "Input Output / Interfaces",
      "Device Management",
      "Functionalities and Features",
      "Certification and Compliance",
      "Warranty and Support",
      "Country of Origin & Distribution",
    ],
    "asset-trackers": [
      "Brand",
      "Physical Specification",
      "Environmental Specification",
      "Electrical Specification",
      "Connectivity Specification",
      "GNSS Specification",
      "Storage Specification",
      "Input Output / Interfaces",
      "Device Management",
      "Functionalities and Features",
      "Certification and Compliance",
      "Warranty and Support",
      "Country of Origin & Distribution",
    ],
    "personal-trackers": [
      "Brand",
      "Physical Specification",
      "Environmental Specification",
      "Electrical Specification",
      "Connectivity Specification",
      "GNSS Specification",
      "Storage Specification",
      "Input Output / Interfaces",
      "Device Management",
      "Functionalities and Features",
      "Certification and Compliance",
      "Warranty and Support",
      "Country of Origin & Distribution",
    ],

   
  };

  for (const [categorySlug, groups] of Object.entries(mapping)) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) continue;

    for (const groupName of groups) {
      const group = await prisma.attributeGroup.findFirst({
        where: {
          name: groupName,
        },
        include: {
          attributes: true,
        },
      });

      if (!group) continue;

      for (const attribute of group.attributes) {
        await prisma.categoryAttribute.upsert({
          where: {
            categoryId_attributeId: {
              categoryId: category.id,
              attributeId: attribute.id,
            },
          },
          update: {},
          create: {
            categoryId: category.id,
            attributeId: attribute.id,
            isRequired: false,
          },
        });
      }
    }
  }

  console.log("✅ Category Attributes Seeded");
}