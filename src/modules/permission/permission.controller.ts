import { Controller, Get } from '@nestjs/common';
import { Permission } from '../../model/entity/permission.entity';
import { PermissionService } from './permission.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../decorator/permissions.decorator';
import { ActionPermission } from '../../common/actions/permission.action';

@ApiTags('permissions')
@Controller('/permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOkResponse()
  @Get()
  @Permissions(ActionPermission.READ_ALL)
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionService.getAllPermissions();
  }
}
