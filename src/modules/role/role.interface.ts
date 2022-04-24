export interface CreateRoleParams {
  name: string;
  description: string;
  permissionIds: number[];
}

export interface GetRolesParams {
  page: number;
  pageSize: number;
}

export type UpdateRoleParams = Partial<CreateRoleParams>;
