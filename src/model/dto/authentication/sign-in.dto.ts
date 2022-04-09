import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ maxLength: 512 })
  @IsString()
  @IsEmail()
  @MaxLength(512)
  email: string;

  @ApiProperty({ maxLength: 512 })
  @IsString()
  @MinLength(6)
  @MaxLength(512)
  password: string;
}
