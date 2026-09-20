import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import QuizInline from "@/components/QuizInline";
import KpChapterNav from "@/components/kp/KpChapterNav";
import UniqdocPricing from "@/components/kp/UniqdocPricing";
import {
  KP_META, TOC, CONTEXT_FACTS, CONTEXT_PARAS, CHANNELS, PRICING_LEAD, PRICING_NOTE,
  AUDIT, TIMELINE, TIMELINE_LEAD, TIMELINE_NOTE, ALWAYS, TERMS, FAQ, QUIZ,
} from "@/lib/kp/uniqdoc";

/* КП «Продвижение Uniqdoc» — сериф-документ (канон вида: DESIGN-SYSTEM §7,
   ширина листа 1140, проза до 50rem). Контент — lib/kp/uniqdoc.ts. */

const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], weight: ["500", "600", "700"], variable: "--font-playfair", display: "swap" });
const lora = Lora({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-lora", display: "swap" });

export const metadata: Metadata = {
  title: "КП для Uniqdoc — продвижение магазина",
  description: "Коммерческое предложение: таргет FB/IG, Google Ads и SEO для Uniqdoc — состав работ, пакеты, сроки и условия.",
  robots: { index: false, follow: false },
};

function Rule({ children }: { children: React.ReactNode }) {
  return (
    <div className="doc-rule mb-5">
      <span className="doc-eyebrow whitespace-nowrap">{children}</span>
    </div>
  );
}

const FACT_COLOR: Record<string, string> = {
  warm: "#b4450f",
  signal: "var(--paper-accent)",
  good: "#4a7a10",
};

const BAR_COLOR: Record<string, { bg: string; bd: string }> = {
  research: { bg: "rgba(128,56,232,0.16)", bd: "var(--paper-accent)" },
  setup: { bg: "rgba(30,138,122,0.16)", bd: "#1e8a7a" },
  run: { bg: "rgba(74,122,16,0.16)", bd: "#4a7a10" },
};

export default function KpUniqdocPage() {
  const weeks = 4;

  return (
    <div className={`${playfair.variable} ${lora.variable} px-4 py-10 sm:px-6 sm:py-14`}>
      <KpChapterNav items={TOC} visibleFrom="hidden min-[1560px]:block" />

      <article className="kp-doc mx-auto w-full max-w-[1140px] overflow-hidden rounded-[14px] px-6 py-12 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] sm:px-14 sm:py-16">
        {/* ---------- шапка ---------- */}
        <header className="border-b-2 pb-8" style={{ borderColor: "var(--paper-ink)" }}>
          <p className="doc-eyebrow">кп для uniqdoc</p>
          <h1 className="mt-5 text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.08]">{KP_META.h1}</h1>
          <p className="doc-soft mt-5 max-w-[50rem] text-[1.02rem] leading-[1.6]">{KP_META.lead}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {KP_META.chips.map((c) => (
              <span key={c} className="doc-soft rounded-full border px-3.5 py-1.5 text-[12.5px]" style={{ borderColor: "var(--paper-line)" }}>{c}</span>
            ))}
          </div>
          <p className="doc-soft mt-4 text-[13.5px]">{KP_META.date} · действительно до {KP_META.validUntil} · Василий Аистов</p>
          <nav aria-label="Содержание" className="mt-8">
            <p className="doc-eyebrow">содержание</p>
            <div className="mt-3 grid gap-1 sm:grid-cols-2">
              {TOC.map((t) => (
                <a key={t.id} href={`#${t.id}`} className="doc-soft flex items-baseline gap-2.5 py-1 text-[15px] hover:underline">
                  <span className="font-display text-[12px]">{t.num}</span>
                  {t.label}
                </a>
              ))}
            </div>
          </nav>
        </header>

        {/* ---------- 01 ---------- */}
        <section id="context" className="scroll-mt-8 pt-12">
          <Rule>01 · с чего начинаем</Rule>
          <h2 className="text-[1.7rem] leading-tight">Магазин готов — не хватает людей, которые о нём знают</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CONTEXT_FACTS.map((f) => (
              <div key={f.v} className="doc-card p-4">
                <p className="font-display text-[1.4rem] leading-none" style={{ color: FACT_COLOR[f.tone] }}>{f.v}</p>
                <p className="doc-soft mt-2.5 text-[14.5px] leading-[1.5]">{f.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 max-w-[50rem] space-y-4 text-[1.02rem] leading-[1.6]">
            {CONTEXT_PARAS.map((p) => {
              const [a, b] = p.strong ? p.text.split(p.strong) : [p.text, ""];
              return (
                <p key={p.text} className="doc-soft">
                  {a}
                  {p.strong ? <strong style={{ color: "var(--paper-ink)" }}>{p.strong}</strong> : null}
                  {b}
                </p>
              );
            })}
          </div>
        </section>

        {/* ---------- 02 ---------- */}
        <section id="channels" className="scroll-mt-8 pt-12">
          <Rule>02 · три канала</Rule>
          <h2 className="text-[1.7rem] leading-tight">Что именно делаю в каждом</h2>
          <div className="mt-7 grid gap-5">
            {CHANNELS.map((c) => (
              <article key={c.key} className="doc-card p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <p className="doc-eyebrow">{c.num} · {c.name}</p>
                    <h3 className="mt-1.5 text-[1.25rem] leading-snug">{c.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-display doc-money text-[1.4rem] leading-none">
                      {c.first.toLocaleString("ru-RU")} $
                    </p>
                    <p className="doc-soft mt-1 text-[12.5px]">
                      {c.next !== c.first ? `далее ${c.next.toLocaleString("ru-RU")} $` : "и далее столько же"} · {c.term}
                    </p>
                  </div>
                </div>
                <p className="doc-soft mt-4 max-w-[46rem] text-[15px] leading-[1.55]">{c.forWhom}</p>
                <ul className="mt-4 grid gap-2">
                  {c.items.map((it) => (
                    <li key={it} className="doc-soft flex items-start gap-2.5 text-[15px] leading-[1.55]">
                      <span aria-hidden className="mt-[0.6em] inline-block h-px w-3 shrink-0" style={{ background: "var(--paper-accent)" }} />
                      {it}
                    </li>
                  ))}
                </ul>
                {c.note ? (
                  <p className="doc-soft mt-4 border-l-[3px] pl-4 text-[14.5px] leading-[1.55]" style={{ borderColor: "var(--paper-line)" }}>
                    {c.note}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        {/* ---------- 03 ---------- */}
        <section id="pricing" className="scroll-mt-8 pt-12">
          <Rule>03 · пакеты и расчёт</Rule>
          <h2 className="text-[1.7rem] leading-tight">Сколько это стоит</h2>
          <p className="doc-soft mt-5 max-w-[50rem] text-[1.02rem] leading-[1.6]">{PRICING_LEAD}</p>
          <div className="mt-7"><UniqdocPricing /></div>
          <div className="mt-6 max-w-[50rem] rounded-[10px] border-l-[3px] p-5" style={{ borderColor: "var(--paper-accent)", background: "rgba(128,56,232,0.05)" }}>
            <p className="doc-eyebrow">почему первый месяц дороже</p>
            <p className="doc-soft mt-2.5 text-[15.5px] leading-[1.6]">{PRICING_NOTE}</p>
          </div>
        </section>

        {/* ---------- 04 ---------- */}
        <section id="audit" className="scroll-mt-8 pt-12">
          <Rule>04 · вход за 600 $</Rule>
          <h2 className="text-[1.7rem] leading-tight">Если запускать всё сразу рано</h2>
          <p className="doc-soft mt-5 max-w-[50rem] text-[1.02rem] leading-[1.6]">{AUDIT.lead}</p>
          <div className="mt-6 doc-card max-w-[50rem] p-5 sm:p-6" style={{ borderColor: "var(--paper-accent)", borderWidth: 2 }}>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-[1.25rem] leading-snug">Исследование и аудит</h3>
              <div className="text-right">
                <p className="font-display doc-money text-[1.4rem] leading-none">{AUDIT.price} $</p>
                <p className="doc-soft mt-1 text-[12.5px]">{AUDIT.term} · оплата сразу</p>
              </div>
            </div>
            <ul className="mt-4 grid gap-2">
              {AUDIT.items.map((it) => (
                <li key={it} className="doc-soft flex items-start gap-2.5 text-[15px] leading-[1.55]">
                  <span aria-hidden className="mt-[0.6em] inline-block h-px w-3 shrink-0" style={{ background: "var(--paper-accent)" }} />
                  {it}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[15px] leading-[1.55]" style={{ color: "var(--paper-ink)" }}>{AUDIT.note}</p>
          </div>
        </section>

        {/* ---------- 05 ---------- */}
        <section id="timeline" className="scroll-mt-8 pt-12">
          <Rule>05 · сроки и старт</Rule>
          <h2 className="text-[1.7rem] leading-tight">Первый месяц по неделям</h2>
          <p className="doc-soft mt-5 max-w-[50rem] text-[1.02rem] leading-[1.6]">{TIMELINE_LEAD}</p>

          <div className="mt-7 overflow-x-auto">
            <div className="min-w-[620px]">
              <div className="mb-2 grid gap-3" style={{ gridTemplateColumns: `180px repeat(${weeks}, 1fr)` }}>
                <span />
                {Array.from({ length: weeks }, (_, i) => (
                  <span key={i} className="doc-eyebrow text-[11px]">неделя {i + 1}</span>
                ))}
              </div>
              {TIMELINE.map((ph) => (
                <div key={ph.channel} className="grid items-center gap-3 border-t py-3" style={{ gridTemplateColumns: `180px 1fr`, borderColor: "var(--paper-line)" }}>
                  <span className="text-[14.5px] font-semibold" style={{ color: "var(--paper-ink)" }}>{ph.channel}</span>
                  <div className="relative h-8">
                    {ph.bars.map((b) => {
                      const c = BAR_COLOR[b.kind];
                      return (
                        <div
                          key={b.label}
                          title={b.label}
                          className="absolute top-1/2 flex -translate-y-1/2 items-center overflow-hidden rounded-[5px] px-2.5"
                          style={{
                            left: `${(b.start / weeks) * 100}%`,
                            width: `${(b.len / weeks) * 100}%`,
                            height: 26,
                            background: c.bg,
                            boxShadow: `inset 0 0 0 1.2px ${c.bd}`,
                          }}
                        >
                          <span className="truncate text-[12px]" style={{ color: "var(--paper-ink)" }}>{b.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="doc-soft mt-5 max-w-[50rem] text-[15px] leading-[1.55]">{TIMELINE_NOTE}</p>
        </section>

        {/* ---------- 06 ---------- */}
        <section id="always" className="scroll-mt-8 pt-12">
          <Rule>06 · что входит всегда</Rule>
          <h2 className="text-[1.7rem] leading-tight">Сайт под присмотром, независимо от пакета</h2>
          <p className="doc-soft mt-5 max-w-[50rem] text-[1.02rem] leading-[1.6]">{ALWAYS.lead}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ALWAYS.items.map((x) => (
              <div key={x.t} className="doc-card p-5">
                <p className="text-[1.02rem] font-semibold">{x.t}</p>
                <p className="doc-soft mt-2 text-[15px] leading-[1.55]">{x.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 07 ---------- */}
        <section id="terms" className="scroll-mt-8 pt-12">
          <Rule>07 · условия</Rule>
          <h2 className="text-[1.7rem] leading-tight">Как работаем</h2>
          <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {TERMS.map((t) => (
              <div key={t.t}>
                <dt className="text-[1.02rem] font-semibold">{t.t}</dt>
                <dd className="doc-soft mt-1 text-[15px] leading-[1.55]">{t.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- 08 ---------- */}
        <section id="faq" className="scroll-mt-8 pt-12">
          <Rule>08 · частые вопросы</Rule>
          <h2 className="text-[1.7rem] leading-tight">Что обычно спрашивают</h2>
          <div className="mt-5 max-w-[50rem]">
            {FAQ.map((f) => (
              <div key={f.q} className="border-b py-4" style={{ borderColor: "var(--paper-line)" }}>
                <p className="text-[1.02rem] font-semibold">{f.q}</p>
                <p className="doc-soft mt-2 text-[15.5px] leading-[1.6]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </article>

      {/* ---------- квиз вместо формы: ответы уходят Тихоном ---------- */}
      <div className="mx-auto mt-10 max-w-[1140px]">
        <QuizInline source="kp_uniqdoc" title={QUIZ.title} text={QUIZ.text} steps={QUIZ.steps()} />
      </div>
    </div>
  );
}
