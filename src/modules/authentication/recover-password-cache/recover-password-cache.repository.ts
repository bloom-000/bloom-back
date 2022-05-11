import { EntityRepository, Repository } from 'typeorm';
import {
  CreateRecoverPasswordCacheParams,
  UpdateRecoverPasswordCacheParams,
} from './recover-password-cache.interface';
import { RecoverPasswordCache } from '../../../model/entity/recover-password-cache.entity';

@EntityRepository(RecoverPasswordCache)
export class RecoverPasswordCacheRepository extends Repository<RecoverPasswordCache> {
  async createRecoverPasswordCache(
    params: CreateRecoverPasswordCacheParams,
  ): Promise<RecoverPasswordCache> {
    const entity = this.create(params);

    return this.save(entity);
  }

  async updateRecoverPasswordCache(
    id: string,
    params: UpdateRecoverPasswordCacheParams,
  ): Promise<RecoverPasswordCache | undefined> {
    const recoverPasswordCache = await this.findOne({ where: { id } });
    if (!recoverPasswordCache) {
      return undefined;
    }

    return this.save({
      id,
      email: params.email ?? recoverPasswordCache.email,
      uuid: params.uuid ?? recoverPasswordCache.uuid,
      isConfirmed: params.isConfirmed ?? recoverPasswordCache.isConfirmed,
    });
  }

  async getByEmail(email: string): Promise<RecoverPasswordCache | undefined> {
    return this.createQueryBuilder('recoverPasswordCache')
      .where('recoverPasswordCache.email = :email', { email })
      .getOne();
  }

  async getByUUID(uuid: string): Promise<RecoverPasswordCache | undefined> {
    return this.createQueryBuilder('recoverPasswordCache')
      .where('recoverPasswordCache.uuid = :uuid', { uuid })
      .getOne();
  }

  async deleteAllByEmail(email: string): Promise<void> {
    await this.createQueryBuilder()
      .where('email = :email', { email })
      .delete()
      .execute();
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.delete({ id });

    return !!result.affected;
  }

  async updateCodeById(id: string, code: string): Promise<void> {
    await this.createQueryBuilder()
      .update(RecoverPasswordCache, { code })
      .where('id = :id', { id })
      .execute();
  }
}
