import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPANY_NAME } from "@/consts";
import { LegalDocumentTemplate } from "@/features/landing/components/legal-document-template";
import { getLegalDocument } from "@/lib/legal/get-legal-document";

const document = getLegalDocument("terms-of-service");

export const metadata: Metadata = {
  title: document?.title
    ? `${document.title} | ${COMPANY_NAME}`
    : `Términos y condiciones | ${COMPANY_NAME}`,
  description:
    document?.description ??
    `Términos y condiciones de uso de los servicios de ${COMPANY_NAME}.`,
};

export default function TermsOfServicePage() {
  if (!document) notFound();
  return <LegalDocumentTemplate document={document} />;
}
