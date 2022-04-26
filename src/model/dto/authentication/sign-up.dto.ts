import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Gender } from '../../enum/gender.enum';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: Date,
    default: new Date(Date.now() - 1000 * 3600 * 24 * 365 * 18),
  })
  @Type(() => Date)
  @IsDate()
  birthDate: Date;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
