import { Injectable, OnModuleInit } from "@nestjs/common";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit
{
  constructor() {
    super({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL!,
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}


/*import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit
{
  constructor() {
    super({
      adapter: new PrismaPg({
        connectionString:
          process.env.DATABASE_URL!,
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}*/