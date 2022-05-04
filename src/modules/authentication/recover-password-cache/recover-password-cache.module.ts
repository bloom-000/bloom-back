import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecoverPasswordCacheRepository } from './recover-password-cache.repository';
import { RecoverPasswordCacheService } from './recover-password-cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecoverPasswordCacheRepository])],
  providers: [RecoverPasswordCacheService],
  exports: [RecoverPasswordCacheService],
})
export class RecoverPasswordCacheModule {}
