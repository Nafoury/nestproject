import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProductSearchService {
  constructor(private readonly prisma: PrismaService) {}

 async search(query: string) {
  const search = query.trim();

  if (!search) {
    return [];
  }

  return this.prisma.$queryRaw`
    SELECT
      id,
      title,

      (
        ts_rank(
          to_tsvector('simple', title),
          plainto_tsquery('simple', ${search})
        )
        +
        similarity(title, ${search})
      ) AS relevance

    FROM products

    WHERE
      to_tsvector('simple', title)
        @@ plainto_tsquery('simple', ${search})

      OR

      title ILIKE ${'%' + search + '%'}

    ORDER BY relevance DESC;
  `;
}
}