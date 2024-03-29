import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../model/entity/user.entity';
import { Role } from '../../model/entity/role.entity';
import { DataPage } from '../../model/common/data-page';
import { CreateUserParams, GetUsersParams } from './user.interface';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getByEmail(email: string): Promise<User | undefined> {
    return this.createQueryBuilder('users')
      .where('users.email = :email', { email })
      .getOne();
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

  async getUserDetails(userId: string): Promise<User | undefined> {
    return this.createQueryBuilder('users')
      .select([
        'users.id',
        'users.createdAt',
        'users.updatedAt',
        'users.deletedAt',
        'users.fullName',
        'users.email',
        'users.gender',
        'users.birthDate',
      ])
      .where('users.id = :userId', { userId })
      .getOne();
  }

  async getCountAfterDate(date: Date): Promise<number> {
    return this.createQueryBuilder('users')
      .where('users.createdAt >= :date', { date })
      .getCount();
  }

  async findById(userId: string): Promise<User | undefined> {
    return this.createQueryBuilder('users')
      .where('users.id = :userId', { userId })
      .getOne();
  }

  async getIdByEmail(email: string): Promise<string> {
    const result = await this.createQueryBuilder('users')
      .select('users.id', 'id')
      .where('users.email = :email', { email })
      .getRawOne();

    return result?.id;
  }

  async updatePasswordById(userId: string, password: string): Promise<void> {
    await this.createQueryBuilder()
      .update(User, { password })
      .where('id = :userId', { userId })
      .execute();
  }
}
