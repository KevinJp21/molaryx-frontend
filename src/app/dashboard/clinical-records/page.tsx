import type { Metadata } from "next";
import { ClinicalRecordsTemplate } from "@/features/dashboard/modules/clinical-records";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Historia clínica");

export default function ClinicalRecordsPage() {
  return <ClinicalRecordsTemplate />;
}
