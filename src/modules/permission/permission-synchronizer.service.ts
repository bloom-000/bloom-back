import { Injectable, OnModuleInit } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ActionCategory } from '../../common/actions/category.action';
import { ActionPermission } from '../../common/actions/permission.action';
import { ActionProduct } from '../../common/actions/product.action';
import { ActionRole } from '../../common/actions/role.action';
import { ActionUser } from '../../common/actions/user.action';

@Injectable()
export class PermissionSynchronizerService implements OnModuleInit {
  constructor(private readonly permissionService: PermissionService) {}

  async onModuleInit(): Promise<any> {
    const permissions = [].concat(
      ...[
        ActionCategory,
        ActionPermission,
        ActionProduct,
        ActionRole,
        ActionUser,
      ].map((e) => Object.values(e)),
    );

    const writtenPermissions = await this.permissionService.getAllPermissions();
    const writtenPermissionCodes = writtenPermissions.map((e) => e.permission);

    for (const writtenPermission of writtenPermissions) {
      if (!permissions.includes(writtenPermission.permission)) {
        await this.permissionService.deletePermissionById(writtenPermission.id);
      }
    }

    for (const permission of permissions) {
      if (!writtenPermissionCodes.includes(permission)) {
        await this.permissionService.createPermission({ permission });
      }
    }
  }
}
