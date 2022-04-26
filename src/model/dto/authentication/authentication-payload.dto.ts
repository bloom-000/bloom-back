import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationPayloadDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
