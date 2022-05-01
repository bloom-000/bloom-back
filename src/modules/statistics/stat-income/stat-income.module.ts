import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatIncomeRepository } from './stat-income.repository';
import { StatIncomeService } from './stat-income.service';
import { OrderModule } from '../../order/order.module';
import { StatIncomeScheduler } from './stat-income.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([StatIncomeRepository]), OrderModule],
  providers: [StatIncomeService, StatIncomeScheduler],
  exports: [StatIncomeService],
})
export class StatIncomeModule {}
