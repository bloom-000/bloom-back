import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PermissionSynchronizerService } from './permission-synchronizer.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionRepository])],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionSynchronizerService],
  exports: [PermissionService],
})
export class PermissionModule {}
