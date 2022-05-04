import { EntityRepository, Repository } from 'typeorm';
import { RefreshToken } from '../../../model/entity/refresh-token.entity';
import { CreateRefreshTokenParams } from './refresh-token.interface';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
  async createRefreshToken(
    params: CreateRefreshTokenParams,
  ): Promise<RefreshToken> {
    const entity = this.create(params);

    return this.save(entity);
  }

  async getUserIdByRefreshToken(
    refreshToken: string,
  ): Promise<string | undefined> {
    const result = await this.createQueryBuilder('refreshTokens')
      .select('refreshTokens.userId', 'userId')
      .where('refreshTokens.refreshToken = :refreshToken', { refreshToken })
      .getRawOne();

    return result?.userId;
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.createQueryBuilder()
      .where('userId = :userId', { userId })
      .delete()
      .execute();
  }

  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    await this.createQueryBuilder()
      .where('refreshToken = :refreshToken', { refreshToken })
      .delete()
      .execute();
  }
}
