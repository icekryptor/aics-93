import type { Metadata } from "next";
import Link from "next/link";
import { getAllSolutions } from "@/lib/solutions";
import JsonLd from "@/components/seo/JsonLd";
import AlgoArt from "@/components/services/AlgoArt";
import GenerativeCover from "@/components/blog/GenerativeCover";
import Image from "next/image";
import CardVideo from "@/components/services/CardVideo";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const ACCENTS = ["#5ab8ff", "#c856ff", "#9747ff", "#c5ff44"];

export const metadata: Metadata = {
  title: "Решения по направлениям — товарный бизнес, сфера услуг",
  description:
    "Готовые связки «сайт + сервисы + ИИ» под модель вашего бизнеса: свой интернет-магазин вместо маркетплейсов для товарки, сайт с доверием и записью для сферы услуг. Выберите направление — рассчитаю запуск.",
  alternates: { canonical: "/solutions" },
  openGraph: {
    type: "website",
    url: "/solutions",
    siteName: SITE_NAME,
    title: "Решения AICS-93 по направлениям",
    description: "Связки «сайт + сервисы + ИИ» под товарный бизнес и сферу услуг.",
  },
  twitter: { card: "summary_large_image", title: "Решения AICS-93 по направлениям" },
};

const CHIP: React.CSSProperties = {
  clipPath:
    "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
};

export default function SolutionsIndex() {
  const all = getAllSolutions();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: all.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.nav,
        url: `${SITE_URL}/solutions/${s.slug}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Решения", item: `${SITE_URL}/solutions` },
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
          <AlgoArt seed="solutions-index" density={1} className="h-full w-full" />
        </div>
        <div className="relative z-10">
          <span
            className="tech-label inline-flex items-center gap-2 text-[0.72rem]"
            style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
          >
            <span className="hud-dot" style={{ display: "inline-block" }} />
            решения · aics-93
          </span>
          <h1 className="mt-6 max-w-3xl text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.03] tracking-tight">
            Решения <span className="signal-text">под модель вашего бизнеса</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-runtime-ink-soft">
            Не абстрактные услуги, а готовые связки «сайт + сервисы + ИИ» под конкретное направление:
            с экономикой, воронкой и планом запуска. Выберите своё — рассчитаю переход.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {all.map((s, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <Link key={s.slug} href={`/solutions/${s.slug}`} className="group block">
                  <article
                    className="relative flex h-full flex-col overflow-hidden transition-colors"
                    style={{
                      ...CHIP,
                      border: "1px solid var(--color-runtime-line)",
                      background:
                        "linear-gradient(180deg, rgba(23,16,41,0.65), rgba(14,10,27,0.35))",
                    }}
                  >
                    {/* обложка — видео лендинга (фолбэк: генеративный арт) */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {s.cover ? (
                        <Image src={s.cover} alt="" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
                      ) : s.card ? (
                        <CardVideo src={s.card.video} poster={s.card.poster} className="absolute inset-0" />
                      ) : (
                        <GenerativeCover
                          seed={`sol-${s.slug}`}
                          accent={accent}
                          density={1.15}
                          className="absolute inset-0"
                        />
                      )}
                      <span
                        className="tech-label absolute left-4 top-4 z-10 rounded-full bg-black/45 px-2.5 py-1 text-[10px]"
                        style={{ color: "#fff" }}
                      >
                        направление {s.order}
                      </span>
                      <span className="absolute bottom-4 right-4 z-10 text-white/80 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <h2 className="text-[1.35rem] font-semibold leading-snug transition-colors group-hover:text-[color-mix(in_srgb,var(--color-signal-cool)_80%,white)]">
                        {s.nav}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-runtime-ink-soft">
                        {s.metaDescription}
                      </p>
                      <span
                        className="tech-label mt-2 inline-flex w-fit items-center gap-1 text-[11px] transition-colors"
                        style={{ color: "var(--color-signal-cool)" }}
                      >
                        читать далее →
                      </span>
                      <div className="mt-auto flex flex-wrap gap-2 pt-5">
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
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
