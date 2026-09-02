import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import QuizInline from "@/components/QuizInline";
import KpViewSwitch from "@/components/kp/KpViewSwitch";
import KpChapterNav from "@/components/kp/KpChapterNav";
import BrokerBooks from "@/components/kp/BrokerBooks";
import BrokerPlan from "@/components/kp/BrokerPlan";
import BrokerUnitEconomics from "@/components/kp/BrokerUnitEconomics";
import {
  KP_BASE, KP_META, TOC, TASK_PARAS, TASK_TABLE, TASK_NOTE, TASK_WARN,
  REVENUE_SOURCES, REVENUE_PARAS, BOOKS_LEAD, BOOKS_TABLE, BOOKS_WHY, BOOKS_MODELS,
  BOOKS_NOTE, BOOKS_ROLLOUT, TYPE_TABLE, TYPE_NOTE, TYPE_PROOF, UNIT_LEAD, UNIT_NOTE,
  MILESTONES, PRICE_LEAD, PRICE_STEPS, PRICE_TOTAL, PRICE_TERMS, UPKEEP_LEAD, UPKEEP_ROWS,
  ROLE_OURS, ROLE_YOURS, ROLE_NOT, RISKS, WHY_NOT_BOX, STUDIO_LEAD, STUDIO_TEAM,
  STUDIO_FACTS, STUDIO_VALUE, FAQ, GLOSSARY, PATHS, PATHS_LEAD, SOURCES, SOURCES_NOTE, QUIZ,
} from "@/lib/kp/broker";

