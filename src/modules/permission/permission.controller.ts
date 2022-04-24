import { Controller, Get, UseGuards } from '@nestjs/common';
import { Permission } from '../../model/entity/permission.entity';
import { PermissionService } from './permission.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';

@ApiTags('permissions')
@Controller('/permissions')
@UseGuards(JwtAuthGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOkResponse()
  @Get()
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionService.getAllPermissions();
  }
}
