import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { AttributesModule } from './attributes/attributes.module';
import { AttributeOptionsModule } from './attribute-options/attribute-options.module';
import { CategoryAttributesModule } from './category-attributes/category-attributes.module';
import { ProductAttributesModule } from './product_attributes/product_attributes.module';
import { AttributeGroupsModule } from './attribute-groups/attribute-groups.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProdcutImagesModule } from './prodcut-images/prodcut-images.module';



@Module({
  imports: [ProductsModule, CategoriesModule, AttributesModule, AttributeOptionsModule, CategoryAttributesModule, ProductAttributesModule, AttributeGroupsModule,PrismaModule, ProdcutImagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
