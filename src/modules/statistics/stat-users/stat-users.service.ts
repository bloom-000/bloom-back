import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StatUsersRepository } from './stat-users.repository';
import { StatUsers } from '../../../model/entity/stat-users.entity';
import { CreateStatUsersParams } from './stat-users.interface';
import { ExceptionMessageCode } from '../../../common/exception-message-code.enum';
import { DateUtils } from '../../../common/util/date.utils';
import { DurationConstants } from '../../../common/duration.constants';

@Injectable()
export class StatUsersService {
  constructor(private readonly statUsersRepository: StatUsersRepository) {}

  async createStatUsers(params: CreateStatUsersParams): Promise<StatUsers> {
    const countAfterMidnight = await this.statUsersRepository.getCountAfterDate(
      DateUtils.getMidnight(),
    );
    if (countAfterMidnight > 0) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.USERS_STAT_ALREADY_EXISTS_FOR_TODAY,
      );
    }

    return this.statUsersRepository.createStatUsers(params);
  }

  async getLastStatUsers(forLastDaysCount: number): Promise<StatUsers[]> {
    const afterDate = new Date(
      Date.now() - DurationConstants.MILLIS_IN_DAY * forLastDaysCount,
    );

    return this.statUsersRepository.getAfterDate(afterDate);
  }

  async getTotalRegisteredUsersCount(): Promise<number> {
    return this.statUsersRepository.getTotalRegisteredUsersCount();
  }
}
