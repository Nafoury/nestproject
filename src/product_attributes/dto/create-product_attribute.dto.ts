export class CreateProductAttributeDto {
  productId!: number;

  attributeId!: number;

  textValue?: string;
  numberValue?: number;
  booleanValue?: boolean;
}
