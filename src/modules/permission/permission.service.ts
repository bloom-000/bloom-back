import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionParams } from './permission.interface';
import { Permission } from '../../model/entity/permission.entity';
import { PermissionRepository } from './permission.repository';
import { ExceptionMessageCode } from '../../common/exception-message-code.enum';

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

  async deletePermissionById(permissionId: string): Promise<void> {
    const didDelete = await this.permissionRepository.deleteById(permissionId);
    if (!didDelete) {
      throw new NotFoundException(ExceptionMessageCode.PERMISSION_NOT_FOUND);
    }
  }
}
