import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../model/entity/user.entity';
import { Role } from '../../model/common/role.enum';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User | undefined> {
    return this.createQueryBuilder('users')
      .where('users.email = :email', { email })
      .getOne();
  }

  async findByRefreshToken(refreshToken: string): Promise<User | undefined> {
    return this.createQueryBuilder('users')
      .where(':refreshToken = ANY(users.refresh_tokens)', { refreshToken })
      .getOne();
  }

  async updateRefreshTokens(
    userId: number,
    refreshTokens: string[],
  ): Promise<void> {
    await this.createQueryBuilder('users')
      .update(User, { refreshTokens: refreshTokens })
      .where('users.id = :userId', { userId })
      .execute();
  }

  async getRefreshTokensFor(userId: number): Promise<string[] | undefined> {
    const result = await this.createQueryBuilder('users')
      .select('users.refresh_tokens', 'refresh_tokens')
      .where('users.id = :userId', { userId })
      .getRawOne();

    return result?.refresh_tokens;
  }

  async getRolesForUser(userId: number): Promise<Role[] | undefined> {
    const result = await this.createQueryBuilder('users')
      .select('users.roles', 'roles')
      .where('users.id = :userId', { userId })
      .getRawOne();

    return result?.roles;
  }
}
