import type { Metadata } from "next";
import Link from "next/link";
import { getAllServices } from "@/lib/en/services";
import { enHome, enContactDict } from "@/lib/en/content";
import ContactConsole from "@/components/ContactConsole";
import AlgoArt from "@/components/services/AlgoArt";
import GenerativeCover from "@/components/blog/GenerativeCover";
import CardVideo from "@/components/services/CardVideo";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const ACCENTS = ["#9747ff", "#c856ff", "#5ab8ff", "#c5ff44"];

const CHIP: React.CSSProperties = {
  clipPath:
    "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
};

export const metadata: Metadata = {
  title: { absolute: enHome.metaTitle },
  description: enHome.metaDescription,
  alternates: {
    canonical: "/en",
    languages: { ru: "/", en: "/en", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/en",
    siteName: SITE_NAME,
    title: enHome.metaTitle,
    description: enHome.metaDescription,
  },
  twitter: { card: "summary_large_image", title: enHome.metaTitle, description: enHome.metaDescription },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="tech-label inline-flex items-center gap-2 text-[0.72rem]"
      style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
    >
      <span className="hud-dot" style={{ display: "inline-block" }} />
      {children}
    </span>
  );
}

export default function EnHome() {
  const services = getAllServices();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/en#studio`,
      name: "AICS-93",
      url: `${SITE_URL}/en`,
      inLanguage: "en",
      description: enHome.metaDescription,
      founder: { "@type": "Person", name: "Vasily Aistov" },
      areaServed: "Worldwide",
    },
  ];

  return (
    <div className="text-runtime-ink">
      <JsonLd data={jsonLd} />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            maskImage: "radial-gradient(58% 68% at 85% 14%, #000 4%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(58% 68% at 85% 14%, #000 4%, transparent 70%)",
          }}
        >
          <AlgoArt seed="en-home" density={1} className="h-full w-full" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
          <Eyebrow>{enHome.eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-3xl text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.03] tracking-tight">
            {enHome.h1Pre}
            <span className="signal-text">{enHome.h1Accent}</span>
            {enHome.h1Post}
          </h1>
          <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-runtime-ink-soft sm:text-lg">
            {enHome.subhead}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#upgrade"
              data-magnetic
              data-cursor="route signal"
              className="btn-case inline-flex h-12 items-center px-7 text-sm font-semibold"
            >
              Discuss a project <span aria-hidden className="ml-2">→</span>
            </a>
            <Link
              href="/en/services"
              data-magnetic
              className="inline-flex h-12 items-center rounded-full border border-runtime-line px-7 text-sm text-runtime-ink transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_60%,transparent)]"
            >
              Explore services
            </Link>
          </div>

          {/* stat strip */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-4">
            {enHome.stats.map((st) => (
              <div
                key={st.label}
                className="relative p-5"
                style={{
                  ...CHIP,
                  border: "1px solid var(--color-runtime-line)",
                  background: "rgba(23,16,41,0.5)",
                }}
              >
                <div
                  className="signal-text font-display text-[clamp(1.4rem,3vw,2.1rem)] font-semibold leading-none"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {st.value}
                </div>
                <div className="mt-2 text-[0.8rem] leading-snug text-runtime-ink-soft">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ENGINE ================= */}
      <section className="relative py-16 sm:py-20">
        <div className="signal-seam absolute inset-x-0 top-0" aria-hidden />
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <Eyebrow>{enHome.engine.eyebrow}</Eyebrow>
          <h2 className="mt-5 max-w-3xl text-[clamp(1.5rem,3.4vw,2.4rem)] font-semibold leading-tight tracking-tight">
            {enHome.engine.title}
          </h2>
          <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-runtime-ink-soft">
            {enHome.engine.text}
          </p>
          <ul className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {enHome.engine.points.map((p, i) => (
              <li key={i} className="flex items-start gap-3.5">
                <span
                  aria-hidden
                  className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-[0.62rem] font-semibold"
                  style={{
                    border: "1px solid color-mix(in srgb, var(--color-signal) 45%, transparent)",
                    background: "rgba(151,71,255,0.12)",
                    color: "var(--color-signal-cool)",
                    fontFamily: "var(--font-display, inherit)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.95rem] leading-relaxed text-runtime-ink-soft">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="relative py-16 sm:py-20">
        <div className="signal-seam absolute inset-x-0 top-0" aria-hidden />
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <Eyebrow>{enHome.servicesEyebrow}</Eyebrow>
          <h2 className="mt-5 max-w-3xl text-[clamp(1.5rem,3.4vw,2.4rem)] font-semibold leading-tight tracking-tight">
            {enHome.servicesTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-runtime-ink-soft">
            {enHome.servicesText}
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {services.map((s, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <Link key={s.slug} href={`/en/services/${s.slug}`} className="group block">
                  <article
                    className="relative flex h-full flex-col overflow-hidden transition-colors"
                    style={{
                      ...CHIP,
                      border: "1px solid var(--color-runtime-line)",
                      background: "linear-gradient(180deg, rgba(23,16,41,0.65), rgba(14,10,27,0.35))",
                    }}
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {s.card ? (
                        <CardVideo src={s.card.video} poster={s.card.poster} className="absolute inset-0" />
                      ) : (
                        <GenerativeCover
                          seed={`svc-en-${s.slug}`}
                          accent={accent}
                          density={1.15}
                          className="absolute inset-0"
                        />
                      )}
                      <span
                        className="tech-label absolute left-4 top-4 z-10 rounded-full bg-black/45 px-2.5 py-1 text-[10px]"
                        style={{ color: "#fff" }}
                      >
                        {enHome.serviceCardTag} {s.order}
                      </span>
                      <span className="absolute bottom-4 right-4 z-10 text-white/80 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <h3 className="text-[1.35rem] font-semibold leading-snug transition-colors group-hover:text-[color-mix(in_srgb,var(--color-signal-cool)_80%,white)]">
                        {s.nav}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-runtime-ink-soft">
                        {s.metaDescription}
                      </p>
                      <span
                        className="tech-label mt-2 inline-flex w-fit items-center gap-1 text-[11px] transition-colors"
                        style={{ color: "var(--color-signal-cool)" }}
                      >
                        {enHome.serviceCardMore}
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section className="relative py-16 sm:py-20">
        <div className="signal-seam absolute inset-x-0 top-0" aria-hidden />
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <Eyebrow>{enHome.pricing.eyebrow}</Eyebrow>
          <h2 className="mt-5 max-w-3xl text-[clamp(1.5rem,3.4vw,2.4rem)] font-semibold leading-tight tracking-tight">
            {enHome.pricing.title}
          </h2>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {enHome.pricing.packages.map((p) => (
              <article
                key={p.tag}
                className="relative flex h-full flex-col p-6 sm:p-7"
                style={{
                  ...CHIP,
                  border: "1px solid var(--color-runtime-line)",
                  background: "linear-gradient(180deg, rgba(23,16,41,0.6), rgba(14,10,27,0.3))",
                }}
              >
                <span className="tech-label text-[0.66rem]" style={{ color: "var(--color-signal-2)" }}>
                  {p.tag}
                </span>
                <h3 className="mt-3 text-[1.2rem] font-semibold leading-snug">{p.title}</h3>
                <p className="mt-3 flex items-baseline gap-3">
                  <span className="signal-text font-display text-[1.5rem] font-semibold">{p.price}</span>
                  <span className="tech-label text-[0.66rem] text-runtime-ink-soft">{p.term}</span>
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-[0.9rem] leading-relaxed text-runtime-ink-soft">
                      <span
                        aria-hidden
                        className="mt-[0.55em] inline-block h-[6px] w-[6px] shrink-0 rounded-full"
                        style={{
                          background: "linear-gradient(92deg, var(--color-signal), var(--color-signal-2))",
                        }}
                      />
                      {it}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className="tech-label mt-5 inline-flex w-fit items-center gap-1 text-[11px]"
                  style={{ color: "var(--color-signal-cool)" }}
                >
                  details →
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-6 text-[0.85rem] text-runtime-ink-soft">{enHome.pricing.note}</p>
        </div>
      </section>

      {/* ================= OPERATOR ================= */}
      <section className="relative py-16 sm:py-20">
        <div className="signal-seam absolute inset-x-0 top-0" aria-hidden />
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div
            className="relative overflow-hidden p-8 sm:p-10"
            style={{
              ...CHIP,
              border: "1px solid var(--color-runtime-line)",
              background:
                "radial-gradient(120% 140% at 12% 0%, rgba(151,71,255,0.14), transparent 55%), rgba(23,16,41,0.55)",
            }}
          >
            <Eyebrow>{enHome.operator.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-2xl text-[clamp(1.4rem,3vw,2.1rem)] font-semibold leading-tight tracking-tight">
              {enHome.operator.title}
            </h2>
            <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-runtime-ink-soft">
              {enHome.operator.text}
            </p>
            <Link
              href="/en/operator"
              data-magnetic
              className="mt-6 inline-flex h-11 items-center rounded-full border border-runtime-line px-6 text-sm text-runtime-ink transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_60%,transparent)]"
            >
              {enHome.operator.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <ContactConsole dict={enContactDict("контакт-консоль (EN главная)")} />
    </div>
  );
}
