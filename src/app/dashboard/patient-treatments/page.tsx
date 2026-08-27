import type { Metadata } from "next";
import { PatientTreatmentsTemplate } from "@/features/dashboard";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Planes de tratamiento");

export default function PatientTreatmentsPage() {
  return <PatientTreatmentsTemplate />;
}
