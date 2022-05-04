import { EntityRepository, Repository } from 'typeorm';
import { StatIncome } from '../../../model/entity/stat-income.entity';
import {
  CreateStatIncomeParams,
  GetIncomeStatsParams,
} from './stat-income.interface';

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

  async getStatsAfterDate(date: Date): Promise<StatIncome[]> {
    return this.createQueryBuilder('statIncome')
      .where('statIncome.createdAt >= :date', { date })
      .getMany();
  }

  async getStatsBetween(params: GetIncomeStatsParams): Promise<StatIncome[]> {
    return this.createQueryBuilder('statIncome')
      .where('statIncome.createdAt >= :startDate', {
        startDate: params.startDate,
      })
      .andWhere('statIncome.endDate <= :endDate', { endDate: params.endDate })
      .getMany();
  }
}
