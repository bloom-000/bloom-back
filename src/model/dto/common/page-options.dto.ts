import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class PageOptionsDto {
  @ApiProperty({ default: 1 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page: number;

  @ApiProperty({ default: 15 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  pageSize: number;
}
