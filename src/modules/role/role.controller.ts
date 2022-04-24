import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from '../../model/entity/role.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from '../../model/dto/role/create-role.dto';
import { PageOptionsDto } from '../../model/dto/common/page-options.dto';
import { DataPageDto } from '../../model/dto/common/data-page.dto';

@ApiTags('roles')
@Controller('/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiCreatedResponse()
  @Post()
  async createRole(@Body() body: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(body);
  }

  @ApiOkResponse()
  @Get()
  async getRoles(@Query() params: PageOptionsDto): Promise<DataPageDto<Role>> {
    return this.roleService.getRoles(params);
  }
}
