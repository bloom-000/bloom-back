import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
} from '@nestjs/class-validator';

export class CreateCreditCardDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cardHolderName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cvv: string;

  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  isDefault: boolean;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  expiryDate: Date;
}
