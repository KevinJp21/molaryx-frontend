import type { Metadata } from "next";
import { COMPANY_NAME } from "@/consts";
import { PrivacyPolicyTemplate } from "@/features/landing/components/privacy-policy-template";

export const metadata: Metadata = {
  title: `Política de privacidad | ${COMPANY_NAME}`,
  description: `Política de privacidad y tratamiento de datos personales de ${COMPANY_NAME}.`,
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyTemplate />;
}
