import type { Metadata } from "next";
import { appUrl } from "@/env";

const SITE_NAME = "SELV";
const DEFAULT_DESCRIPTION =
  "Confidence is not a feeling. It's an architecture. Evidence-based tools and daily practice for rewriting your inner dialogue.";

/** Central metadata builder — every page routes through this for consistency. */
export function buildMetadata(input: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const title = input.title ? `${input.title} — ${SITE_NAME}` : `${SITE_NAME} — You are the author now.`;
  const description = input.description ?? DEFAULT_DESCRIPTION;
  const url = `${appUrl}${input.path ?? ""}`;
  const image = input.image ?? `${appUrl}/og/default.png`;

  return {
    title,
    description,
    metadataBase: new URL(appUrl),
    alternates: { canonical: url },
    robots: input.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: input.type ?? "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

// --- JSON-LD builders (rendered by <JsonLd/> in src/components/json-ld.tsx) --

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: appUrl,
    logo: `${appUrl}/icon.png`,
    sameAs: [] as string[],
  };
}

export function articleJsonLd(a: {
  title: string;
  description: string;
  slug: string;
  authorName: string;
  publishedAt: Date;
  updatedAt: Date;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    author: { "@type": "Person", name: a.authorName },
    publisher: organizationJsonLd(),
    datePublished: a.publishedAt.toISOString(),
    dateModified: a.updatedAt.toISOString(),
    mainEntityOfPage: `${appUrl}/blog/${a.slug}`,
    image: a.image,
  };
}

export function courseJsonLd(c: { title: string; summary: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.title,
    description: c.summary,
    provider: organizationJsonLd(),
    url: `${appUrl}/courses/${c.slug}`,
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}
