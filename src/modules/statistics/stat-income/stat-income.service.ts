import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StatIncomeRepository } from './stat-income.repository';
import {
  CreateStatIncomeParams,
  GetIncomeStatsParams,
} from './stat-income.interface';
import { StatIncome } from '../../../model/entity/stat-income.entity';
import { ExceptionMessageCode } from '../../../common/exception-message-code.enum';
import { DateUtils } from '../../../common/util/date.utils';
import { DurationConstants } from '../../../common/duration.constants';

@Injectable()
export class StatIncomeService {
  constructor(private readonly statIncomeRepository: StatIncomeRepository) {}

  async createStatIncome(params: CreateStatIncomeParams): Promise<StatIncome> {
    const countAfterMidnight =
      await this.statIncomeRepository.getCountAfterDate(
        DateUtils.getMidnight(),
      );
    if (countAfterMidnight > 0) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.INCOME_STAT_ALREADY_EXISTS_FOR_TODAY,
      );
    }

    return this.statIncomeRepository.createStatIncome(params);
  }

  async getMonthlyIncomeAmount(): Promise<{
    amount: number;
    orderCount: number;
  }> {
    const date = new Date(Date.now() - 30 * DurationConstants.MILLIS_IN_DAY);

    const incomeStats = await this.statIncomeRepository.getStatsAfterDate(date);

    const amount = incomeStats.reduce((acc, curr) => acc + curr.amount, 0);
    const totalOrderCount = incomeStats.reduce(
      (acc, curr) => acc + curr.orderCount,
      0,
    );

    return { amount, orderCount: totalOrderCount };
  }

  async getIncomeStats(params: GetIncomeStatsParams): Promise<StatIncome[]> {
    return this.statIncomeRepository.getStatsBetween(params);
  }
}
