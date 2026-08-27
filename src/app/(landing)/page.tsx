import { LandingTemplate } from "@/features/landing";
import { buildLandingJsonLd } from "@/lib/seo";

export default function LandingPage() {
  const jsonLd = buildLandingJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingTemplate />
    </>
  );
}
