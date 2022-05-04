import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class GetIncomeStatsDto {
  @ApiProperty({ type: Date, default: new Date() })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ type: Date, default: new Date() })
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
