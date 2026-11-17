import { PartialType } from '@nestjs/mapped-types';
import { CreateProdcutImageDto } from './create-prodcut-image.dto';

export class UpdateProdcutImageDto extends PartialType(CreateProdcutImageDto) {}
