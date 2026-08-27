import type { TUserPermission } from "../types";
import { PLATFORM_SIDEBAR_SECTIONS } from "../consts";

export const PLATFORM_HOME_ROUTE = "/platform";

const ROUTE_PERMISSION_MAP: Record<
  string,
  { module?: TUserPermission["module"] } | undefined
> = PLATFORM_SIDEBAR_SECTIONS.flatMap((section) => section.items).reduce<
  Record<string, { module?: TUserPermission["module"] } | undefined>
>((acc, item) => {
  acc[item.href] = item.permission;
  return acc;
}, {});

export const hasRouteAccess = (
  pathname: string,
  userPermissions: TUserPermission[] | undefined,
): boolean => {
  const matchedHref = Object.keys(ROUTE_PERMISSION_MAP)
    .filter(
      (href) =>
        pathname === href ||
        (href !== PLATFORM_HOME_ROUTE && pathname.startsWith(`${href}/`)),
    )
    .sort((a, b) => b.length - a.length)[0];

  if (!matchedHref) return true;

  const rule = ROUTE_PERMISSION_MAP[matchedHref];
  if (!rule?.module) return true;

  return Boolean(userPermissions?.some((p) => p.module === rule.module));
};

export const filterSectionItemsByPermissions = (
  userPermissions: TUserPermission[] | undefined,
) =>
  PLATFORM_SIDEBAR_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      const requiredModule = item.permission?.module;
      if (!requiredModule) return true;
      return Boolean(userPermissions?.some((p) => p.module === requiredModule));
    }),
  })).filter((section) => section.items.length > 0);
