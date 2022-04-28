import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  ValidateNested,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { OrderProductDto } from './order-product.dto';

export class CreateOrderDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  deliveryAddressId: number;

  @ApiProperty({ isArray: true, type: OrderProductDto })
  @Type(() => OrderProductDto)
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  products: OrderProductDto[];

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  creditCardId: number;
}
