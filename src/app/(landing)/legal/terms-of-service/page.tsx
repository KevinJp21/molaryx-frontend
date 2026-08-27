import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocumentTemplate } from "@/features/landing/components/legal-document-template";
import { getLegalDocument } from "@/lib/legal/get-legal-document";
import { buildPageMetadata } from "@/lib/seo";

const document = getLegalDocument("terms-of-service");

export const metadata: Metadata = document
  ? buildPageMetadata({
      title: document.title,
      description:
        document.description ??
        "Términos y condiciones de uso de los servicios de Molaryx.",
      path: "/legal/terms-of-service",
      ogImageAlt: document.title,
    })
  : {
      title: "Términos y condiciones",
      description: "Términos y condiciones de uso de los servicios de Molaryx.",
    };

export default function TermsOfServicePage() {
  if (!document) notFound();
  return <LegalDocumentTemplate document={document} />;
}
