import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatIncomeModule } from './stat-income/stat-income.module';
import { StatUsersModule } from './stat-users/stat-users.module';

@Module({
  imports: [StatIncomeModule, StatUsersModule],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
