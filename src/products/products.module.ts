import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {AttributesModule} from 'src/attributes/attributes.module'
import { ProductSearchService } from './product-search.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService ,ProductSearchService],
  imports:[AttributesModule]
})
export class ProductsModule {}
