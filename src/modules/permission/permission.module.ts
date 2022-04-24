import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { CookieStrategyModule } from '../authentication/modules/cookie-strategy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionRepository]),
    CookieStrategyModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
