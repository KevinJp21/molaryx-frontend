import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPANY_NAME } from "@/consts";
import { LegalDocumentTemplate } from "@/features/landing/components/legal-document-template";
import { getLegalDocument } from "@/lib/legal/get-legal-document";

const document = getLegalDocument("privacy-policy");

export const metadata: Metadata = {
  title: document?.title
    ? `${document.title} | ${COMPANY_NAME}`
    : `Política de privacidad | ${COMPANY_NAME}`,
  description:
    document?.description ??
    `Política de privacidad y tratamiento de datos personales de ${COMPANY_NAME}.`,
};

export default function PrivacyPolicyPage() {
  if (!document) notFound();
  return <LegalDocumentTemplate document={document} />;
}
