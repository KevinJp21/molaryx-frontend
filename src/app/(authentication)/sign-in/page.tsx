import type { Metadata } from "next";
import { SignInTemplate } from "@/features/authentication/sign-in";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Iniciar sesión");

export default function SignInPage() {
  return <SignInTemplate />;
}