import type { Metadata } from "next";
import Image from "next/image";
import { enOperator, enContactDict } from "@/lib/en/content";
import { aboutPhoto, aboutLogos, legal } from "@/lib/content";
import ContactConsole from "@/components/ContactConsole";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, SITE_NAME, AUTHOR } from "@/lib/site";

/* /en/operator — the person behind the studio, English edition. Reuses the
   published RU facts/stats/bio (translated in lib/en/content.ts) and the same
   photo/logos assets; layout follows the runtime chrome of the /en section. */

export const metadata: Metadata = {
  title: enOperator.metaTitle,
  description: enOperator.metaDescription,
  alternates: {
    canonical: "/en/operator",
    languages: { ru: "/operator", en: "/en/operator", "x-default": "/operator" },
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: "/en/operator",
    siteName: SITE_NAME,
    title: enOperator.metaTitle,
    description: enOperator.metaDescription,
  },
  twitter: { card: "summary_large_image", title: enOperator.metaTitle },
};

const CHIP: React.CSSProperties = {
  clipPath:
    "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
};

export default function EnOperatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/en/operator`,
      name: "The Operator — AICS-93",
      inLanguage: "en",
      about: {
        "@type": "Person",
        name: "Vasily Aistov",
        jobTitle: "Designer, brand strategist, engineer",
        email: `mailto:${legal.email}`,
        worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        sameAs: [legal.telegramChannel, legal.telegram],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
        { "@type": "ListItem", position: 2, name: "Operator", item: `${SITE_URL}/en/operator` },
      ],
    },
  ];

  return (
    <div className="text-runtime-ink">
      <JsonLd data={jsonLd} />

      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <p
          className="tech-label text-[0.72rem]"
          style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
        >
          {enOperator.eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-tight">
          {enOperator.title}
        </h1>
        <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-runtime-ink-soft">
          {enOperator.subhead}
        </p>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* photo */}
          <div
            className="relative aspect-[4/5] w-full max-w-[480px] overflow-hidden"
            style={{ ...CHIP, border: "1px solid var(--color-runtime-line)" }}
          >
            <Image
              src={aboutPhoto}
              alt={`${AUTHOR.name} — AICS-93 operator`}
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover"
            />
          </div>

          {/* facts + stats */}
          <div>
            <ul className="space-y-4">
              {enOperator.facts.map((f, i) => (
                <li key={i} className="flex items-start gap-3.5">
                  <span
                    aria-hidden
                    className="mt-1 grid size-6 shrink-0 place-items-center rounded-full text-[0.62rem] font-semibold"
                    style={{
                      border: "1px solid color-mix(in srgb, var(--color-signal) 45%, transparent)",
                      background: "rgba(151,71,255,0.12)",
                      color: "var(--color-signal-cool)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[1rem] leading-relaxed text-runtime-ink-soft">
                    {f.lead ? <span className="font-semibold text-runtime-ink">{f.lead}</span> : null}
                    {f.rest}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {enOperator.stats.map((st) => (
                <div
                  key={st.label}
                  className="p-4"
                  style={{
                    ...CHIP,
                    border: "1px solid var(--color-runtime-line)",
                    background: "rgba(23,16,41,0.5)",
                  }}
                >
                  <div className="signal-text font-display text-[clamp(1.2rem,2.6vw,1.8rem)] font-semibold leading-none">
                    {st.value}
                  </div>
                  <div className="mt-2 text-[0.78rem] leading-snug text-runtime-ink-soft">{st.label}</div>
                  {st.sub ? (
                    <div className="mt-1 text-[0.68rem] text-runtime-ink-soft/60">{st.sub}</div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              {enOperator.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="max-w-xl text-[0.95rem] leading-relaxed text-runtime-ink-soft">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* logos */}
        <div className="mt-14">
          <p className="tech-label text-[0.68rem] text-runtime-ink-soft">{enOperator.logosNote}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-6 opacity-80">
            {aboutLogos.map((l) => (
              <Image
                key={l.alt}
                src={l.src}
                alt={l.alt}
                width={104}
                height={36}
                className="h-8 w-auto object-contain grayscale"
              />
            ))}
          </div>
        </div>
      </div>

      <ContactConsole dict={enContactDict("контакт-консоль (EN operator)")} />
    </div>
  );
}
