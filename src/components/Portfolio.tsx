import Image from "next/image";
import Reveal from "./Reveal";
import { featured, cases, moreProjects } from "@/lib/content";

export default function Portfolio() {
  return (
    <section id="prtf" className="relative scroll-mt-24 py-16 lg:py-24">
      {/* vertical "НАШЕ ПОРТФОЛИО" label */}
      <span
        className="pointer-events-none absolute left-2 top-24 hidden text-sm tracking-[0.25em] text-ink/70 lg:block"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        НАШЕ ПОРТФОЛИО
      </span>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:pl-16">
        {/* Featured: Химичка — gradient card */}
        <Reveal>
          <article
            className="grid overflow-hidden rounded-[28px] lg:grid-cols-2"
            style={{
              background:
                "linear-gradient(118deg, #7c3aed 0%, #a855f7 32%, #e879a6 66%, #fb9a5a 100%)",
            }}
          >
            <div className="flex flex-col justify-center p-8 text-white lg:p-12">
              <span className="text-sm text-white/70">моя главная гордость:</span>
              <h3 className="mt-2 font-display text-4xl font-normal tracking-tight lg:text-5xl">
                {featured.name}
              </h3>
              <ul className="mt-6 space-y-2">
                {featured.services.map((s) => (
                  <li key={s} className="flex gap-2.5 text-[15px] text-white/90">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-white/80" />
                    {s}
                  </li>
                ))}
              </ul>
              <a
                href={featured.link}
                className="mt-8 inline-flex w-fit items-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
              >
                Подробный кейс
              </a>
            </div>
            <div className="relative min-h-[280px] lg:min-h-[420px]">
              <Image
                src={featured.image}
                alt={featured.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6"
                priority
              />
            </div>
          </article>
        </Reveal>

        {/* Cases: full-width stacked blocks */}
        <div className="mt-16 space-y-16">
          {cases.map((c) => (
            <Reveal key={c.name}>
              <article>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-xl">
                    <h3 className="font-display text-3xl font-normal tracking-tight lg:text-4xl">
                      {c.name}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{c.subtitle}</p>
                  </div>
                  <div className="md:text-right">
                    {c.tags && (
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        {c.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-ink px-3 py-1 text-[11px] text-bg"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    {c.link && (
                      <a
                        href={c.link}
                        target={c.link.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="mt-3 inline-block text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
                      >
                        {c.link.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>
                </div>

                <div className="relative mt-6 aspect-[16/8] overflow-hidden rounded-[24px] bg-bg-soft">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1100px"
                    className="object-cover"
                  />
                </div>

                {c.services.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-1.5 text-[13px] text-ink-soft">
                    {c.services.map((s) => (
                      <li key={s} className="before:mr-1.5 before:text-accent before:content-['•']">
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        {/* More projects */}
        <Reveal className="mt-20">
          <h3 className="font-display text-2xl font-normal uppercase tracking-tight">
            Больше проектов
          </h3>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {moreProjects.map((p, i) => (
            <Reveal key={p.name} delay={(i % 4) * 60}>
              <a href={p.link} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg-soft">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <p className="mt-3 text-xs text-ink-soft">{p.subtitle}</p>
                <p className="mt-0.5 font-display text-sm font-normal leading-tight">{p.name}</p>
                <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-accent">
                  Смотреть сайт <span aria-hidden>→</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
