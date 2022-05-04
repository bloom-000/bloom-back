import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class GetIncomeStatsDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
