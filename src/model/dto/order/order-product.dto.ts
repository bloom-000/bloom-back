import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsNumberString } from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class OrderProductDto {
  @ApiProperty()
  @IsNumberString()
  productId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  quantity: number;
}
