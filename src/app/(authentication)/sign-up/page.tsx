import type { Metadata } from "next";
import { SignUpTemplate } from "@/features/authentication/sign-up";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Registrarse");

export default function SignUpPage() {
  return <SignUpTemplate />;
}
