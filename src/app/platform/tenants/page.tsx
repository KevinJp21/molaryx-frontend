import type { Metadata } from "next";
import { TenantsTemplate } from "@/features/platform/modules/tenants";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Tenants");

export default function PlatformTenantsPage() {
  return <TenantsTemplate />;
}
