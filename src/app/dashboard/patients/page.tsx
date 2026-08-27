import type { Metadata } from "next";
import { PatientsTemplate } from "@/features/dashboard/modules/patients";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Pacientes");

export const PatientsPage = () => {
    return (
        <PatientsTemplate />
    )
}

export default PatientsPage;