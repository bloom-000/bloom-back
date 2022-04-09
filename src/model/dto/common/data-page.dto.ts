import { ApiProperty } from '@nestjs/swagger';

export class DataPageDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  total: number;
}
