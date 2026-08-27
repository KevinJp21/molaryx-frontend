import type { Metadata } from "next";
import { TreatmentsTemplate } from "@/features/dashboard";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Tratamientos");

export const TreatmentsPage = () => {
    return <TreatmentsTemplate />;
}

export default TreatmentsPage;