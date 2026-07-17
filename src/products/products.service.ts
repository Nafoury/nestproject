import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: 'postgresql://postgres:1234@localhost:5432/electronics_marketplace',
});

const prisma = new PrismaClient({ adapter });

@Injectable()
export class ProductsService {
  async create() {
    return prisma.product.create({
      data: {
        title: 'GPS Tracker',
        description: 'Vehicle tracking device',
        price: 150,
        userId: BigInt(1),
        categoryId: BigInt(1),
      },
    });
  }

 async findAll() {
  const products = await prisma.product.findMany();

  return products.map(product => ({
    ...product,
    id: product.id.toString(),
    userId: product.userId.toString(),
    categoryId: product.categoryId.toString(),
  }));
}
}