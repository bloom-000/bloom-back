import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
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
  @IsNumberString()
  categoryId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  oldPrice: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsInt()
  stockQuantity: number;

  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  isPromotion: boolean;

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
