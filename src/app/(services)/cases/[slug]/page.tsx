import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCases, getCase } from "@/lib/cases";
import CaseLongread from "@/components/cases/CaseLongread";
import ContactConsole from "@/components/ContactConsole";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, SITE_NAME, AUTHOR } from "@/lib/site";

export function generateStaticParams() {
  return getAllCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  const canonical = `/cases/${c.slug}`;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: SITE_NAME,
      title: c.metaTitle,
      description: c.metaDescription,
    },
    twitter: { card: "summary_large_image", title: c.metaTitle, description: c.metaDescription },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();

  const url = `${SITE_URL}/cases/${c.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#case`,
      headline: c.metaTitle,
      description: c.metaDescription,
      inLanguage: "ru-RU",
      url,
      author: { "@type": "Person", name: AUTHOR.name, url: SITE_URL },
      publisher: { "@id": `${SITE_URL}/#studio` },
      about: c.title,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Кейсы", item: `${SITE_URL}/#prtf` },
        { "@type": "ListItem", position: 3, name: c.title, item: url },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <CaseLongread c={c} />
      <ContactConsole />
    </>
  );
}
