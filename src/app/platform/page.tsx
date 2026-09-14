import type { Metadata } from "next";
import { PlatformHomeTemplate } from "@/features/platform/template";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Inicio");

export default function PlatformPage() {
  return <PlatformHomeTemplate />;
}
