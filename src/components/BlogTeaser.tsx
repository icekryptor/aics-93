import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";
import GenerativeCover from "@/components/blog/GenerativeCover";

// Compact journal teaser on the main page — makes the blog discoverable.
export default function BlogTeaser() {
  const latest = getAllPosts().slice(0, 3);

  return (
    <section id="blog" className="relative scroll-mt-24 py-[40px] lg:py-[64px]">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-16">
        <div className="flex items-end justify-between border-b border-line pb-5">
          <div>
            <p className="tech-label text-[11px] text-ink-soft">[ журнал · заметки ]</p>
            <h2 className="mt-3 text-[clamp(1.55rem,3.4vw,2.9rem)] font-normal leading-tight tracking-[-0.015em] text-ink">
              Пишу о брендинге и <span className="signal-text">ИИ в процессах</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="tech-label hidden shrink-0 items-center gap-1.5 text-[12px] text-ink-soft transition-colors hover:text-ink sm:inline-flex"
          >
            все заметки →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {latest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_45%,transparent)]">
                <div className="relative h-28 overflow-hidden">
                  <GenerativeCover seed={p.slug} accent={p.accent} className="absolute inset-0" />
                  <span
                    className="tech-label absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[9px]"
                    style={{ color: p.accent }}
                  >
                    {p.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-[1rem] font-normal leading-snug tracking-tight text-ink transition-colors group-hover:text-accent-ink">
                    {p.title}
                  </h3>
                  <p className="tech-label mt-auto pt-4 text-[10px] text-ink-soft">
                    {formatDate(p.date)} · {p.readingMin} мин
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <Link
          href="/blog"
          className="tech-label mt-6 inline-flex items-center gap-1.5 text-[12px] text-ink-soft transition-colors hover:text-ink sm:hidden"
        >
          все заметки →
        </Link>
      </div>
    </section>
  );
}
