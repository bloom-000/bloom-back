import { PageOptionsDto } from '../common/page-options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  Min,
} from '@nestjs/class-validator';
import { ProductSortOption } from '../../enum/product-sort-option.enum';
import { Transform } from 'class-transformer';

export class GetProductsDto extends PageOptionsDto {
  @ApiPropertyOptional({ isArray: true })
  @Transform((params) =>
    Array.isArray(params.value) ? params.value : [params.value],
  )
  @IsNumberString(undefined, { each: true })
  @IsOptional()
  categoryIds?: string[];

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  fromPrice?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  toPrice?: number;

  @ApiPropertyOptional({ isArray: true, enum: ProductSortOption })
  @IsEnum(ProductSortOption)
  @IsOptional()
  sortOptions?: ProductSortOption[];

  @ApiPropertyOptional({ isArray: true })
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(5, { each: true })
  @IsOptional()
  ratings: number[];

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  searchKeyword?: string;
}
