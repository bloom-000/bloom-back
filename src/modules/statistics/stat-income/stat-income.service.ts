import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StatIncomeRepository } from './stat-income.repository';
import { CreateStatIncomeParams } from './stat-income.interface';
import { StatIncome } from '../../../model/entity/stat-income.entity';
import { ExceptionMessageCode } from '../../../exception/exception-message-codes.enum';
import { DateUtils } from '../../../common/util/date.utils';

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
}
