import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class PageOptionsDto {
  @ApiProperty({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({ default: 15 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number;
}
