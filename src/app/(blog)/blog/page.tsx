import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";
import BlogCover from "@/components/blog/BlogCover";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Журнал — бренд, ИИ в процессах, дизайн на данных",
  description:
    "Заметки Василия Аистова о брендинге, внедрении ИИ в процессы компаний и дизайне, который отстраивает.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  openGraph: {
    type: "website",
    url: "/blog",
    siteName: SITE_NAME,
    title: "Журнал AICS-93",
    description:
      "Заметки о брендинге, внедрении ИИ в процессы компаний и дизайне, который отстраивает.",
  },
  twitter: { card: "summary_large_image", title: "Журнал AICS-93" },
};

const CUT: React.CSSProperties = {
  clipPath:
    "polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)",
};

export default function BlogIndex() {
  const all = getAllPosts();
  const [lead, ...rest] = all;

  const blogJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": `${SITE_URL}/blog#blog`,
      name: "Журнал AICS-93",
      description:
        "Заметки Василия Аистова о брендинге, внедрении ИИ в процессы компаний и дизайне.",
      url: `${SITE_URL}/blog`,
      inLanguage: "ru-RU",
      publisher: { "@id": `${SITE_URL}/#person` },
      blogPost: all.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        description: p.excerpt,
        url: `${SITE_URL}/blog/${p.slug}`,
        datePublished: new Date(p.date).toISOString(),
        author: { "@id": `${SITE_URL}/#person` },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Журнал", item: `${SITE_URL}/blog` },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:py-16">
      <JsonLd data={blogJsonLd} />
      {/* header */}
      <div className="flex items-end justify-between border-b border-line pb-6">
        <div>
          <p className="tech-label text-[11px] text-ink-soft">[ журнал · заметки ]</p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.6rem)] font-normal leading-[1.02] tracking-tight text-ink">
            Журнал <span className="signal-text font-display">AICS-93</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
            О брендинге, внедрении ИИ в процессы компаний и дизайне, который растёт на данных, а не на догадках.
          </p>
        </div>
        <p className="hidden shrink-0 font-display text-[2rem] leading-none text-ink-soft tabular-nums sm:block">
          {String(all.length).padStart(2, "0")}
        </p>
      </div>

      {/* lead post */}
      {lead && (
        <Link href={`/blog/${lead.slug}`} className="group mt-10 block">
          <article className="relative bg-ink/15 p-px" style={CUT}>
            <div className="relative grid gap-0 overflow-hidden bg-bg lg:grid-cols-[1.1fr_1fr]" style={CUT}>
              <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-11">
                <div className="flex items-center gap-3">
                  <span
                    className="tech-label rounded-full px-3 py-1 text-[10px] text-white"
                    style={{ background: lead.accent }}
                  >
                    {lead.tag}
                  </span>
                  <span className="tech-label text-[10px] text-ink-soft">свежее</span>
                </div>
                <div className="mt-8">
                  <h2 className="text-[clamp(1.5rem,2.6vw,2.4rem)] font-normal leading-[1.05] tracking-tight text-ink transition-colors group-hover:text-accent-ink">
                    {lead.title}
                  </h2>
                  <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-soft">{lead.excerpt}</p>
                  <p className="tech-label mt-6 text-[11px] text-ink-soft">
                    {formatDate(lead.date)} · {lead.readingMin} мин · читать →
                  </p>
                </div>
              </div>
              <div className="relative min-h-[220px] overflow-hidden lg:min-h-full">
                <BlogCover seed={lead.slug} accent={lead.accent} cover={lead.cover} className="absolute inset-0" sizes="(min-width: 1024px) 560px, 100vw" />
                <span className="tech-label absolute bottom-4 right-4 z-10 text-[10px] text-white/70">
                  aics · journal
                </span>
              </div>
            </div>
          </article>
        </Link>
      )}

      {/* grid */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_45%,transparent)]">
              <div className="relative h-36 overflow-hidden">
                <BlogCover seed={p.slug} accent={p.accent} cover={p.cover} className="absolute inset-0" sizes="(min-width: 1024px) 370px, 100vw" />
                <span
                  className="tech-label absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[9px]"
                  style={{ color: p.accent }}
                >
                  {p.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[1.05rem] font-normal leading-snug tracking-tight text-ink transition-colors group-hover:text-accent-ink">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-ink-soft">{p.excerpt}</p>
                <p className="tech-label mt-auto pt-4 text-[10px] text-ink-soft">
                  {formatDate(p.date)} · {p.readingMin} мин
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