/* Документная версия КП брокера — второй вариант отображения того же
   предложения (контент общий, lib/kp/broker.ts). Светлый лист, сериф:
   КП длинное, его читают целиком и печатают. Стили — scoped-класс `.kp-doc`
   в globals.css (санкционированное исключение из §2 канона). */

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});
const lora = Lora({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "КП «Запуск брокерской платформы» — документная версия",
  description:
    "Коммерческое предложение AICS-93 в виде документа: экономика брокера, модели исполнения, юнит-экономика, майлстоуны и стоимость.",
  robots: { index: false, follow: false },
};

function Rule({ children }: { children: React.ReactNode }) {
  return (
    <div className="doc-rule mb-5">
      <span className="doc-eyebrow whitespace-nowrap">{children}</span>
    </div>
  );
}

const TH = "doc-soft border-b px-4 py-2.5 text-left text-[13px] font-normal uppercase tracking-[0.1em]";
const TD = "border-b px-4 py-3 align-top";

export default function KpBrokerDocPage() {
  return (
    <div className={`${playfair.variable} ${lora.variable} px-4 py-10 sm:px-6 sm:py-14`}>
      <KpChapterNav items={TOC.map((t) => ({ ...t, id: `doc-${t.id}` }))} />

      <article className="kp-doc mx-auto w-full max-w-[900px] overflow-hidden rounded-[14px] px-6 py-12 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] sm:px-14 sm:py-16">
        {/* ---------- шапка ---------- */}
        <header className="border-b-2 pb-8" style={{ borderColor: "var(--paper-ink)" }}>
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="doc-eyebrow">коммерческое предложение</p>
              <p className="font-display mt-1 text-[19px] font-semibold tracking-[0.06em]">AICS-93</p>
            </div>
            <KpViewSwitch base={KP_BASE} active="doc" tone="paper" />
          </div>
          <h1 className="text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.08]">{KP_META.h1}</h1>
          <p className="doc-soft mt-5 text-[1.02rem] leading-[1.6]">{KP_META.lead}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {KP_META.chips.map((c) => (
              <span key={c} className="doc-soft rounded-full border px-3.5 py-1.5 text-[12.5px]" style={{ borderColor: "var(--paper-line)" }}>
                {c}
              </span>
            ))}
          </div>
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

        {/* ---------- 01 задача ---------- */}
        <section id="doc-task" className="scroll-mt-8 pt-12">
          <Rule>01 · задача</Rule>
          <h2 className="text-[1.7rem] leading-tight">Перестать отдавать доход клиента чужому брокеру</h2>
          <div className="mt-5 space-y-4 text-[1.02rem] leading-[1.6]">
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
          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-[440px] border-collapse text-[15.5px]">
              <thead>
                <tr>{TASK_TABLE.head.map((h) => <th key={h} className={TH} style={{ borderColor: "var(--paper-ink)" }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {TASK_TABLE.rows.map((r) => (
                  <tr key={r[0]}>
                    <td className={`${TD} doc-soft`} style={{ borderColor: "var(--paper-line)" }}>{r[0]}</td>
                    <td className={`${TD} font-display`} style={{ borderColor: "var(--paper-line)" }}>{r[1]}</td>
                    <td className={`${TD} font-display`} style={{ borderColor: "var(--paper-line)" }}>{r[2]}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-4 pt-3.5 font-semibold" style={{ borderTop: "2px solid var(--paper-ink)" }}>{TASK_TABLE.total[0]}</td>
                  <td className="font-display px-4 pt-3.5 font-semibold" style={{ borderTop: "2px solid var(--paper-ink)" }}>{TASK_TABLE.total[1]}</td>
                  <td className="font-display doc-money px-4 pt-3.5 font-semibold" style={{ borderTop: "2px solid var(--paper-ink)" }}>{TASK_TABLE.total[2]}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="doc-card mt-7 rounded-[10px] p-5">
            <p className="doc-eyebrow">когда сходится экономика</p>
            <p className="doc-soft mt-2.5 text-[15.5px] leading-[1.6]">{TASK_NOTE}</p>
          </div>
          <div className="mt-4 rounded-[10px] border-l-[3px] p-5" style={{ borderColor: "var(--paper-money)", background: "rgba(168,102,11,0.05)" }}>
            <p className="doc-eyebrow" style={{ color: "var(--paper-money)" }}>про оборотный капитал</p>
            <p className="doc-soft mt-2.5 text-[15.5px] leading-[1.6]">{TASK_WARN}</p>
          </div>
        </section>

        {/* ---------- 02 доход ---------- */}
        <section id="doc-revenue" className="scroll-mt-8 pt-12">
          <Rule>02 · доход брокера</Rule>
          <h2 className="text-[1.7rem] leading-tight">Три источника, устроенных по-разному</h2>
          <div className="mt-6 grid gap-4">
            {REVENUE_SOURCES.map((s) => (
              <div key={s.title} className="doc-card rounded-[10px] p-5">
                <h3 className="text-[1.12rem]">{s.title}</h3>
                <p className="doc-soft mt-2 text-[15.5px] leading-[1.6]">{s.text}</p>
                <p className="doc-soft mt-3 border-t pt-2.5 text-[13.5px]" style={{ borderColor: "var(--paper-line)" }}>{s.dep}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-4 text-[1.02rem] leading-[1.6]">
            {REVENUE_PARAS.map((t) => <p key={t} className="doc-soft">{t}</p>)}
          </div>
        </section>

        {/* ---------- 03 A/B ---------- */}
        <section id="doc-books" className="scroll-mt-8 pt-12">
          <Rule>03 · a-book и b-book</Rule>
          <h2 className="text-[1.7rem] leading-tight">Кто стоит на другой стороне сделки клиента</h2>
          <p className="doc-soft mt-5 text-[1.02rem] leading-[1.6]">{BOOKS_LEAD}</p>
          <div className="mt-6"><BrokerBooks tone="paper" /></div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse text-[15.5px]">
              <thead><tr>{BOOKS_TABLE.head.map((h) => <th key={h} className={TH} style={{ borderColor: "var(--paper-ink)" }}>{h}</th>)}</tr></thead>
              <tbody>
                {BOOKS_TABLE.rows.map((r) => (
                  <tr key={r[0]}>
                    <td className={`${TD} font-semibold`} style={{ borderColor: "var(--paper-line)" }}>{r[0]}</td>
                    <td className={`${TD} font-display`} style={{ borderColor: "var(--paper-line)" }}>{r[1]}</td>
                    <td className={`${TD} font-display`} style={{ borderColor: "var(--paper-line)" }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 space-y-4">
            {BOOKS_WHY.map((t) => (
              <p key={t} className="doc-soft border-l-2 pl-5 text-[15.5px] leading-[1.6]" style={{ borderColor: "var(--paper-accent)" }}>{t}</p>
            ))}
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[540px] border-collapse text-[15.5px]">
              <thead><tr>{["Модель", "Доход", "Риск", "Риск-менеджер"].map((h) => <th key={h} className={TH} style={{ borderColor: "var(--paper-ink)" }}>{h}</th>)}</tr></thead>
              <tbody>
                {BOOKS_MODELS.map((m) => (
                  <tr key={m.model}>
                    <td className={`${TD} font-semibold`} style={{ borderColor: "var(--paper-line)" }}>{m.model}</td>
                    <td className={`${TD} doc-soft`} style={{ borderColor: "var(--paper-line)" }}>{m.income}</td>
                    <td className={`${TD} doc-soft`} style={{ borderColor: "var(--paper-line)" }}>{m.risk}</td>
                    <td className={`${TD} doc-soft`} style={{ borderColor: "var(--paper-line)" }}>{m.rm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="doc-card mt-6 rounded-[10px] border-l-[3px] p-5" style={{ borderLeftColor: "var(--paper-accent)" }}>
            <p className="doc-eyebrow">почему гибрид</p>
            <p className="doc-soft mt-2.5 text-[15.5px] leading-[1.6]">{BOOKS_NOTE}</p>
          </div>
          <div className="doc-card mt-4 rounded-[10px] p-5">
            <p className="doc-eyebrow">как включаем</p>
            <p className="doc-soft mt-2.5 text-[15.5px] leading-[1.6]">{BOOKS_ROLLOUT}</p>
          </div>
        </section>

        {/* ---------- 04 тип брокера ---------- */}
        <section id="doc-type" className="scroll-mt-8 pt-12">
          <Rule>04 · тип брокера</Rule>
          <h2 className="text-[1.7rem] leading-tight">Какой брокер подходит команде из трафика</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-[15.5px]">
              <thead><tr>{TYPE_TABLE.head.map((h) => <th key={h} className={TH} style={{ borderColor: "var(--paper-ink)" }}>{h}</th>)}</tr></thead>
              <tbody>
                {TYPE_TABLE.rows.map((r) => (
                  <tr key={r[0]}>
                    <td className={`${TD} doc-soft`} style={{ borderColor: "var(--paper-line)" }}>{r[0]}</td>
                    <td className={TD} style={{ borderColor: "var(--paper-line)" }}>{r[1]}</td>
                    <td className={TD} style={{ borderColor: "var(--paper-line)" }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <figure className="doc-card m-0 mt-6 rounded-[10px] p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={TYPE_PROOF.src} alt={TYPE_PROOF.alt} loading="lazy" className="block w-full rounded-[6px]" />
            <figcaption className="doc-soft mt-3 border-t pt-3 text-[14.5px] leading-[1.55]" style={{ borderColor: "var(--paper-line)" }}>
              {TYPE_PROOF.caption}
            </figcaption>
          </figure>
          <div className="doc-card mt-5 rounded-[10px] border-l-[3px] p-5" style={{ borderLeftColor: "var(--paper-accent)" }}>
            <p className="doc-eyebrow">рекомендация</p>
            <p className="doc-soft mt-2.5 text-[15.5px] leading-[1.6]">{TYPE_NOTE}</p>
          </div>
        </section>

        {/* ---------- 05 юнит-экономика ---------- */}
        <section id="doc-unit" className="scroll-mt-8 pt-12">
          <Rule>05 · юнит-экономика</Rule>
          <h2 className="text-[1.7rem] leading-tight">Один клиент и один месяц — на ваших цифрах</h2>
          <p className="doc-soft mt-5 text-[1.02rem] leading-[1.6]">{UNIT_LEAD}</p>
          <div className="mt-6"><BrokerUnitEconomics tone="paper" /></div>
          <div className="doc-card mt-5 rounded-[10px] p-5">
            <p className="doc-eyebrow">что из этого следует</p>
            <p className="doc-soft mt-2.5 text-[15.5px] leading-[1.6]">{UNIT_NOTE}</p>
          </div>
        </section>

        {/* ---------- 06 майлстоуны ---------- */}
        <section id="doc-milestones" className="scroll-mt-8 pt-12">
          <Rule>06 · майлстоуны</Rule>
          <h2 className="text-[1.7rem] leading-tight">Четыре шага, выход после любого</h2>
          <div className="mt-6 grid gap-5">
            {MILESTONES.map((m) => (
              <div key={m.tag} className="doc-card rounded-[10px] border-l-[3px] p-5" style={{ borderLeftColor: "var(--paper-accent)" }}>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-[1.2rem]">
                    <span className="font-display doc-money mr-2.5 text-[0.85rem]">{m.tag}</span>
                    {m.title}
                  </h3>
                  <span className="doc-soft whitespace-nowrap text-[13.5px]">{m.meta}</span>
                </div>
                <p className="doc-soft mt-3 text-[15.5px] leading-[1.6]">{m.lead}</p>
                <ul className="mt-3.5 grid gap-2">
                  {m.items.map((it) => (
                    <li key={it} className="doc-soft grid grid-cols-[16px_1fr] gap-3 text-[15px] leading-[1.55]">
                      <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden className="mt-[5px]">
                        <path d="M4 10.5l4 4 8-9" fill="none" stroke="var(--paper-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                {m.gate ? (
                  <div className="mt-4 rounded-[8px] px-4 py-3" style={{ background: "var(--paper-2)" }}>
                    <p className="doc-eyebrow">гейт на выход</p>
                    <p className="doc-soft mt-1.5 text-[14.5px] leading-[1.55]">{m.gate}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 07 план ---------- */}
        <section id="doc-plan" className="scroll-mt-8 pt-12">
          <Rule>07 · план работ</Rule>
          <h2 className="text-[1.7rem] leading-tight">Два трека: ваш и наш</h2>
          <div className="mt-6"><BrokerPlan tone="paper" /></div>
        </section>

        {/* ---------- 08 стоимость ---------- */}
        <section id="doc-price" className="scroll-mt-8 pt-12">
          <Rule>08 · стоимость</Rule>
          <h2 className="text-[1.7rem] leading-tight">
            МВП — <span className="font-display doc-money">{PRICE_TOTAL.sum}</span> тремя платежами
          </h2>
          <p className="doc-soft mt-5 text-[1.02rem] leading-[1.6]">{PRICE_LEAD}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {PRICE_STEPS.map((s) => (
              <div key={s.when} className="doc-card rounded-[10px] p-5">
                <p className="doc-eyebrow">{s.when}</p>
                <p className="font-display doc-money mt-2 text-[1.5rem] leading-none">{s.sum}</p>
                <p className="doc-soft mt-3 text-[14.5px] leading-[1.55]">{s.text}</p>
              </div>
            ))}
          </div>
          <ul className="mt-6 grid gap-3">
            {PRICE_TERMS.map((t) => (
              <li key={t} className="doc-soft grid grid-cols-[16px_1fr] gap-3 text-[15.5px] leading-[1.6]">
                <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden className="mt-[6px]">
                  <path d="M4 10.5l4 4 8-9" fill="none" stroke="var(--paper-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- 09 владение ---------- */}
        <section id="doc-upkeep" className="scroll-mt-8 pt-12">
          <Rule>09 · стоимость владения</Rule>
          <h2 className="text-[1.7rem] leading-tight">Что ещё войдёт в бюджет</h2>
          <p className="doc-soft mt-5 text-[1.02rem] leading-[1.6]">{UPKEEP_LEAD}</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-[15.5px]">
              <thead><tr>{["Статья", "Когда", "Порядок"].map((h) => <th key={h} className={TH} style={{ borderColor: "var(--paper-ink)" }}>{h}</th>)}</tr></thead>
              <tbody>
                {UPKEEP_ROWS.map((r) => (
                  <tr key={r.item}>
                    <td className={TD} style={{ borderColor: "var(--paper-line)" }}>{r.item}</td>
                    <td className={`${TD} doc-soft`} style={{ borderColor: "var(--paper-line)" }}>{r.when}</td>
                    <td className={`${TD} font-display whitespace-nowrap`} style={{ borderColor: "var(--paper-line)" }}>{r.sum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------- 10 роли и риски ---------- */}
        <section id="doc-roles" className="scroll-mt-8 pt-12">
          <Rule>10 · роли и риски</Rule>
          <h2 className="text-[1.7rem] leading-tight">Кто за что отвечает</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[{ t: "Берём на себя", list: ROLE_OURS }, { t: "Нужно от вас", list: ROLE_YOURS }].map((col) => (
              <div key={col.t} className="doc-card rounded-[10px] p-5">
                <h3 className="text-[1.1rem]">{col.t}</h3>
                <ul className="mt-3 grid gap-2">
                  {col.list.map((x) => (
                    <li key={x} className="doc-soft text-[15px] leading-[1.55]">— {x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[10px] border-l-[3px] p-5" style={{ borderColor: "var(--paper-money)", background: "rgba(168,102,11,0.05)" }}>
            <p className="doc-eyebrow" style={{ color: "var(--paper-money)" }}>чего мы не делаем</p>
            <ul className="mt-2.5 grid gap-1.5">
              {ROLE_NOT.map((x) => <li key={x} className="doc-soft text-[15px] leading-[1.55]">— {x}</li>)}
            </ul>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-[15px]">
              <thead><tr>{["Риск", "Последствие", "Как снимаем"].map((h) => <th key={h} className={TH} style={{ borderColor: "var(--paper-ink)" }}>{h}</th>)}</tr></thead>
              <tbody>
                {RISKS.map((r) => (
                  <tr key={r.risk}>
                    <td className={`${TD} font-semibold`} style={{ borderColor: "var(--paper-line)" }}>{r.risk}</td>
                    <td className={`${TD} doc-soft`} style={{ borderColor: "var(--paper-line)" }}>{r.effect}</td>
                    <td className={`${TD} doc-soft`} style={{ borderColor: "var(--paper-line)" }}>{r.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-7">
            <p className="doc-eyebrow">почему не готовая коробка</p>
            <div className="mt-3 space-y-4">
              {WHY_NOT_BOX.map((t) => <p key={t} className="doc-soft text-[1.02rem] leading-[1.6]">{t}</p>)}
            </div>
          </div>
        </section>

        {/* ---------- 11 кто делает ---------- */}
        <section id="doc-studio" className="scroll-mt-8 pt-12">
          <Rule>11 · кто делает</Rule>
          <h2 className="font-display text-[1.7rem] leading-tight">AICS-93</h2>
          <p className="doc-soft mt-5 text-[1.02rem] leading-[1.6]">{STUDIO_LEAD}</p>
          <ul className="mt-5 grid gap-3">
            {STUDIO_TEAM.map((t) => (
              <li key={t.role} className="doc-soft text-[15.5px] leading-[1.6]">
                <strong style={{ color: "var(--paper-ink)" }}>{t.role}</strong> — {t.text}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {STUDIO_FACTS.map((f) => (
              <span key={f} className="doc-soft rounded-full border px-3.5 py-1.5 text-[13px]" style={{ borderColor: "var(--paper-line)" }}>{f}</span>
            ))}
          </div>
          <div className="mt-6 grid gap-4">
            {STUDIO_VALUE.map((v) => (
              <div key={v.lead} className="border-l-2 pl-5" style={{ borderColor: "var(--paper-accent)" }}>
                <p className="font-semibold">{v.lead}</p>
                <p className="doc-soft mt-1.5 text-[15.5px] leading-[1.6]">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 12 вопросы и словарь ---------- */}
        <section id="doc-faq" className="scroll-mt-8 pt-12">
          <Rule>12 · вопросы и словарь</Rule>
          <h2 className="text-[1.7rem] leading-tight">Что обычно спрашивают</h2>
          <div className="mt-6">
            {FAQ.map((f) => (
              <details key={f.q} className="faq-acc border-b" style={{ borderColor: "var(--paper-line)" }}>
                <summary className="cursor-pointer py-3.5 text-[1.02rem] font-semibold">{f.q}</summary>
                <p className="doc-soft pb-4 text-[15.5px] leading-[1.6]">{f.a}</p>
              </details>
            ))}
          </div>
          <h3 className="mt-10 text-[1.25rem]">Термины, с которыми вы будете жить</h3>
          <div className="mt-5 grid gap-6">
            {GLOSSARY.map((g) => (
              <div key={g.group}>
                <p className="doc-eyebrow">{g.group}</p>
                <dl className="mt-3 grid gap-2.5">
                  {g.items.map((it) => (
                    <div key={it.term} className="grid gap-1 sm:grid-cols-[130px_1fr] sm:gap-4">
                      <dt className="font-display text-[13px]">{it.term}</dt>
                      <dd className="doc-soft text-[15px] leading-[1.55]">{it.text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 13 пути входа ---------- */}
        <section id="doc-paths" className="scroll-mt-8 pt-12">
          <Rule>13 · пути входа</Rule>
          <h2 className="text-[1.7rem] leading-tight">Три пути — и не все требуют капитала</h2>
          <p className="doc-soft mt-5 text-[1.02rem] leading-[1.6]">{PATHS_LEAD}</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-[15.5px]">
              <thead><tr>{["Путь", "Заморозка", "Кому подходит"].map((h) => <th key={h} className={TH} style={{ borderColor: "var(--paper-ink)" }}>{h}</th>)}</tr></thead>
              <tbody>
                {PATHS.map((p) => (
                  <tr key={p.way}>
                    <td className={`${TD} font-semibold`} style={{ borderColor: "var(--paper-line)" }}>{p.way}</td>
                    <td className={`${TD} font-display doc-money whitespace-nowrap`} style={{ borderColor: "var(--paper-line)" }}>{p.freeze}</td>
                    <td className={`${TD} doc-soft`} style={{ borderColor: "var(--paper-line)" }}>{p.who}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="doc-card mt-6 rounded-[10px] p-5">
            <p className="doc-eyebrow">данные и источники</p>
            <ul className="mt-3 grid gap-1.5">
              {SOURCES.map((s) => (
                <li key={s.href} className="doc-soft text-[14.5px] leading-[1.55]">
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{s.label}</a>
                </li>
              ))}
            </ul>
            <p className="doc-soft mt-3 text-[14.5px] leading-[1.55]">{SOURCES_NOTE}</p>
          </div>
        </section>
      </article>

      <QuizInline source="kp_broker_doc" title={QUIZ.title} text={QUIZ.text} steps={QUIZ.steps()} />
    </div>
  );
}
