"use client";

import { siteConfig } from "~/config/site";

export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: "ChatApplication",
    operatingSystem: "Any",
    author: {
      "@type": "Organization",
      name: siteConfig.creator.name,
      url: siteConfig.creator.url,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    keywords: siteConfig.keywords.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
