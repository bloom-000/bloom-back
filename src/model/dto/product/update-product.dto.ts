import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsArray, IsNumberString, IsOptional } from '@nestjs/class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({ isArray: true })
  @IsArray()
  @IsNumberString({}, { each: true })
  @IsOptional()
  keepImageIds?: string[];
}
