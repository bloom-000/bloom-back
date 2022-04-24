import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ isArray: true, type: Number })
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @IsArray()
  permissionIds: number[];
}
