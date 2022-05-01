import { Injectable } from '@nestjs/common';
import { StatUsersService } from './stat-users.service';
import { UserService } from '../../user/user.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class StatUsersScheduler {
  constructor(
    private readonly statUsersService: StatUsersService,
    private readonly userService: UserService,
  ) {}

  @Cron('00 00 23 * * *')
  async scheduleStatUsersDailyWrite(): Promise<void> {
    const count = await this.userService.getRegisteredCountAfterMidnight();

    await this.statUsersService.createStatUsers({ count });
  }
}
