import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatUsersRepository } from './stat-users.repository';
import { UserModule } from '../../user/user.module';
import { StatUsersService } from './stat-users.service';
import { StatUsersScheduler } from './stat-users.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([StatUsersRepository]), UserModule],
  providers: [StatUsersService, StatUsersScheduler],
  exports: [StatUsersService],
})
export class StatUsersModule {}
