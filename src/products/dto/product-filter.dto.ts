export class ProductFilterDto {
 categorySlug?: string;
 filters?: Record<string, any>;

  price?: {
    min?: number;
    max?: number;
  };
}