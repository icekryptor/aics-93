import Image from "next/image";
import Reveal from "./Reveal";
import { featured, cases, moreProjects, type Project } from "@/lib/content";

function Tags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <span
          key={t}
          className="tech-label rounded-full border border-line px-2.5 py-0.5 text-[11px] text-ink-soft"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function CaseCard({ p }: { p: Project }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg transition-shadow hover:shadow-[0_24px_60px_-30px_rgba(22,18,29,0.4)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-soft">
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Tags tags={p.tags} />
        <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">{p.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.subtitle}</p>
        {p.services.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-soft">
            {p.services.map((s) => (
              <li key={s} className="before:mr-1.5 before:text-accent before:content-['•']">
                {s}
              </li>
            ))}
          </ul>
        )}
        {p.link && (
          <a
            href={p.link}
            target={p.link.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent transition-transform hover:gap-2.5"
          >
            Смотреть кейс <span aria-hidden>→</span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function Portfolio() {
  return (
    <section id="prtf" className="scroll-mt-24 bg-bg-soft/50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <span className="tech-label inline-flex items-center gap-2 text-xs text-ink-soft">
            <span className="size-1.5 rounded-full bg-accent" />
            наше портфолио
          </span>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight">
            Портфолио
          </h2>
        </Reveal>

        {/* Featured: Химичка */}
        <Reveal className="mt-10">
          <article className="grid overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden bg-bg-soft lg:aspect-auto">
              <Image
                src={featured.image}
                alt={featured.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <span className="tech-label text-xs text-accent">главная гордость</span>
              <h3 className="mt-3 font-display text-3xl font-bold tracking-tight lg:text-4xl">
                {featured.name}
              </h3>
              <p className="mt-3 text-ink-soft">{featured.subtitle}</p>
              <ul className="mt-6 space-y-2.5">
                {featured.services.map((s) => (
                  <li key={s} className="flex gap-3 text-sm">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gradient-accent" />
                    {s}
                  </li>
                ))}
              </ul>
              <a
                href={featured.link}
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.03]"
              >
                Подробный кейс <span aria-hidden>→</span>
              </a>
            </div>
          </article>
        </Reveal>

        {/* Case grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 80}>
              <CaseCard p={p} />
            </Reveal>
          ))}
        </div>

        {/* More projects */}
        <Reveal className="mt-16">
          <h3 className="font-display text-xl font-semibold tracking-tight">Больше проектов</h3>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {moreProjects.map((p, i) => (
            <Reveal key={p.name} delay={(i % 4) * 60}>
              <a
                href={p.link}
                className="group block overflow-hidden rounded-2xl border border-line bg-bg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-bg-soft">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-ink-soft">{p.subtitle}</p>
                  <p className="mt-1 font-display text-sm font-semibold leading-tight">{p.name}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent">
                    Смотреть сайт <span aria-hidden>→</span>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
