import Link from "next/link";
import { legal } from "@/lib/content";

/* SeeAlso — блок «смотрите также» в конце лендинга: рекомендации релевантных
   направлений/услуг/статей + баннер подписки на тг-канал AICS-93.
   Серверный компонент, данные — из Service.seeAlso. */

const CHIP: React.CSSProperties = {
  clipPath:
    "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
};

export default function SeeAlso({
  items,
}: {
  items: { tag: string; title: string; href: string }[];
}) {
  return (
    <section className="runtime relative overflow-hidden py-[50px] lg:py-[70px]">
      <div className="signal-seam absolute inset-x-0 top-0" aria-hidden />
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <span
          className="tech-label inline-flex items-center gap-2 text-[0.72rem]"
          style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
        >
          <span className="hud-dot" style={{ display: "inline-block" }} />
          смотрите также
        </span>
        <h2 className="mt-5 max-w-3xl text-[clamp(1.4rem,3vw,2.1rem)] font-semibold leading-tight tracking-tight text-runtime-ink">
          Релевантные направления и материалы
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="group block">
              <article
                className="flex h-full flex-col p-5 transition-colors"
                style={{
                  ...CHIP,
                  border: "1px solid var(--color-runtime-line)",
                  background: "linear-gradient(180deg, rgba(23,16,41,0.6), rgba(14,10,27,0.3))",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="tech-label text-[0.66rem]" style={{ color: "var(--color-signal-2)" }}>
                    {it.tag}
                  </span>
                  <span className="text-runtime-ink-soft transition-transform group-hover:translate-x-1">→</span>
                </div>
                <h3 className="mt-2.5 text-[1rem] font-semibold leading-snug text-runtime-ink transition-colors group-hover:text-[color-mix(in_srgb,var(--color-signal-cool)_80%,white)]">
                  {it.title}
                </h3>
              </article>
            </Link>
          ))}
        </div>

        {/* подписка на тг-канал */}
        <div
          className="signal-glow relative mt-8 flex flex-col items-start gap-5 overflow-hidden p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8"
          style={{
            ...CHIP,
            border: "1px solid rgba(151,71,255,0.35)",
            background:
              "radial-gradient(120% 140% at 88% 0%, rgba(151,71,255,0.16), transparent 60%), rgba(23,16,41,0.6)",
          }}
        >
          <div>
            <p className="tech-label text-[0.68rem]" style={{ color: "var(--color-signal-2)" }}>
              телеграм-канал
            </p>
            <h3 className="mt-2 text-[1.15rem] font-semibold leading-snug text-runtime-ink">
              Канал <span className="font-display">AICS-93</span>
            </h3>
            <p className="mt-1.5 max-w-md text-[0.92rem] leading-relaxed text-runtime-ink-soft">
              Инсайты из IT и ИИ-сфер для развития бизнеса — простым языком.
            </p>
          </div>
          <a
            href={legal.telegramChannel}
            target="_blank"
            rel="noreferrer"
            className="btn-case inline-flex h-12 shrink-0 items-center px-7 text-sm font-semibold"
          >
            Подписаться →
          </a>
        </div>
      </div>
    </section>
  );
}
