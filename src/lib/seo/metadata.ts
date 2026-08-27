import type { Metadata } from "next";
import {
  siteName,
  siteUrl,
  siteTwitter,
  siteOgImage,
  siteOgLocale,
  siteKeywords,
  siteThemeColor,
} from "@/consts/site";

export const defaultTitle = `${siteName} | Gestión de consultorios`;

export const defaultDescription =
  "Gestiona pacientes, historial clínico, citas, procedimientos y pagos desde un solo lugar. Molaryx te ayuda a mantener la información de tu consultorio organizada y fácil de consultar.";

export const siteRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};

export const noIndexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
};

function absoluteUrl(path: string) {
  return new URL(path, siteUrl).href;
}

function buildOpenGraphImage(alt: string) {
  return [
    {
      url: siteOgImage,
      width: 1200,
      height: 630,
      alt,
    },
  ];
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  ogImageAlt?: string;
  keywords?: string[];
};

/** Títulos de documento para rutas privadas (dashboard / platform). */
export function buildAppPageMetadata(title: string): Metadata {
  return {
    title,
    robots: noIndexRobots,
  };
}

export function buildPageMetadata(options: PageMetadataOptions): Metadata {
  const { title, description, path, ogImageAlt = title, keywords } = options;
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const url = canonical === "/" ? siteUrl : absoluteUrl(canonical);

  return {
    title,
    description,
    keywords: keywords ?? siteKeywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: siteOgLocale,
      url,
      siteName,
      title,
      description,
      images: buildOpenGraphImage(ogImageAlt),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteOgImage],
      ...(siteTwitter ? { site: siteTwitter } : {}),
    },
  };
}

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`,
    },
    description: defaultDescription,
    keywords: siteKeywords,
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    robots: siteRobots,
    openGraph: {
      type: "website",
      locale: siteOgLocale,
      url: siteUrl,
      siteName,
      title: {
        default: defaultTitle,
        template: `%s | ${siteName}`,
      },
      description: defaultDescription,
      images: buildOpenGraphImage(`${siteName} — gestión de consultorios`),
    },
    twitter: {
      card: "summary_large_image",
      ...(siteTwitter ? { site: siteTwitter } : {}),
      title: {
        default: defaultTitle,
        template: `%s | ${siteName}`,
      },
      description: defaultDescription,
      images: [siteOgImage],
    },
    alternates: {
      canonical: "/",
    },
    appleWebApp: {
      title: siteName,
    },
    category: "business",
    other: {
      "theme-color": siteThemeColor,
    },
  };
}
