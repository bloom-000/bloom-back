import { EntityRepository, Repository } from 'typeorm';
import { Role } from '../../model/entity/role.entity';
import { CreateRoleParams, GetRolesParams } from './role.interface';
import { DataPage } from '../../model/common/data-page';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  async createRole(params: CreateRoleParams): Promise<Role> {
    const entity = this.create(params);

    return this.save(entity);
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
}
