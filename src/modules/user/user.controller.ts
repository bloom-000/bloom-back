import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { FilterUsersDto } from '../../model/dto/user/filter-users.dto';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Query() filter: FilterUsersDto) {
    return this.userService.getUsers(filter);
  }
}
