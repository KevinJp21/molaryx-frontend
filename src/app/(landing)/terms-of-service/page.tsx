import type { Metadata } from "next";
import { COMPANY_NAME } from "@/consts";
import { TermsOfServiceTemplate } from "@/features/landing/components/terms-of-service-template";

export const metadata: Metadata = {
  title: `Términos y Condiciones | ${COMPANY_NAME}`,
  description: `Términos y condiciones de uso de los servicios de ${COMPANY_NAME} en Colombia.`,
};

export default function TerminosPage() {
  return <TermsOfServiceTemplate />;
}
