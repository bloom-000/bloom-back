import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { CookieStrategyModule } from '../authentication/modules/cookie-strategy.module';
import { PermissionSynchronizerService } from './permission-synchronizer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionRepository]),
    CookieStrategyModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionSynchronizerService],
  exports: [PermissionService],
})
export class PermissionModule {}
