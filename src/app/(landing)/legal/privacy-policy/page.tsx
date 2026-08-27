import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocumentTemplate } from "@/features/landing/components/legal-document-template";
import { getLegalDocument } from "@/lib/legal/get-legal-document";
import { buildPageMetadata } from "@/lib/seo";

const document = getLegalDocument("privacy-policy");

export const metadata: Metadata = document
  ? buildPageMetadata({
      title: document.title,
      description:
        document.description ??
        "Política de privacidad y tratamiento de datos personales de Molaryx.",
      path: "/legal/privacy-policy",
      ogImageAlt: document.title,
    })
  : {
      title: "Política de privacidad",
      description: "Política de privacidad y tratamiento de datos personales de Molaryx.",
    };

export default function PrivacyPolicyPage() {
  if (!document) notFound();
  return <LegalDocumentTemplate document={document} />;
}
