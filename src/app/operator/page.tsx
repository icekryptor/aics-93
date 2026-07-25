import type { Metadata } from "next";
import Nav from "@/components/Nav";
import AboutMe from "@/components/AboutMe";
import { Bio } from "@/components/Sections";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, SITE_NAME, AUTHOR } from "@/lib/site";
import { legal } from "@/lib/content";

/* /operator — «Оператор»: страница о человеке за студией (SITE-STRATEGY.md §2).
   Личный бренд вместо обезличенного «мы» — фото, факты, история, публичность.
   Контент не выдуман: переиспользует уже опубликованные aboutFacts/bio из
   AboutMe (иммерсивная версия) и Bio (классическая версия), сведённые в одну
   страницу для тех, кто ищет её напрямую или переходит по ссылке из /ai. */

export const metadata: Metadata = {
  title: "Оператор — Василий Аистов, AICS-93",
  description:
    "Один инженер-оператор ведёт каждый проект AICS-93 от брифа до продакшена: 10 лет в дизайне и маркетинге, 250+ проектов, ИИ-конвейер вместо команды агентства.",
  alternates: { canonical: "/operator" },
  openGraph: {
    type: "profile",
    url: "/operator",
    siteName: SITE_NAME,
    title: "Оператор AICS-93 — Василий Аистов",
    description: "Кто ведёт проект: инженер, дизайнер и бренд-стратег за конвейером AICS-93.",
  },
  twitter: { card: "summary_large_image", title: "Оператор AICS-93" },
};

export default function OperatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/operator`,
      name: "Оператор AICS-93",
      about: {
        "@type": "Person",
        name: AUTHOR.name,
        jobTitle: AUTHOR.jobTitle,
        email: `mailto:${legal.email}`,
        worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        sameAs: [legal.telegramChannel, legal.telegram],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Оператор", item: `${SITE_URL}/operator` },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav />
      <main>
        <div className="mx-auto max-w-7xl px-4 pb-4 pt-28 sm:px-6 lg:pt-36">
          <p
            className="tech-label text-[0.72rem]"
            style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
          >
            {"// оператор"}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2rem,5vw,3.2rem)] font-normal leading-[1.05] tracking-tight">
            Один человек ведёт проект — не обезличенная команда
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            За каждым сайтом и брендом AICS-93 стоит один инженер-оператор, а не ротация
            менеджеров. Ответ на заявку, разбор задачи и вилка цены — в течение 24 часов.
          </p>
        </div>
        <AboutMe />
        <Bio />
        <QuoteForm />
      </main>
      <Footer />
    </>
  );
}
