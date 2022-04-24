import { EntityRepository, Repository } from 'typeorm';
import { Role } from '../../model/entity/role.entity';
import {
  CreateRoleParams,
  GetRolesParams,
  UpdateRoleParams,
} from './role.interface';
import { DataPage } from '../../model/common/data-page';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  async createRole(params: CreateRoleParams): Promise<Role> {
    const entity = this.create(params);

    const role = await this.save(entity);

    await this.createQueryBuilder()
      .relation(Role, 'permissions')
      .of(role)
      .add(params.permissionIds);

    return role;
  }

  async existsWithName(name: string): Promise<boolean> {
    const count = await this.createQueryBuilder('roles')
      .where('roles.name = :name', { name })
      .getCount();

    return count > 0;
  }

  async getRoles(params: GetRolesParams): Promise<DataPage<Role>> {
    const { page, pageSize } = params;

    const [data, total] = await this.createQueryBuilder('roles')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { data, total };
  }

  async updateRole(
    roleId: number,
    params: UpdateRoleParams,
  ): Promise<Role | undefined> {
    const role = await this.createQueryBuilder('roles')
      .where('roles.id = :roleId', { roleId })
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .getOne();

    if (!role) {
      return undefined;
    }

    if (params.permissionIds) {
      await this.createQueryBuilder()
        .relation(Role, 'permissions')
        .of(role)
        .addAndRemove(
          params.permissionIds,
          role.permissions.map((e) => e.id),
        );
    }

    return this.save({
      id: roleId,
      name: params.name || role.name,
      description: params.description || role.description,
    });
  }

  async getById(roleId: number): Promise<Role | undefined> {
    return this.createQueryBuilder('roles')
      .where('roles.id = :roleId', { roleId })
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .getOne();
  }
}
