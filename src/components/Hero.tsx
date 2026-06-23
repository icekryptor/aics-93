import Image from "next/image";
import HeroCube from "./HeroCube";
import SkillBars from "./SkillBars";
import { assets, heroStats } from "@/lib/content";

export default function Hero() {
  return (
    <section id="top" className="relative pt-16 pb-16 sm:pt-20 lg:pb-28">
      <div className="relative mx-auto grid max-w-[1640px] items-start gap-12 px-6 sm:px-10 lg:grid-cols-[0.95fr_1.35fr_0.85fr] lg:gap-14 lg:px-16">
        {/* Left: headline + bars */}
        <div>
          <div className="mb-8 flex items-center gap-4">
            <Image src={assets.gear} alt="" width={64} height={64} className="size-14 shrink-0" />
            <div>
              <Image src={assets.wordmark} alt="AICS-93" width={150} height={36} className="h-[26px] w-auto" />
              <p className="mt-1.5 text-[10px] leading-tight tracking-tight text-ink-soft">
                autonomous intelligent<br />cyberhuman system #93
              </p>
            </div>
          </div>

          <h1 className="text-[clamp(1.85rem,2.7vw,2.5rem)] font-medium leading-[1.08] tracking-[-0.01em] text-ink">
            Дизайн и решения,<br />
            вдохновленные<br />
            системой и логикой
          </h1>

          <div className="mt-6 max-w-[340px] space-y-3 text-[15px] leading-relaxed text-ink-soft [text-wrap:pretty]">
            <p>Перестаньте быть просто строкой в выдаче маркетплейсов.</p>
            <p>Сделаю ваш бренд узнаваемым, желаемым и масштабируемым на основе глубокой аналитики и опыта.</p>
          </div>

          <a
            href="#upgrade"
            className="mt-7 inline-flex items-center gap-2 rounded-xl border border-ink px-7 py-3.5 text-sm font-semibold transition-all hover:bg-ink hover:text-bg"
          >
            Получить КП
          </a>

          <div className="mt-9">
            <SkillBars />
          </div>
        </div>

        {/* Center: cube */}
        <div className="lg:self-center">
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
    </section>
  );
}
