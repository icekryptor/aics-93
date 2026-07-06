import type { Metadata } from "next";
import Link from "next/link";
import { getAllServices } from "@/lib/services";
import JsonLd from "@/components/seo/JsonLd";
import AlgoArt from "@/components/services/AlgoArt";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Услуги — разработка сайтов, брендинг, ИИ в процессах | AICS-93",
  description:
    "Услуги студии AICS-93: разработка сайтов за 7-14 дней с ИИ, ребрендинг, брендбук и внедрение нейроагентов в процессы. Данные, а не догадки.",
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    url: "/services",
    siteName: SITE_NAME,
    title: "Услуги AICS-93",
    description: "Разработка сайтов с ИИ, брендинг и внедрение ИИ в процессы компаний.",
  },
  twitter: { card: "summary_large_image", title: "Услуги AICS-93" },
};

const CHIP: React.CSSProperties = {
  clipPath:
    "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
};

export default function ServicesIndex() {
  const all = getAllServices();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: all.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.nav,
        url: `${SITE_URL}/services/${s.slug}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Услуги", item: `${SITE_URL}/services` },
      ],
    },
  ];

  return (
    <div className="text-runtime-ink">
      <JsonLd data={jsonLd} />
      <div className="relative mx-auto w-full max-w-6xl overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            maskImage: "radial-gradient(58% 68% at 85% 14%, #000 4%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(58% 68% at 85% 14%, #000 4%, transparent 70%)",
          }}
        >
          <AlgoArt seed="services-index" density={1} className="h-full w-full" />
        </div>
        <div className="relative z-10">
        <span
          className="tech-label inline-flex items-center gap-2 text-[0.72rem]"
          style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
        >
          <span className="hud-dot" style={{ display: "inline-block" }} />
          услуги · aics-93
        </span>
        <h1 className="mt-6 max-w-3xl font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.03] tracking-tight">
          Что я делаю для <span className="signal-text">роста бизнеса</span>
        </h1>
        <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-runtime-ink-soft">
          Технология вместо раздутого штата: сайт, бренд и процессы, собранные на данных и усиленные
          ИИ. Выберите направление — рассчитаю проект под вашу задачу.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {all.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="group block">
              <article
                className="relative flex h-full flex-col p-7 transition-colors sm:p-8"
                style={{
                  ...CHIP,
                  border: "1px solid var(--color-runtime-line)",
                  background:
                    "linear-gradient(180deg, rgba(23,16,41,0.65), rgba(14,10,27,0.35))",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="tech-label text-[0.72rem]" style={{ color: "var(--color-signal-2)" }}>
                    услуга {s.order}
                  </span>
                  <span className="text-runtime-ink-soft transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
                <h2 className="mt-4 font-display text-[1.35rem] font-semibold leading-snug transition-colors group-hover:text-[color-mix(in_srgb,var(--color-signal-cool)_80%,white)]">
                  {s.nav}
                </h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-runtime-ink-soft">
                  {s.metaDescription}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {s.hero.stats.slice(0, 3).map((st) => (
                    <span
                      key={st.label}
                      className="tech-label rounded-full px-3 py-1.5 text-[0.66rem]"
                      style={{
                        border: "1px solid var(--color-runtime-line)",
                        color: "var(--color-runtime-ink-soft)",
                      }}
                    >
                      {st.value} · {st.label}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
