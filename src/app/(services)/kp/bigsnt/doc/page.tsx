import type { Metadata } from "next";
import Link from "next/link";
import { Playfair_Display, Lora } from "next/font/google";
import QuizInline from "@/components/QuizInline";
import KpViewSwitch from "@/components/kp/KpViewSwitch";
import KpChapterNav from "@/components/kp/KpChapterNav";
import BigsntUnitEconomics from "@/components/kp/BigsntUnitEconomics";
import BigsntDirect from "@/components/kp/BigsntDirect";
import BigsntPlan from "@/components/kp/BigsntPlan";
import {
  KP_BASE, KP_META, TOC, FACTS, TASK_PARAS, AUDIT_LEAD, AUDIT_QUOTE, AUDIT_ROWS,
  UNIT_LEAD, UNIT_NOTE, DIRECT_LEAD, OFFER_LEAD, TIERS, OFFER_NOTE, PLAN_LEAD, PLAN_CAPTION,
  PRICE_LEAD, PRICE_TERMS, ROLE_YOURS, ROLE_NOT, STUDIO_LEAD, CASES, STUDIO_FACTS,
  FAQ, SOURCES, SOURCES_NOTE, QUIZ,
} from "@/lib/kp/bigsnt";

/* Документная версия КП для BIGSNT — второй вид того же предложения
   (контент общий, lib/kp/bigsnt.ts). Светлый лист, сериф, под вдумчивое
   чтение и печать. Стили — scoped-класс `.kp-doc` в globals.css. */

