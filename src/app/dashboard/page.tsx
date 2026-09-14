import type { Metadata } from "next";
import { DashboardHomeTemplate } from "@/features/dashboard/template/dashboard-home-template";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Inicio");

export const DashboardPage = () => {
  return <DashboardHomeTemplate />;
};

export default DashboardPage;