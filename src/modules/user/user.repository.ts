import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../model/entity/user.entity';
import { Role } from '../../model/entity/role.entity';
import { DataPage } from '../../model/common/data-page';
import { CreateUserParams, GetUsersParams } from './user.interface';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User | undefined> {
    return this.createQueryBuilder('users')
      .where('users.email = :email', { email })
      .getOne();
  }

  async findByRefreshToken(refreshToken: string): Promise<User | undefined> {
    return this.createQueryBuilder('users')
      .where(':refreshToken = ANY(users.refreshTokens)', { refreshToken })
      .getOne();
  }

  async updateRefreshTokens(
    userId: string,
    refreshTokens: string[],
  ): Promise<void> {
    await this.createQueryBuilder('users')
      .update(User, { refreshTokens: refreshTokens })
      .where('users.id = :userId', { userId })
      .execute();
  }

  async getRefreshTokensFor(userId: string): Promise<string[] | undefined> {
    const result = await this.createQueryBuilder('users')
      .select('users.refreshTokens', 'refreshTokens')
      .where('users.id = :userId', { userId })
      .getRawOne();

    return result?.refreshTokens;
  }

  async getRolesForUser(userId: string): Promise<Role[] | undefined> {
    const result = await this.createQueryBuilder('users')
      .select('users.id')
      .leftJoinAndSelect('users.roles', 'roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .where('users.id = :userId', { userId })
      .getOne();

    return result?.roles;
  }

  async getUsers(params: GetUsersParams): Promise<DataPage<User>> {
    const { page, pageSize } = params;

    const [data, total] = await this.createQueryBuilder('users')
      .skip((page - 1) * pageSize)
      .getManyAndCount();

    return { data, total };
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.createQueryBuilder('users')
      .where('users.email = :email', { email })
      .getCount();

    return count > 0;
  }

  async createUser(params: CreateUserParams): Promise<User> {
    const entity = this.create(params);

    return this.save(entity);
  }
}
