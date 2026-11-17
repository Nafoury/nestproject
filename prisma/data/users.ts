import { PrismaClient } from "@prisma/client";
export async function seedUsers(prisma: PrismaClient) {
  await prisma.user.upsert({
    where: {
      email: "admin@test.com",
    },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@test.com",
      password: "123456",
      phone: "0000000000",
      role: "admin",
    },
  });
}