import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StatUsers } from '../../model/entity/stat-users.entity';
import { StatUsersService } from './stat-users/stat-users.service';
import { StatIncomeService } from './stat-income/stat-income.service';
import { StatIncome } from '../../model/entity/stat-income.entity';
import { GetIncomeStatsDto } from '../../model/dto/statistics/get-income-stats.dto';

@ApiTags('statistics')
@Controller('/statistics')
export class StatisticsController {
  constructor(
    private readonly statUsersService: StatUsersService,
    private readonly statIncomeService: StatIncomeService,
  ) {}

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

  @ApiOkResponse()
  @Get('/income/month')
  async getMonthlyIncome(): Promise<{ amount: number; orderCount: number }> {
    return this.statIncomeService.getMonthlyIncomeAmount();
  }

  @ApiOkResponse()
  @Get('/income')
  async getIncomeStatistics(
    @Query() query: GetIncomeStatsDto,
  ): Promise<StatIncome[]> {
    return this.statIncomeService.getIncomeStats(query);
  }
}
