import { PageOptionsDto } from '../common/page-options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from '@nestjs/class-validator';

export class FilterOrdersDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  userId?: string;
}
