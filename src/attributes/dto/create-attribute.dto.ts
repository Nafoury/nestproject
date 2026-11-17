import { AttributeValueType, FilterType, NumberType } from '@prisma/client';
export class CreateAttributeDto {

      name!: string;
      valueType!: AttributeValueType;
      numberType?: NumberType;
      allowMultiple?: boolean;
      groupId!: string;
      filterType!: FilterType;
      maxSelections?: number;

}

