import type { IGetPublicPlans } from "@/features/public-plans";
import { siteName, siteUrl } from "@/consts/site";
import { defaultDescription, defaultTitle } from "./metadata";

function absoluteUrl(path: string) {
  return new URL(path, siteUrl).href;
}

const PRICING_URL = `${siteUrl}/#pricing`;
const IN_STOCK = "https://schema.org/InStock";
const STRIKETHROUGH_PRICE = "https://schema.org/StrikethroughPrice";

function buildPlanOfferJsonLd(plan: IGetPublicPlans) {
  const base = {
    "@type": "Offer" as const,
    name: plan.name,
    availability: IN_STOCK,
    url: PRICING_URL,
  };

  const listPrice = plan.price;
  const salePrice = plan.promotionPlan?.price ?? listPrice;

  if (salePrice == null) {
    return {
      ...base,
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "COP",
      },
    };
  }

  const offer: Record<string, unknown> = {
    ...base,
    price: String(salePrice),
    priceCurrency: "COP",
  };

  if (
    plan.promotionPlan &&
    listPrice != null &&
    listPrice !== plan.promotionPlan.price
  ) {
    offer.priceSpecification = {
      "@type": "UnitPriceSpecification",
      price: String(listPrice),
      priceCurrency: "COP",
      priceType: STRIKETHROUGH_PRICE,
    };
  }

  return offer;
}

export function buildLandingJsonLd(plans: IGetPublicPlans[] = []) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
      logo: absoluteUrl("/images/molaryx_logo.svg"),
    },
    {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
      inLanguage: "es-CO",
      publisher: { "@type": "Organization", name: siteName, url: siteUrl },
    },
    {
      "@type": "WebPage",
      name: defaultTitle,
      description: defaultDescription,
      url: siteUrl,
      inLanguage: "es-CO",
      isPartOf: { "@type": "WebSite", name: siteName, url: siteUrl },
    },
  ];

  if (plans.length > 0) {
    graph.push({
      "@type": "SoftwareApplication",
      name: siteName,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: siteUrl,
      description: defaultDescription,
      inLanguage: "es-CO",
      offers: plans.map(buildPlanOfferJsonLd),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
