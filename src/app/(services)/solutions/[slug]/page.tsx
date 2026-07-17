import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSolutions, getSolution } from "@/lib/solutions";
import ServiceDetail from "@/components/services/ServiceDetail";
import ContactConsole from "@/components/ContactConsole";
import QuizInline from "@/components/QuizInline";
import SeeAlso from "@/components/services/SeeAlso";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export function generateStaticParams() {
  return getAllSolutions().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return {};
  const canonical = `/solutions/${s.slug}`;
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      title: s.metaTitle,
      description: s.metaDescription,
    },
    twitter: { card: "summary_large_image", title: s.metaTitle, description: s.metaDescription },
  };
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) notFound();

  const url = `${SITE_URL}/solutions/${s.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: s.hero.h1,
      description: s.metaDescription,
      serviceType: s.nav,
      areaServed: "RU",
      inLanguage: "ru-RU",
      url,
      provider: { "@id": `${SITE_URL}/#studio` },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "RUB",
        url: `${url}#upgrade`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Решения", item: `${SITE_URL}/solutions` },
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
      <ServiceDetail service={s} />
      {s.ctaQuiz ? (
        <QuizInline
          source={`квиз лендинга «${s.nav}»`}
          title={s.quiz?.title ?? "Посчитаем экономику перехода"}
          text={
            s.quiz?.text ??
            "Пять коротких вопросов вместо длинной формы — на выходе бриф, по которому я вернусь с расчётом экономики и планом запуска."
          }
          steps={s.quiz?.steps}
        />
      ) : (
        <ContactConsole />
      )}
      {s.seeAlso ? <SeeAlso items={s.seeAlso.items} /> : null}
    </>
  );
}
