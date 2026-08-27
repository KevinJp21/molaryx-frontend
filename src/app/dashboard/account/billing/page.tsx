import type { Metadata } from "next";
import { BillingTemplate } from "@/features/dashboard/modules/account/modules/billing";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Facturación");

export default function AccountBillingPage() {
  return <BillingTemplate />;
}
