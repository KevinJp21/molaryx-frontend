type TUserPermissionLike = {
  module: string;
  codes: string[];
};

const OPERATIONAL_MODULES = [
  "PATIENTS",
  "PROCEDURES",
  "APPOINTMENTS",
  "USERS",
  "TREATMENTS",
  "PATIENT_TREATMENTS",
  "PAYMENTS",
  "CLINICAL_RECORDS",
] as const;

export const DASHBOARD_HOME_ROUTE = "/dashboard";
export const PLATFORM_HOME_ROUTE = "/platform";

export const isPlatformOnlyUser = (
  permissions: TUserPermissionLike[] | undefined,
): boolean => {
  if (!permissions?.length) return false;

  const hasTenants = permissions.some(
    (permission) => permission.module === "TENANTS",
  );
  const hasOperational = permissions.some((permission) =>
    OPERATIONAL_MODULES.includes(
      permission.module as (typeof OPERATIONAL_MODULES)[number],
    ),
  );

  return hasTenants && !hasOperational;
};

export const resolveAppHomeRoute = (
  permissions: TUserPermissionLike[] | undefined,
): string =>
  isPlatformOnlyUser(permissions)
    ? PLATFORM_HOME_ROUTE
    : DASHBOARD_HOME_ROUTE;
