import { SetMetadata } from '@nestjs/common';

export const KEY_PERMISSIONS = 'permissions';
export const Permissions = (...permissions: string[]) =>
  SetMetadata(KEY_PERMISSIONS, permissions);
