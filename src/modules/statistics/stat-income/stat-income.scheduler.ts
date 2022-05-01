import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StatIncomeService } from './stat-income.service';
import { OrderService } from '../../order/order.service';

@Injectable()
export class StatIncomeScheduler {
  constructor(
    private readonly statIncomeService: StatIncomeService,
    private readonly orderService: OrderService,
  ) {}

  @Cron('00 00 23 * * *')
  async scheduleStatIncomeDailyWrite(): Promise<void> {
    const orders = await this.orderService.getOrdersAfterMidnight();

    const amountAccumulated = orders.reduce(
      (accumulator, current) => accumulator + current.itemTotal, // delivery fee should be here?
      0,
    );

    await this.statIncomeService.createStatIncome({
      amount: amountAccumulated,
    });
  }
}
