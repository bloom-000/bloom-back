import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from '@nestjs/class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ isArray: true })
  @IsNumberString({}, { each: true })
  @IsArray()
  permissionIds: string[];
}
