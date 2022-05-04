import { ApiProperty } from '@nestjs/swagger';

export class RecoverPasswordConfirmCodeResponseDto {
  @ApiProperty()
  uuid: string;
}
