import Image from "next/image";
import HeroCube from "./HeroCube";
import { assets, competencies, heroStats } from "@/lib/content";

function SkewBar({ cells = 22 }: { cells?: number }) {
  return (
    <span className="skew-track" aria-hidden>
      {Array.from({ length: cells }).map((_, i) => (
        <span
          key={i}
          className="skew-cell"
          style={{ "--d": `${(i * 0.1).toFixed(2)}s` } as React.CSSProperties}
        />
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative pt-16 pb-16 sm:pt-20 lg:pb-28">
      <div className="relative mx-auto grid max-w-[1640px] items-start gap-12 px-6 sm:px-10 lg:grid-cols-[1fr_1.2fr_0.8fr] lg:gap-16 lg:px-16">
        {/* Left: headline */}
        <div>
          <div className="mb-9 flex items-center gap-4">
            <Image src={assets.gear} alt="" width={64} height={64} className="size-14 shrink-0" />
            <div>
              <Image src={assets.wordmark} alt="AICS-93" width={150} height={36} className="h-[28px] w-auto" />
              <p className="mt-1.5 text-[10px] leading-tight tracking-tight text-ink-soft">
                autonomous intelligent<br />cyberhuman system #93
              </p>
            </div>
          </div>

          <h1 className="text-[clamp(2.2rem,3.6vw,3.4rem)] font-medium leading-[1.04] tracking-[-0.015em] text-ink">
            Дизайн и<br />
            решения,<br />
            вдохновленные<br />
            системой&nbsp;и&nbsp;логикой
          </h1>

          <div className="mt-7 max-w-lg space-y-3 text-[15px] leading-relaxed text-ink-soft [text-wrap:pretty]">
            <p>Перестаньте быть просто строкой в выдаче маркетплейсов.</p>
            <p>Сделаю ваш бренд узнаваемым, желаемым и масштабируемым на основе глубокой аналитики и опыта.</p>
          </div>

          <a
            href="#upgrade"
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-ink px-7 py-3.5 text-sm font-semibold transition-all hover:bg-ink hover:text-bg"
          >
            Получить КП
          </a>
        </div>

        {/* Center: cube */}
        <div className="lg:-mx-6">
          <HeroCube />
        </div>

        {/* Right: stats */}
        <div className="space-y-9">
          {heroStats.map((s) => (
            <div key={s.big}>
              <p className="font-display text-[2.5rem] font-normal leading-none tracking-tight text-ink">{s.big}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{s.text}</p>
            </div>
          ))}

          {/* studio badge connected to the card */}
          <div className="relative max-w-sm pt-3">
            <span className="absolute left-5 top-0 z-10 rounded-md bg-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-bg">
              человек-студия
            </span>
            <div className="rounded-2xl border border-line bg-bg-soft/60 px-5 pb-5 pt-7">
              <p className="text-[13px] leading-relaxed text-ink-soft">
                Я — Василий Аистов, co-founder / CMO в Химичке. Моя задача — делать яркие бренды,
                запоминающиеся среди конкурентов.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* competency progress bars — spread along the bottom */}
      <div className="mx-auto mt-14 grid max-w-[1640px] gap-8 px-6 sm:grid-cols-3 sm:px-10 lg:px-16">
        {competencies.map((c) => (
          <div key={c.num}>
            <div className="flex items-center gap-3">
              <span className="tech-label text-xs text-ink-soft">{c.num}:</span>
              <SkewBar />
            </div>
            <p className="mt-2 text-[13px] font-medium">{c.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
