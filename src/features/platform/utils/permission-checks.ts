import type { TUserPermission } from "../types";
import {
  PERMISSION_CODES,
  PERMISSION_MODULES,
  type TPermissionCode,
  type TPermissionModule,
} from "../consts/permission-codes";

export const hasPermissionCode = (
  userPermissions: TUserPermission[] | undefined,
  module: TPermissionModule | string,
  code: TPermissionCode | string,
): boolean =>
  Boolean(
    userPermissions?.some(
      (permission) =>
        permission.module === module && permission.codes.includes(code),
    ),
  );

export const checkCanViewTenants = (
  userPermissions: TUserPermission[] | undefined,
) =>
  hasPermissionCode(
    userPermissions,
    PERMISSION_MODULES.TENANTS,
    PERMISSION_CODES.GET_PF_TENANTS,
  );
