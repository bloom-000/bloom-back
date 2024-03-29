import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoleRepository])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
