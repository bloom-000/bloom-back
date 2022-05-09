import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RecoverPasswordCacheRepository } from './recover-password-cache.repository';
import {
  CreateRecoverPasswordCacheParams,
  UpdateRecoverPasswordCacheParams,
} from './recover-password-cache.interface';
import { RecoverPasswordCache } from '../../../model/entity/recover-password-cache.entity';
import { environment } from '../../../environment';
import { ExceptionMessageCode } from '../../../common/exception-message-code.enum';

@Injectable()
export class RecoverPasswordCacheService {
  constructor(
    private readonly recoverPasswordCacheRepository: RecoverPasswordCacheRepository,
  ) {}

  async createRecoverPasswordCache(
    params: CreateRecoverPasswordCacheParams,
  ): Promise<RecoverPasswordCache> {
    await this.recoverPasswordCacheRepository.deleteAllByEmail(params.email);

    return this.recoverPasswordCacheRepository.createRecoverPasswordCache(
      params,
    );
  }

  async validateRecoverPasswordCacheExpiration(
    recoverPasswordCache: RecoverPasswordCache,
  ): Promise<void> {
    const diffInMillis = Date.now() - recoverPasswordCache.createdAt.getTime();
    if (diffInMillis > environment.recoverPasswordCacheTimeoutInMillis) {
      throw new BadRequestException(
        ExceptionMessageCode.RECOVER_PASSWORD_REQUEST_TIMED_OUT,
      );
    }
  }

  async getRecoverPasswordCacheByEmail(
    email: string,
  ): Promise<RecoverPasswordCache | undefined> {
    const recoverPasswordCache =
      await this.recoverPasswordCacheRepository.getByEmail(email);
    if (!recoverPasswordCache) {
      throw new NotFoundException(
        ExceptionMessageCode.RECOVER_PASSWORD_CACHE_NOT_FOUND,
      );
    }

    return recoverPasswordCache;
  }

  async updateRecoverPasswordCache(
    id: string,
    params: UpdateRecoverPasswordCacheParams,
  ): Promise<RecoverPasswordCache> {
    const recoverPasswordCache =
      await this.recoverPasswordCacheRepository.updateRecoverPasswordCache(
        id,
        params,
      );
    if (!recoverPasswordCache) {
      throw new NotFoundException(
        ExceptionMessageCode.RECOVER_PASSWORD_CACHE_NOT_FOUND,
      );
    }

    return recoverPasswordCache;
  }

  async getRecoverPasswordCacheByUUID(uuid: string) {
    const recoverPasswordCache =
      await this.recoverPasswordCacheRepository.getByUUID(uuid);
    if (!recoverPasswordCache) {
      throw new NotFoundException(
        ExceptionMessageCode.RECOVER_PASSWORD_CACHE_NOT_FOUND,
      );
    }

    return recoverPasswordCache;
  }

  async deleteRecoverPasswordCacheById(id: string): Promise<void> {
    await this.recoverPasswordCacheRepository.deleteById(id);
  }
}
