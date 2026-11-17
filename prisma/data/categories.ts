import { PrismaClient } from "@prisma/client";
export const categories = [
  {
    name: "GPS Trackers",
    slug: "gps-trackers",
  },
  {
    name: "OBD Devices",
    slug: "obd-devices",
  },
  {
    name: "Asset Trackers",
    slug: "asset-trackers",
  },
  {
    name: "Personal Trackers",
    slug: "personal-trackers",
  },
];
export async function seedCategories(prisma: PrismaClient) {
  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {},
      create: category,
    });
  }
}