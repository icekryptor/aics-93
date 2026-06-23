import Image from "next/image";
import HeroCube from "./HeroCube";
import { assets, competencies, heroStats } from "@/lib/content";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16 pb-16 sm:pt-20 lg:pb-24">
      {/* faint grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* plus marks */}
      <div className="pointer-events-none absolute right-6 top-24 text-ink/20 select-none hidden lg:block">+</div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.16fr_0.72fr]">
        {/* Left: headline */}
        <div>
          <div className="mb-8 flex items-center gap-4">
            <Image src={assets.gear} alt="" width={64} height={64} className="size-14 shrink-0" />
            <div>
              <Image src={assets.wordmark} alt="AICS-93" width={150} height={36} className="h-[28px] w-auto" />
              <p className="mt-1.5 text-[10px] leading-tight tracking-tight text-ink-soft">
                autonomous intelligent<br />cyberhuman system #93
              </p>
            </div>
          </div>

          <h1 className="text-[clamp(2rem,4.4vw,3rem)] font-medium leading-[1.06] tracking-[-0.01em] text-ink">
            Дизайн и решения,<br />
            вдохновленные<br />
            системой и логикой
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
            Перестаньте быть просто строкой в выдаче маркетплейсов.
          </p>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
            Сделаю ваш бренд узнаваемым, желаемым и масштабируемым на основе глубокой аналитики и опыта.
          </p>

          <a
            href="#upgrade"
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-ink px-6 py-3.5 text-sm font-semibold transition-all hover:bg-ink hover:text-bg"
          >
            Получить КП
          </a>

          {/* competency bars */}
          <div className="mt-10 space-y-3 max-w-xs">
            {competencies.map((c) => (
              <div key={c.num}>
                <div className="flex items-center gap-2">
                  <span className="tech-label text-xs text-ink-soft">{c.num}:</span>
                  <span className="stripe-bar h-3 flex-1 rounded-[2px] opacity-80" />
                </div>
                <p className="mt-1 text-[13px] font-medium">{c.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Center: cube */}
        <div>
          <HeroCube />
        </div>

        {/* Right: stats */}
        <div className="space-y-8">
          {heroStats.map((s) => (
            <div key={s.big}>
              <p className="font-display text-[2.4rem] font-normal leading-none tracking-tight text-ink">{s.big}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{s.text}</p>
            </div>
          ))}

          {/* studio badge + speech bubble */}
          <div>
            <span className="inline-block rounded-md bg-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-bg">
              человек-студия
            </span>
            <div className="relative mt-3 rounded-2xl rounded-tl-sm border border-line bg-bg-soft/60 p-4">
              <p className="text-[13px] leading-relaxed text-ink-soft">
                Я — Василий Аистов, co-founder / CMO в Химичке. Моя задача — делать яркие бренды,
                запоминающиеся среди конкурентов.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
