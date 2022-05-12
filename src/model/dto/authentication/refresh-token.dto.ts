import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
