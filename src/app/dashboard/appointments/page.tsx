import type { Metadata } from "next";
import { AppointmentsTemplate } from "@/features/dashboard/modules/appointments";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Citas");

export const AppointmentsPage = () => {
    return <AppointmentsTemplate />;
}

export default AppointmentsPage;