const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], weight: ["500", "600", "700"], variable: "--font-playfair", display: "swap" });
const lora = Lora({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-lora", display: "swap" });

export const metadata: Metadata = {
  title: "КП «Свой канал продаж для BIGSNT» — документная версия",
  description: "Коммерческое предложение AICS-93 для BIGSNT в виде документа: аудит сайта, экономика заказа, три объёма работ, план и стоимость.",
  robots: { index: false, follow: false },
};

function Rule({ children }: { children: React.ReactNode }) {
  return (
    <div className="doc-rule mb-5">
      <span className="doc-eyebrow whitespace-nowrap">{children}</span>
    </div>
  );
}

const TAG_COLOR: Record<string, string> = {
  критично: "#b4450f",
  дизайн: "var(--paper-accent)",
  контент: "var(--paper-accent)",
  удержание: "#1e8a7a",
  актив: "#4a7a10",
};

export default function KpBigsntDocPage() {
  return (
    <div className={`${playfair.variable} ${lora.variable} px-4 py-10 sm:px-6 sm:py-14 xl:pl-[220px] min-[1600px]:pl-6`}>
      <KpChapterNav items={TOC.map((t) => ({ ...t, id: `doc-${t.id}` }))} />

      <article className="kp-doc mx-auto w-full max-w-[1140px] overflow-hidden rounded-[14px] px-6 py-12 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] sm:px-14 sm:py-16">
        {/* ---------- шапка ---------- */}
        <header className="border-b-2 pb-8" style={{ borderColor: "var(--paper-ink)" }}>
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="doc-eyebrow">коммерческое предложение · для BIGSNT</p>
              <p className="font-display mt-1 text-[19px] font-semibold tracking-[0.06em]">AICS-93</p>
            </div>
            <KpViewSwitch base={KP_BASE} active="doc" tone="paper" />
          </div>
          <h1 className="text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.08]">{KP_META.h1}</h1>
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
                <a key={t.id} href={`#doc-${t.id}`} className="doc-soft flex items-baseline gap-2.5 py-1 text-[15px] hover:underline">
                  <span className="font-display text-[12px]">{t.num}</span>
                  {t.label}
                </a>
              ))}
            </div>
          </nav>
        </header>

        {/* ---------- 01 ---------- */}
        <section id="doc-task" className="scroll-mt-8 pt-12">
          <Rule>01 · что увидел · 05.09.2026</Rule>
          <h2 className="text-[1.7rem] leading-tight">Сайт есть, но он не продаёт — он отправляет на Wildberries</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.v} className="doc-card p-4">
                <p className="font-display text-[1.4rem] leading-none" style={{ color: f.tone === "warm" ? "#b4450f" : "var(--paper-accent)" }}>{f.v}</p>
                <p className="doc-soft mt-2.5 text-[14.5px] leading-[1.5]">{f.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 max-w-[50rem] space-y-4 text-[1.02rem] leading-[1.6]">
            {TASK_PARAS.map((p) => {
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
        <section id="doc-audit" className="scroll-mt-8 pt-12">
          <Rule>02 · аудит сайта</Rule>
          <h2 className="text-[1.7rem] leading-tight">Что видит человек, который кликнул по вашему объявлению</h2>
          <p className="doc-soft mt-5 max-w-[50rem] text-[1.02rem] leading-[1.6]">{AUDIT_LEAD}</p>
          <blockquote className="mt-6 max-w-[50rem] border-l-[3px] pl-5" style={{ borderColor: "#b4450f" }}>
            <p className="text-[1.1rem] italic leading-snug">«{AUDIT_QUOTE.text}»</p>
            <p className="doc-soft mt-2 text-[13px]">{AUDIT_QUOTE.meta}</p>
          </blockquote>
          <div className="mt-7 grid gap-4">
            {AUDIT_ROWS.map((r) => (
              <div key={r.what} className="doc-card grid gap-4 p-5 sm:grid-cols-[1fr_auto]">
                <div>
                  <span className="rounded-[3px] px-2 py-0.5 text-[11.5px] uppercase tracking-[0.1em]" style={{ border: `1px solid ${TAG_COLOR[r.tag]}`, color: TAG_COLOR[r.tag] }}>{r.tag}</span>
                  <p className="mt-3 text-[15.5px] leading-[1.55]">{r.what}</p>
                  <p className="doc-soft mt-2.5 text-[15px] leading-[1.55]">{r.cost}</p>
                </div>
                {r.shot ? (
                  <figure className="m-0 sm:w-[200px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.shot.src} alt={r.shot.alt} loading="lazy" className="block rounded-[6px] border" style={{ borderColor: "var(--paper-line)", width: r.shot.ratio === "mobile" ? 120 : 200, height: "auto" }} />
                    <figcaption className="doc-soft mt-1.5 text-[11.5px]">{r.shot.caption}</figcaption>
                  </figure>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 03 ---------- */}
        <section id="doc-unit" className="scroll-mt-8 pt-12">
          <Rule>03 · экономика заказа</Rule>
          <h2 className="text-[1.7rem] leading-tight">Куда уходит каждый рубль с продажи одной банки</h2>
          <p className="doc-soft mt-5 max-w-[50rem] text-[1.02rem] leading-[1.6]">{UNIT_LEAD}</p>
          <div className="mt-7"><BigsntUnitEconomics tone="paper" /></div>
          <div className="mt-6 max-w-[50rem] rounded-[10px] border-l-[3px] p-5" style={{ borderColor: "var(--paper-accent)", background: "rgba(128,56,232,0.05)" }}>
            <p className="doc-eyebrow">что из этого следует</p>
            <p className="doc-soft mt-2.5 text-[15.5px] leading-[1.6]">{UNIT_NOTE}</p>
          </div>
        </section>

        {/* ---------- 04 ---------- */}
        <section id="doc-direct" className="scroll-mt-8 pt-12">
          <Rule>04 · яндекс директ</Rule>
          <h2 className="text-[1.7rem] leading-tight">Тот же бюджет — другое количество заказов</h2>
          <p className="doc-soft mt-5 max-w-[50rem] text-[1.02rem] leading-[1.6]">{DIRECT_LEAD}</p>
          <div className="mt-7"><BigsntDirect tone="paper" /></div>
        </section>

        {/* ---------- 05 ---------- */}
        <section id="doc-offer" className="scroll-mt-8 pt-12">
          <Rule>05 · три объёма работ</Rule>
          <h2 className="text-[1.7rem] leading-tight">Что предлагаю сделать</h2>
          <p className="doc-soft mt-5 max-w-[50rem] text-[1.02rem] leading-[1.6]">{OFFER_LEAD}</p>
          <div className="mt-7 grid gap-5">
            {TIERS.map((t) => (
              <article key={t.key} className="doc-card p-5 sm:p-6" style={t.rec ? { borderColor: "var(--paper-accent)", borderWidth: 2 } : undefined}>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <p className="doc-eyebrow">{t.num} · {t.name}{t.rec ? " · рекомендую" : ""}</p>
                    <h3 className="mt-1.5 text-[1.25rem] leading-snug">{t.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-display doc-money text-[1.4rem] leading-none">{t.price}</p>
                    <p className="doc-soft mt-1 text-[12.5px]">{t.hours} ч × 5 000 ₽ · {t.days}</p>
                  </div>
                </div>
                <p className="doc-soft mt-4 text-[15px] leading-[1.55]">{t.forWhom}</p>
                <table className="mt-4 w-full border-collapse text-[15px]">
                  <tbody>
                    {t.items.map((it) => (
                      <tr key={it.text}>
                        <td className={`border-b py-2 pr-4 align-top ${it.inherit ? "doc-soft italic" : ""}`} style={{ borderColor: "var(--paper-line)" }}>{it.text}</td>
                        <td className="font-display border-b py-2 text-right align-top text-[13px] whitespace-nowrap" style={{ borderColor: "var(--paper-line)" }}>{it.h} ч</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            ))}
          </div>
          <p className="doc-soft mt-6 max-w-[50rem] text-[15.5px] leading-[1.6]">{OFFER_NOTE}</p>
        </section>

        {/* ---------- 06 ---------- */}
        <section id="doc-plan" className="scroll-mt-8 pt-12">
          <Rule>06 · план работ</Rule>
          <h2 className="text-[1.7rem] leading-tight">Как пройдут эти недели</h2>
          <p className="doc-soft mt-5 max-w-[50rem] text-[1.02rem] leading-[1.6]">{PLAN_LEAD}</p>
          <div className="mt-7"><BigsntPlan tone="paper" /></div>
          <p className="doc-soft mt-4 max-w-[50rem] text-[15px] leading-[1.55]">{PLAN_CAPTION}</p>
        </section>

        {/* ---------- 07 ---------- */}
        <section id="doc-price" className="scroll-mt-8 pt-12">
          <Rule>07 · стоимость и условия</Rule>
          <h2 className="text-[1.7rem] leading-tight"><span className="font-display">320 / 500 / 750</span> тысяч рублей — по объёму, без сюрпризов</h2>
          <p className="doc-soft mt-5 max-w-[50rem] text-[1.02rem] leading-[1.6]">{PRICE_LEAD}</p>
          <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {PRICE_TERMS.map((t) => (
              <div key={t.t}>
                <dt className="text-[1.02rem] font-semibold">{t.t}</dt>
                <dd className="doc-soft mt-1 text-[15px] leading-[1.55]">{t.text}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="doc-card p-5">
              <p className="doc-eyebrow">нужно от вас</p>
              <ul className="mt-3 grid gap-2 text-[15px] leading-[1.55]">
                {ROLE_YOURS.map((x) => <li key={x} className="doc-soft">— {x}</li>)}
              </ul>
            </div>
            <div className="rounded-[10px] border-l-[3px] p-5" style={{ borderColor: "#b4450f", background: "rgba(180,69,15,0.05)" }}>
              <p className="doc-eyebrow" style={{ color: "#b4450f" }}>чего я не делаю</p>
              <ul className="mt-3 grid gap-2 text-[15px] leading-[1.55]">
                {ROLE_NOT.map((x) => <li key={x} className="doc-soft">— {x}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- 08 ---------- */}
        <section id="doc-studio" className="scroll-mt-8 pt-12">
          <Rule>08 · кто делает</Rule>
          <h2 className="text-[1.7rem] leading-tight"><span className="font-display">AICS-93</span> · Василий Аистов</h2>
          <p className="doc-soft mt-5 max-w-[50rem] text-[1.02rem] leading-[1.6]">{STUDIO_LEAD}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CASES.map((c) => (
              <Link key={c.name} href={c.href} className="doc-card block overflow-hidden transition-colors hover:border-[color:var(--paper-accent)]">
                {c.shot ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.shot} alt={`Сайт ${c.name}`} loading="lazy" className="block aspect-[16/9] w-full object-cover object-top" />
                ) : null}
                <div className="p-4">
                  <p className="text-[1.02rem] font-semibold">{c.name}</p>
                  <p className="doc-eyebrow mt-1 text-[11px]">{c.meta}</p>
                  <p className="doc-soft mt-2 text-[14.5px] leading-[1.5]">{c.text}</p>
                  <p className="mt-3 text-[13.5px] underline underline-offset-2" style={{ color: "var(--paper-accent)" }}>смотреть кейс →</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="doc-soft mt-4 text-[14px]">{STUDIO_FACTS.join(" · ")}</p>
        </section>

        {/* ---------- 09 ---------- */}
        <section id="doc-faq" className="scroll-mt-8 pt-12">
          <Rule>09 · вопросы и источники</Rule>
          <h2 className="text-[1.7rem] leading-tight">Что обычно спрашивают</h2>
          <div className="mt-5 max-w-[50rem]">
            {FAQ.map((f) => (
              <div key={f.q} className="border-b py-4" style={{ borderColor: "var(--paper-line)" }}>
                <p className="text-[1.02rem] font-semibold">{f.q}</p>
                <p className="doc-soft mt-2 text-[15.5px] leading-[1.6]">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="doc-card mt-7 max-w-[50rem] p-5">
            <p className="doc-eyebrow">данные и источники</p>
            <ol className="mt-3 grid gap-1.5 pl-5 text-[14px] leading-[1.55]">
              {SOURCES.map((s) => (
                <li key={s.href} className="doc-soft">
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline decoration-1 underline-offset-2">{s.label}</a>
                </li>
              ))}
            </ol>
            <p className="doc-soft mt-3 text-[14px] leading-[1.55]">{SOURCES_NOTE}</p>
          </div>
        </section>
      </article>

      <div className="mx-auto mt-10 max-w-[1140px]">
        <QuizInline source="kp_bigsnt_doc" title={QUIZ.title} text={QUIZ.text} steps={QUIZ.steps()} />
      </div>
    </div>
  );
}
