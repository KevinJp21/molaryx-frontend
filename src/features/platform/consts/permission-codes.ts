/** Módulos de permiso platform (alineados al backend). */
export const PERMISSION_MODULES = {
  TENANTS: "TENANTS",
} as const;

export type TPermissionModule =
  (typeof PERMISSION_MODULES)[keyof typeof PERMISSION_MODULES];

/** Códigos de permiso platform (alineados a PermissionCodes del backend). */
export const PERMISSION_CODES = {
  GET_PF_TENANTS: "GET_PF_TENANTS",
  ACTIVATE_PF_TENANT: "ACTIVATE_PF_TENANT",
  CREATE_PF_BUSINESS_TENANT: "CREATE_PF_BUSINESS_TENANT",
  UPDATE_PF_TENANT: "UPDATE_PF_TENANT",
} as const;

export type TPermissionCode =
  (typeof PERMISSION_CODES)[keyof typeof PERMISSION_CODES];
