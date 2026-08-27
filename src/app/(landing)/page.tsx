import { apiGetPublicPlansAction } from "@/features/public-plans";
import { LandingTemplate } from "@/features/landing";
import { buildLandingJsonLd } from "@/lib/seo";

export default async function LandingPage() {
  const plansResult = await apiGetPublicPlansAction();
  const plans = plansResult.success ? (plansResult.data ?? []) : [];
  const plansError = plansResult.success
    ? undefined
    : plansResult.message ?? "No se pudieron cargar los planes.";
  const jsonLd = buildLandingJsonLd(plans);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingTemplate plans={plans} plansError={plansError} />
    </>
  );
}
