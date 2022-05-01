import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StatUsers } from '../../model/entity/stat-users.entity';
import { StatUsersService } from './stat-users/stat-users.service';

@ApiTags('statistics')
@Controller('/statistics')
export class StatisticsController {
  constructor(private readonly statUsersService: StatUsersService) {}

  @ApiOkResponse()
  @Get('/registered-users')
  async getRegisteredUserStatistics(
    @Query('forLastDaysCount', ParseIntPipe) forLastDaysCount: number,
  ): Promise<StatUsers[]> {
    return this.statUsersService.getLastStatUsers(forLastDaysCount);
  }

  @ApiOkResponse()
  @Get('/registered-users/total')
  async getTotalRegisteredUserCount(): Promise<{ count: number }> {
    const count = await this.statUsersService.getTotalRegisteredUsersCount();

    return { count };
  }
}
