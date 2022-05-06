import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, Min } from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class UpsertCartProductDto {
  @ApiProperty()
  @IsNumberString()
  productId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity: number;
}
