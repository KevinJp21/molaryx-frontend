import type { VariantProps } from "class-variance-authority";
import type { badgeVariants } from "@/components/ui/badge";

export const TENANT_TYPE = {
  STANDARD: 1,
  FOUNDER: 2,
} as const;

export type TTenantType = (typeof TENANT_TYPE)[keyof typeof TENANT_TYPE];

type TBadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const TENANT_TYPE_BADGE_VARIANT: Record<TTenantType, TBadgeVariant> = {
  [TENANT_TYPE.STANDARD]: "success",
  [TENANT_TYPE.FOUNDER]: "destructive",
};

export const isTenantTypeId = (id: number): id is TTenantType =>
  id === TENANT_TYPE.STANDARD || id === TENANT_TYPE.FOUNDER;

export const getTenantTypeBadgeVariant = (
  id: number | null | undefined,
): TBadgeVariant => {
  if (!isTenantTypeId(Number(id))) return "secondary";
  return TENANT_TYPE_BADGE_VARIANT[id as TTenantType];
};
