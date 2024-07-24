import { SetMetadata } from '@nestjs/common';
import { AppAbility } from '@repo/global';

export type PermissionParameters = Parameters<AppAbility['can']>;

export const PERMISSION_KEY = 'PERMISSION';
export const Permission = (...abilities: PermissionParameters) =>
  SetMetadata(PERMISSION_KEY, abilities);
