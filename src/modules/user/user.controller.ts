import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { FilterUsersDto } from '../../model/dto/user/filter-users.dto';
import { Permissions } from '../../decorator/permissions.decorator';
import { ActionUser } from '../../common/actions/user.action';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Permissions(ActionUser.READ_FILTER)
  async getUsers(@Query() filter: FilterUsersDto) {
    return this.userService.getUsers(filter);
  }

  @Get('/:id')
  @Permissions(ActionUser.READ_BY_ID)
  async getUserDetails(@Param('id') id: string) {
    return this.userService.getUserDetails(id);
  }
}
