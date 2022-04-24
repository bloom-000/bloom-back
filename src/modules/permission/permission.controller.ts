import { Controller, Get } from '@nestjs/common';
import { Permission } from '../../model/entity/permission.entity';
import { PermissionService } from './permission.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('/permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOkResponse()
  @Get()
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionService.getAllPermissions();
  }
}
