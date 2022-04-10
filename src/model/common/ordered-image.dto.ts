import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from '@nestjs/class-validator';

export class OrderedImageDto {
  @ApiProperty()
  @IsNumber()
  @IsInt()
  order: number;

  @ApiProperty()
  @IsString()
  imageFilename: string;
}
