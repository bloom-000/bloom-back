import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class OrderedImageDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  order: number;

  @ApiProperty()
  @IsString()
  imageFilename: string;
}
