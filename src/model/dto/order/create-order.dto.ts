import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumberString,
  ValidateNested,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { OrderProductDto } from './order-product.dto';

export class CreateOrderDto {
  @ApiProperty()
  @IsNumberString()
  deliveryAddressId: string;

  @ApiProperty({ isArray: true, type: OrderProductDto })
  @Type(() => OrderProductDto)
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  products: OrderProductDto[];

  @ApiProperty()
  @IsNumberString()
  creditCardId: string;
}
