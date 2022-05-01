import { EntityRepository, Repository } from 'typeorm';
import { StatIncome } from '../../../model/entity/stat-income.entity';
import { CreateStatIncomeParams } from './stat-income.interface';

@EntityRepository(StatIncome)
export class StatIncomeRepository extends Repository<StatIncome> {
  async createStatIncome(params: CreateStatIncomeParams): Promise<StatIncome> {
    const entity = this.create(params);

    return this.save(entity);
  }

  async getCountAfterDate(date: Date): Promise<number> {
    return this.createQueryBuilder('statIncome')
      .where('statIncome.createdAt >= :date', { date })
      .getCount();
  }
}
