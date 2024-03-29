import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from '../../model/entity/role.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from '../../model/dto/role/create-role.dto';
import { PageOptionsDto } from '../../model/dto/common/page-options.dto';
import { DataPageDto } from '../../model/dto/common/data-page.dto';
import { ActionRole } from '../../common/actions/role.action';
import { Permissions } from '../../decorator/permissions.decorator';
import { UpdateRoleDto } from '../../model/dto/role/update-role.dto';

@ApiTags('roles')
@Controller('/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiCreatedResponse()
  @Post()
  @Permissions(ActionRole.CREATE)
  async createRole(@Body() body: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(body);
  }

  @ApiOkResponse()
  @Get()
  @Permissions(ActionRole.READ_FILTER)
  async getRoles(@Query() params: PageOptionsDto): Promise<DataPageDto<Role>> {
    return this.roleService.getRoles(params);
  }

  @ApiOkResponse()
  @Get('/:id')
  @Permissions(ActionRole.READ_BY_ID)
  async getRole(@Param('id') roleId: string): Promise<Role> {
    return this.roleService.getRoleById(roleId);
  }

  @ApiOkResponse()
  @Patch('/:id')
  @Permissions(ActionRole.UPDATE)
  async updateRole(
    @Param('id') roleId: string,
    @Body() body: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.updateRole(roleId, body);
  }
}
