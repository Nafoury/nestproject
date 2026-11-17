import { ProductAttributeInputDto } from "./product-attribute-input.dto";

export class CreateProductDto {
  title!: string;
  description?: string;
  price!: number;
  categoryId!: number;
  userId!: number;
  attributes!: ProductAttributeInputDto[];


  // TODO:
  // images
  // attributes
  // isFeatured
  //isFeatured?: boolean;
  images?: string[];
  //attributes?: ProductAttributeDto[];
}