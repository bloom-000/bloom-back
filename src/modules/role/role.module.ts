import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { CookieStrategyModule } from '../authentication/modules/cookie-strategy.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoleRepository]), CookieStrategyModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
