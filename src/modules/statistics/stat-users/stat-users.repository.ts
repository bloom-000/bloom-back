import { EntityRepository, Repository } from 'typeorm';
import { StatUsers } from '../../../model/entity/stat-users.entity';
import { CreateStatUsersParams } from './stat-users.interface';

@EntityRepository(StatUsers)
export class StatUsersRepository extends Repository<StatUsers> {
  async createStatUsers(params: CreateStatUsersParams): Promise<StatUsers> {
    const entity = this.create(params);

    return this.save(entity);
  }

  async getCountAfterDate(date: Date): Promise<number> {
    return this.createQueryBuilder('statUsers')
      .where('statUsers.createdAt >= :date', { date })
      .getCount();
  }

  async getAfterDate(date: Date): Promise<StatUsers[]> {
    return this.createQueryBuilder('statUsers')
      .where('statUsers.createdAt >= :date', { date })
      .getMany();
  }

  async getTotalRegisteredUsersCount(): Promise<number> {
    const result = await this.createQueryBuilder('statUsers')
      .select('SUM(statUsers.count)', 'sum')
      .getRawOne();

    return Number(result?.sum);
  }
}
