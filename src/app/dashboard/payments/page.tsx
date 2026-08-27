import type { Metadata } from "next";
import { PaymentsTemplate } from "@/features/dashboard";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Pagos");

export default function PaymentsPage() {
  return <PaymentsTemplate />;
}
