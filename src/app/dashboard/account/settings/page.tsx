import type { Metadata } from "next";
import { SettingsTemplate } from "@/features/dashboard/modules/account/modules/settings";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Configuración");

export default function AccountSettingsPage() {
  return <SettingsTemplate />;
}
