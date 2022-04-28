import { PageOptionParams } from '../../model/common/page-option.params';

export interface CreateRoleParams {
  name: string;
  description: string;
  permissionIds: string[];
}

export type GetRolesParams = PageOptionParams;

export type UpdateRoleParams = Partial<CreateRoleParams>;
