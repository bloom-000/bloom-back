export interface CreateRecoverPasswordCacheParams {
  email: string;
  uuid?: string;
  isConfirmed: boolean;
  code: string;
}

export type UpdateRecoverPasswordCacheParams =
  Partial<CreateRecoverPasswordCacheParams>;
