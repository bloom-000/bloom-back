import { EntityRepository, Repository } from 'typeorm';
import { Permission } from '../../model/entity/permission.entity';
import { CreatePermissionParams } from './permission.interface';

@EntityRepository(Permission)
export class PermissionRepository extends Repository<Permission> {
  async createPermission(params: CreatePermissionParams): Promise<Permission> {
    const entity = this.create(params);

    return this.save(entity);
  }

  async existsWithPermission(permission: string): Promise<boolean> {
    const count = await this.createQueryBuilder('permissions')
      .where('permissions.permission = :permission', { permission })
      .getCount();

    return count > 0;
  }

  async getAllPermissions(): Promise<Permission[]> {
    return this.find();
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.delete({ id });

    return !!result.affected;
  }
}
