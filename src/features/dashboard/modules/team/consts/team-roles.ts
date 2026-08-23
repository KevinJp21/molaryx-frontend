import { ROLES, ROLES_IDS } from "@/consts";

export type TTeamRoleFilter = number | "all";

export const TEAM_MEMBER_ROLE_IDS = [
  ROLES_IDS.PROFESSIONAL,
  ROLES_IDS.ASSISTANT,
] as const;

/** Roles por defecto en el listado (nunca incluye owner). */
export const DEFAULT_TEAM_ROLE_IDS: number[] = [...TEAM_MEMBER_ROLE_IDS];

export const TEAM_ROLE_FILTER_OPTIONS: {
  value: number;
  label: string;
}[] = ROLES.filter((role) =>
  (TEAM_MEMBER_ROLE_IDS as readonly number[]).includes(role.id),
).map((role) => ({
  value: role.id,
  label: role.name,
}));

export const getTeamRoleName = (idUserRole: number) =>
  ROLES.find((role) => role.id === idUserRole)?.name ?? "Sin rol";

export const resolveTeamRoleFilterIds = (role: TTeamRoleFilter): number[] =>
  role === "all" ? DEFAULT_TEAM_ROLE_IDS : [role];

export const parseTeamRoleFilter = (ids?: number[]): TTeamRoleFilter => {
  if (!ids?.length) return "all";
  if (ids.length === 1) {
    const [id] = ids;
    if ((TEAM_MEMBER_ROLE_IDS as readonly number[]).includes(id)) return id;
  }
  return "all";
};
