import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePermissionParams } from './permission.interface';
import { Permission } from '../../model/entity/permission.entity';
import { PermissionRepository } from './permission.repository';
import { ExceptionMessageCode } from '../../exception/exception-message-codes.enum';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async createPermission(params: CreatePermissionParams): Promise<Permission> {
    const permissionExists =
      await this.permissionRepository.existsWithPermission(params.permission);
    if (permissionExists) {
      throw new ConflictException(
        ExceptionMessageCode.PERMISSION_ALREADY_EXISTS,
      );
    }

    return this.permissionRepository.createPermission(params);
  }

  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.getAllPermissions();
  }
}
