import { ConflictException, Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { CreateRoleParams, GetRolesParams } from './role.interface';
import { Role } from '../../model/entity/role.entity';
import { ExceptionMessageCode } from '../../exception/exception-message-codes.enum';
import { DataPage } from '../../model/common/data-page';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async createRole(params: CreateRoleParams): Promise<Role> {
    if (await this.roleRepository.existsWithName(params.name)) {
      throw new ConflictException(ExceptionMessageCode.ROLE_ALREADY_EXISTS);
    }

    return this.roleRepository.createRole(params);
  }

  async getRoles(params: GetRolesParams): Promise<DataPage<Role>> {
    return this.roleRepository.getRoles(params);
  }
}
