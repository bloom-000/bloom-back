import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';

export class SignInDto {
  @IsString()
  @IsEmail()
  @MaxLength(512)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(512)
  password: string;
}
