import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Журнал AICS-93 — бренд, ИИ в процессах, дизайн на данных",
  description:
    "Заметки Василия Аистова о брендинге, внедрении ИИ в процессы компаний и дизайне, который отстраивает.",
  alternates: { canonical: "/blog" },
};

const CUT: React.CSSProperties = {
  clipPath:
    "polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)",
};

export default function BlogIndex() {
  const all = getAllPosts();
  const [lead, ...rest] = all;

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:py-16">
      {/* header */}
      <div className="flex items-end justify-between border-b border-line pb-6">
        <div>
          <p className="tech-label text-[11px] text-ink-soft">[ журнал · заметки ]</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.6rem)] font-normal leading-[1.02] tracking-tight text-ink">
            Журнал <span className="signal-text">AICS-93</span>
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
                  <h2 className="font-display text-[clamp(1.5rem,2.6vw,2.4rem)] font-normal leading-[1.05] tracking-tight text-ink transition-colors group-hover:text-accent-ink">
                    {lead.title}
                  </h2>
                  <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-soft">{lead.excerpt}</p>
                  <p className="tech-label mt-6 text-[11px] text-ink-soft">
                    {formatDate(lead.date)} · {lead.readingMin} мин · читать →
                  </p>
                </div>
              </div>
              <div
                className="relative min-h-[220px] overflow-hidden lg:min-h-full"
                style={{
                  background: `radial-gradient(120% 120% at 80% 10%, ${lead.accent}, color-mix(in srgb, ${lead.accent} 20%, #302055) 55%, #171029 100%)`,
                }}
              >
                <span className="absolute inset-0" style={{ background: "var(--color-runtime)", opacity: 0 }} />
                <span className="tech-label absolute bottom-4 right-4 text-[10px] text-white/70">aics · journal</span>
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
              <div
                className="relative h-36"
                style={{
                  background: `radial-gradient(120% 120% at 75% 15%, ${p.accent}, color-mix(in srgb, ${p.accent} 22%, #302055) 60%, #171029 100%)`,
                }}
              >
                <span
                  className="tech-label absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px]"
                  style={{ color: p.accent }}
                >
                  {p.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-[1.05rem] font-normal leading-snug tracking-tight text-ink transition-colors group-hover:text-accent-ink">
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
