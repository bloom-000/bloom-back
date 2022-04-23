import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from '@nestjs/class-validator';
import { ProductImageInfoDto } from './product-image-info.dto';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { ApiFilesProperty } from '../../../decorator/api-file.decorator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsInt()
  @Type(() => Number)
  categoryId: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  oldPrice: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @IsInt()
  @Type(() => Number)
  stockQuantity: number;

  @ApiProperty({ isArray: true, type: ProductImageInfoDto })
  @IsArray()
  @Transform((v) => plainToInstance(ProductImageInfoDto, JSON.parse(v.value)))
  @Type(() => ProductImageInfoDto)
  @ValidateNested({ each: true })
  imageOrder: ProductImageInfoDto[];

  @ApiProperty({ name: 'images' })
  @IsArray()
  @ApiFilesProperty({ required: true })
  images: Express.Multer.File[];
}
