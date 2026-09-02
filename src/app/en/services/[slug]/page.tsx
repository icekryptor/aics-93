import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllServices, getService, enToRuSlug } from "@/lib/en/services";
import { EN_SERVICE_LABELS, enContactDict } from "@/lib/en/content";
import ServiceDetail from "@/components/services/ServiceDetail";
import ContactConsole from "@/components/ContactConsole";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export function generateStaticParams() {
  return getAllServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  const canonical = `/en/services/${s.slug}`;
  const ru = `/services/${enToRuSlug[s.slug]}`;
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: {
      canonical,
      languages: { ru, en: canonical, "x-default": ru },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: SITE_NAME,
      title: s.metaTitle,
      description: s.metaDescription,
    },
    twitter: { card: "summary_large_image", title: s.metaTitle, description: s.metaDescription },
  };
}

export default async function EnServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const url = `${SITE_URL}/en/services/${s.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: s.hero.h1,
      description: s.metaDescription,
      serviceType: s.nav,
      areaServed: "Worldwide",
      inLanguage: "en",
      url,
      provider: { "@id": `${SITE_URL}/#studio` },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        url: `${url}#upgrade`,
        ...(s.pricing
          ? {
              priceSpecification: {
                "@type": "PriceSpecification",
                minPrice: s.pricing.usd,
                priceCurrency: "USD",
              },
            }
          : { priceCurrency: "USD" }),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/en/services` },
        { "@type": "ListItem", position: 3, name: s.nav, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: s.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ServiceDetail service={s} labels={EN_SERVICE_LABELS} />
      <ContactConsole dict={enContactDict(`контакт-консоль (EN ${s.slug})`)} />
    </>
  );
}
