import type { TUserPermission } from "../types";
import {
  MODULE_CRUD,
  PERMISSION_CODES,
  PERMISSION_MODULES,
  type TCrudModule,
  type TPermissionCode,
  type TPermissionModule,
} from "../consts/permission-codes";

type TCrudAction = "view" | "create" | "update" | "delete";

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

const hasModuleAction = (
  userPermissions: TUserPermission[] | undefined,
  module: TCrudModule,
  action: TCrudAction,
): boolean => {
  const code = (
    MODULE_CRUD[module] as Partial<Record<TCrudAction, TPermissionCode>>
  )[action];
  if (!code) return false;
  return hasPermissionCode(userPermissions, module, code);
};

export const checkCanView = (
  userPermissions: TUserPermission[] | undefined,
  module: TCrudModule,
) => hasModuleAction(userPermissions, module, "view");

export const checkCanCreate = (
  userPermissions: TUserPermission[] | undefined,
  module: TCrudModule,
) => hasModuleAction(userPermissions, module, "create");

export const checkCanUpdate = (
  userPermissions: TUserPermission[] | undefined,
  module: TCrudModule,
) => hasModuleAction(userPermissions, module, "update");

export const checkCanDelete = (
  userPermissions: TUserPermission[] | undefined,
  module: TCrudModule,
) => hasModuleAction(userPermissions, module, "delete");

/** Atajo para códigos especiales (no CRUD genérico). */
export const checkCanViewPaymentsSummary = (
  userPermissions: TUserPermission[] | undefined,
) =>
  hasPermissionCode(
    userPermissions,
    PERMISSION_MODULES.PAYMENTS,
    PERMISSION_CODES.GET_PAYMENTS_SUMMARY_BY_CONCEPT,
  );
