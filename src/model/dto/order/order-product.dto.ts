import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class OrderProductDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  productId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  quantity: number;
}
