import type { Metadata } from "next";
import { ProfileTemplate } from "@/features/dashboard/modules/account/modules/profile";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Perfil");

export default function AccountProfilePage() {
  return <ProfileTemplate />;
}
