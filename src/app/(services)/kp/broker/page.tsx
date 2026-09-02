import type { Metadata } from "next";
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

/* КП «Запуск брокерской платформы» — студийный вид (тёмная сцена, канон ДС).
   Второй вариант отображения — /kp/broker/doc (светлый лист, сериф).
   Контент общий: lib/kp/broker.ts.

   Аудитория — команда медиабаинга: бизнес-словарь их родной, брокерский нет,
   поэтому термины объясняются по ходу и собраны в словарь внизу. */

export const metadata: Metadata = {
  title: "КП «Запуск брокерской платформы» — AICS-93",
  description:
    "Коммерческое предложение AICS-93: поэтапный запуск брокерской платформы — экономика, модели исполнения, юнит-экономика, майлстоуны и стоимость.",
  robots: { index: false, follow: false },
};

const CHIP: React.CSSProperties = {
  clipPath:
    "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
};
const CARD: React.CSSProperties = {
  borderRadius: "20px",
  border: "1px solid var(--color-runtime-line)",
  background: "rgba(23,16,41,0.4)",
};
const PANEL: React.CSSProperties = {
  borderRadius: "25px 55px 55px 5px",
  border: "1px solid var(--color-runtime-line)",
  background: "rgba(23,16,41,0.45)",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
      [ {children} ]
    </p>
  );
}
function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 max-w-3xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
      {children}
    </h2>
  );
}

export default function KpBrokerPage() {
  return (
    <div className="text-runtime-ink">
      <KpChapterNav items={TOC} />

      {/* ---------- hero ---------- */}
      <div className="relative overflow-hidden">
        <div className="runtime-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-20 sm:px-8 sm:pt-28">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <span
              className="tech-label inline-flex items-center gap-2 text-[0.72rem]"
              style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
            >
              <span className="hud-dot" style={{ display: "inline-block" }} />
              коммерческое предложение · <span className="font-display">aics-93</span>
            </span>
            <KpViewSwitch base={KP_BASE} active="studio" />
          </div>

          <h1 className="mt-8 max-w-4xl text-[clamp(2rem,4.6vw,3.3rem)] font-semibold leading-[1.05] tracking-tight">
            {KP_META.h1}
          </h1>
          <p className="mt-5 max-w-3xl text-[1.07rem] leading-relaxed text-runtime-ink-soft">
            {KP_META.lead}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {KP_META.chips.map((c) => (
              <span
                key={c}
                className="tech-label rounded-full border border-runtime-line bg-black/30 px-3.5 py-1.5 text-[11px] text-runtime-ink-soft"
              >
                {c}
              </span>
            ))}
          </div>

          <nav aria-label="Содержание" className="mt-10 max-w-4xl">
            <p className="tech-label text-[0.68rem] text-runtime-ink-soft">[ содержание ]</p>
            <div className="mt-3 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {TOC.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className="group flex items-baseline gap-2.5 rounded-[3px] px-2 py-1.5 transition-colors hover:bg-white/[0.05]"
                >
                  <span className="hud text-[10px]" style={{ color: "var(--color-signal-2)" }}>{t.num}</span>
                  <span className="tech-label text-[12.5px] text-runtime-ink-soft transition-colors group-hover:text-runtime-ink">
                    {t.label}
                  </span>
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
        {/* ---------- 01 задача ---------- */}
        <section id="task" className="scroll-mt-28 pt-14">
          <Eyebrow>01 · задача</Eyebrow>
          <H2>Перестать отдавать доход клиента чужому брокеру</H2>
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.05fr_1fr]">
            <div className="space-y-4 text-[16.5px] leading-relaxed text-runtime-ink-soft">
              {TASK_PARAS.map((p) => {
                const [a, b] = p.strong ? p.text.split(p.strong) : [p.text, ""];
                return (
                  <p key={p.text}>
                    {a}
                    {p.strong ? <span className="text-runtime-ink">{p.strong}</span> : null}
                    {b}
                  </p>
                );
              })}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-[15px]">
                <thead>
                  <tr>
                    {TASK_TABLE.head.map((h) => (
                      <th key={h} className="tech-label border-b border-runtime-ink-soft px-4 py-2.5 text-left text-[10.5px] text-runtime-ink-soft">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TASK_TABLE.rows.map((r) => (
                    <tr key={r[0]}>
                      <td className="border-b border-runtime-line px-4 py-3 align-top text-runtime-ink-soft">{r[0]}</td>
                      <td className="font-display border-b border-runtime-line px-4 py-3 align-top text-runtime-ink">{r[1]}</td>
                      <td className="font-display border-b border-runtime-line px-4 py-3 align-top text-runtime-ink">{r[2]}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="border-t-2 border-runtime-ink px-4 pt-3.5 font-semibold text-runtime-ink">{TASK_TABLE.total[0]}</td>
                    <td className="font-display border-t-2 border-runtime-ink px-4 pt-3.5 font-semibold text-runtime-ink">{TASK_TABLE.total[1]}</td>
                    <td className="font-display border-t-2 border-runtime-ink px-4 pt-3.5 font-semibold" style={{ color: "var(--color-signal-2)" }}>
                      {TASK_TABLE.total[2]}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="p-5 sm:p-6" style={{ ...CHIP, border: "1px solid var(--color-runtime-line)", background: "rgba(23,16,41,0.4)" }}>
              <Eyebrow>когда сходится экономика</Eyebrow>
              <p className="mt-3 text-[15.5px] leading-relaxed text-runtime-ink-soft">{TASK_NOTE}</p>
            </div>
            <div className="p-5 sm:p-6" style={{ ...CHIP, border: "1px solid #ff7050", background: "rgba(255,112,80,0.07)" }}>
              <p className="tech-label text-[0.68rem]" style={{ color: "#ff7050" }}>[ про оборотный капитал ]</p>
              <p className="mt-3 text-[15.5px] leading-relaxed text-runtime-ink-soft">{TASK_WARN}</p>
            </div>
          </div>
        </section>

        {/* ---------- 02 доход ---------- */}
        <section id="revenue" className="scroll-mt-28 pt-16">
          <Eyebrow>02 · доход брокера</Eyebrow>
          <H2>Три источника, устроенных по-разному</H2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {REVENUE_SOURCES.map((s) => (
              <div key={s.title} className="p-5 sm:p-6" style={CARD}>
                <h3 className="text-[17px] font-semibold leading-snug text-runtime-ink">{s.title}</h3>
                <p className="mt-2.5 text-[15.5px] leading-relaxed text-runtime-ink-soft">{s.text}</p>
                <p className="tech-label mt-4 border-t border-runtime-line pt-3 text-[11px] text-runtime-ink-soft">{s.dep}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 max-w-3xl space-y-4 text-[16.5px] leading-relaxed text-runtime-ink-soft">
            {REVENUE_PARAS.map((t) => <p key={t}>{t}</p>)}
          </div>
        </section>

        {/* ---------- 03 A/B ---------- */}
        <section id="books" className="scroll-mt-28 pt-16">
          <Eyebrow>03 · a-book и b-book</Eyebrow>
          <H2>Кто стоит на другой стороне сделки клиента</H2>
          <p className="mt-5 max-w-3xl text-[16.5px] leading-relaxed text-runtime-ink-soft">{BOOKS_LEAD}</p>
          <div className="mt-8"><BrokerBooks /></div>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-[15.5px]">
              <thead>
                <tr>
                  {BOOKS_TABLE.head.map((h) => (
                    <th key={h} className="tech-label border-b border-runtime-ink-soft px-5 py-3 text-left text-[10.5px] text-runtime-ink-soft">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BOOKS_TABLE.rows.map((r) => (
                  <tr key={r[0]}>
                    <td className="border-b border-runtime-line px-5 py-3.5 font-semibold text-runtime-ink">{r[0]}</td>
                    <td className="font-display border-b border-runtime-line px-5 py-3.5 text-runtime-ink">{r[1]}</td>
                    <td className="font-display border-b border-runtime-line px-5 py-3.5 text-runtime-ink">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 grid gap-x-10 gap-y-6 lg:grid-cols-2">
            {BOOKS_WHY.map((t) => (
              <p key={t} className="border-l-2 pl-5 text-[15.5px] leading-relaxed text-runtime-ink-soft" style={{ borderColor: "var(--color-signal)" }}>{t}</p>
            ))}
          </div>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[15.5px]">
              <thead>
                <tr>
                  {["Модель", "Доход", "Риск", "Нужен риск-менеджер"].map((h) => (
                    <th key={h} className="tech-label border-b border-runtime-ink-soft px-5 py-3 text-left text-[10.5px] text-runtime-ink-soft">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BOOKS_MODELS.map((m) => (
                  <tr key={m.model}>
                    <td className="border-b border-runtime-line px-5 py-3.5 font-semibold text-runtime-ink">{m.model}</td>
                    <td className="border-b border-runtime-line px-5 py-3.5 text-runtime-ink-soft">{m.income}</td>
                    <td className="border-b border-runtime-line px-5 py-3.5 text-runtime-ink-soft">{m.risk}</td>
                    <td className="border-b border-runtime-line px-5 py-3.5 text-runtime-ink-soft">{m.rm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="p-5 sm:p-6" style={{ ...CHIP, border: "1px solid var(--color-signal-cool)", background: "rgba(151,71,255,0.07)" }}>
              <Eyebrow>почему гибрид</Eyebrow>
              <p className="mt-3 text-[15.5px] leading-relaxed text-runtime-ink-soft">{BOOKS_NOTE}</p>
            </div>
            <div className="p-5 sm:p-6" style={CARD}>
              <Eyebrow>как включаем</Eyebrow>
              <p className="mt-3 text-[15.5px] leading-relaxed text-runtime-ink-soft">{BOOKS_ROLLOUT}</p>
            </div>
          </div>
        </section>

        {/* ---------- 04 тип брокера ---------- */}
        <section id="type" className="scroll-mt-28 pt-16">
          <Eyebrow>04 · тип брокера</Eyebrow>
          <H2>Какой брокер подходит команде из трафика</H2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-[15.5px]">
              <thead>
                <tr>
                  {TYPE_TABLE.head.map((h) => (
                    <th key={h} className="tech-label border-b border-runtime-ink-soft px-5 py-3 text-left text-[10.5px] text-runtime-ink-soft">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TYPE_TABLE.rows.map((r) => (
                  <tr key={r[0]}>
                    <td className="border-b border-runtime-line px-5 py-3.5 text-runtime-ink-soft">{r[0]}</td>
                    <td className="border-b border-runtime-line px-5 py-3.5 text-runtime-ink">{r[1]}</td>
                    <td className="border-b border-runtime-line px-5 py-3.5 text-runtime-ink">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <figure className="mt-8 m-0 overflow-hidden p-4 sm:p-5" style={CARD}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={TYPE_PROOF.src} alt={TYPE_PROOF.alt} loading="lazy" className="block w-full rounded-[10px]" />
            <figcaption className="mt-4 border-t border-runtime-line pt-3 text-[14.5px] leading-relaxed text-runtime-ink-soft">
              {TYPE_PROOF.caption}
            </figcaption>
          </figure>
          <div className="mt-6 p-5 sm:p-6" style={{ ...CHIP, border: "1px solid var(--color-signal-cool)", background: "rgba(151,71,255,0.07)" }}>
            <Eyebrow>рекомендация</Eyebrow>
            <p className="mt-3 max-w-4xl text-[15.5px] leading-relaxed text-runtime-ink-soft">{TYPE_NOTE}</p>
          </div>
        </section>

        {/* ---------- 05 юнит-экономика ---------- */}
        <section id="unit" className="scroll-mt-28 pt-16">
          <Eyebrow>05 · юнит-экономика</Eyebrow>
          <H2>Один клиент и один месяц — на ваших цифрах</H2>
          <p className="mt-5 max-w-3xl text-[16.5px] leading-relaxed text-runtime-ink-soft">{UNIT_LEAD}</p>
          <div className="mt-8"><BrokerUnitEconomics /></div>
          <div className="mt-6 p-5 sm:p-6" style={{ ...CHIP, border: "1px solid var(--color-runtime-line)", background: "rgba(23,16,41,0.4)" }}>
            <Eyebrow>что из этого следует</Eyebrow>
            <p className="mt-3 max-w-4xl text-[15.5px] leading-relaxed text-runtime-ink-soft">{UNIT_NOTE}</p>
          </div>
        </section>

        {/* ---------- 06 майлстоуны ---------- */}
        <section id="milestones" className="scroll-mt-28 pt-16">
          <Eyebrow>06 · майлстоуны</Eyebrow>
          <H2>Четыре шага, выход после любого</H2>
          <div className="mt-8 grid gap-5">
            {MILESTONES.map((m) => (
              <div key={m.tag} className="border-l-2 p-5 sm:p-6" style={{ ...CARD, borderRadius: "0 20px 20px 0", borderLeft: "2px solid var(--color-signal)" }}>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-[19px] font-semibold leading-snug text-runtime-ink">
                    <span className="font-display mr-2.5 text-[15px]" style={{ color: "var(--color-signal-2)" }}>{m.tag}</span>
                    {m.title}
                  </h3>
                  <span className="tech-label whitespace-nowrap text-[12px] text-runtime-ink-soft">{m.meta}</span>
                </div>
                <p className="mt-3 text-[15.5px] leading-relaxed text-runtime-ink-soft">{m.lead}</p>
                <ul className="mt-4 grid gap-2.5">
                  {m.items.map((it) => (
                    <li key={it} className="grid grid-cols-[18px_1fr] gap-3">
                      <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden className="mt-[5px]">
                        <path d="M4 10.5l4 4 8-9" fill="none" stroke="#5fd9f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-[15.5px] leading-relaxed text-runtime-ink-soft">{it}</span>
                    </li>
                  ))}
                </ul>
                {m.gate ? (
                  <div className="mt-5 rounded-[12px] px-4 py-3.5" style={{ background: "rgba(0,0,0,0.28)" }}>
                    <p className="tech-label text-[10px]" style={{ color: "var(--color-signal-2)" }}>гейт на выход</p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-runtime-ink-soft">{m.gate}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 07 план ---------- */}
        <section id="plan" className="scroll-mt-28 pt-16">
          <Eyebrow>07 · план работ</Eyebrow>
          <H2>Два трека: ваш и наш</H2>
          <div className="mt-8"><BrokerPlan /></div>
        </section>

        {/* ---------- 08 стоимость ---------- */}
        <section id="price" className="scroll-mt-28 pt-16">
          <Eyebrow>08 · стоимость</Eyebrow>
          <H2>
            МВП — <span className="font-display">{PRICE_TOTAL.sum}</span> тремя платежами
          </H2>
          <p className="mt-5 max-w-3xl text-[16.5px] leading-relaxed text-runtime-ink-soft">{PRICE_LEAD}</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {PRICE_STEPS.map((s) => (
              <div key={s.when} className="p-5 sm:p-6" style={CARD}>
                <p className="tech-label text-[11px] text-runtime-ink-soft">{s.when}</p>
                <p className="font-display mt-2 text-[1.6rem] leading-none" style={{ color: "var(--color-signal-2)" }}>{s.sum}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-runtime-ink-soft">{s.text}</p>
              </div>
            ))}
          </div>
          <ul className="mt-8 grid max-w-4xl gap-3.5">
            {PRICE_TERMS.map((t) => (
              <li key={t} className="grid grid-cols-[18px_1fr] gap-3">
                <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden className="mt-[5px]">
                  <path d="M4 10.5l4 4 8-9" fill="none" stroke="#5fd9f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[15.5px] leading-relaxed text-runtime-ink-soft">{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- 09 владение ---------- */}
        <section id="upkeep" className="scroll-mt-28 pt-16">
          <Eyebrow>09 · стоимость владения</Eyebrow>
          <H2>Что ещё войдёт в бюджет — помимо разработки</H2>
          <p className="mt-5 max-w-3xl text-[16.5px] leading-relaxed text-runtime-ink-soft">{UPKEEP_LEAD}</p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[15.5px]">
              <thead>
                <tr>
                  {["Статья", "Когда", "Порядок"].map((h) => (
                    <th key={h} className="tech-label border-b border-runtime-ink-soft px-5 py-3 text-left text-[10.5px] text-runtime-ink-soft">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {UPKEEP_ROWS.map((r) => (
                  <tr key={r.item}>
                    <td className="border-b border-runtime-line px-5 py-3.5 text-runtime-ink">{r.item}</td>
                    <td className="border-b border-runtime-line px-5 py-3.5 text-runtime-ink-soft">{r.when}</td>
                    <td className="font-display border-b border-runtime-line px-5 py-3.5 whitespace-nowrap text-runtime-ink">{r.sum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------- 10 роли и риски ---------- */}
        <section id="roles" className="scroll-mt-28 pt-16">
          <Eyebrow>10 · роли и риски</Eyebrow>
          <H2>Кто за что отвечает</H2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {[
              { t: "Берём на себя", list: ROLE_OURS },
              { t: "Нужно от вас", list: ROLE_YOURS },
            ].map((col) => (
              <div key={col.t} className="p-5 sm:p-6" style={CARD}>
                <h3 className="text-[17px] font-semibold text-runtime-ink">{col.t}</h3>
                <ul className="mt-4 grid gap-2.5">
                  {col.list.map((x) => (
                    <li key={x} className="grid grid-cols-[18px_1fr] gap-3">
                      <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden className="mt-[5px]">
                        <path d="M4 10.5l4 4 8-9" fill="none" stroke="#5fd9f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-[15.5px] leading-relaxed text-runtime-ink-soft">{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 p-5 sm:p-6" style={{ ...CHIP, border: "1px solid #ff7050", background: "rgba(255,112,80,0.07)" }}>
            <p className="tech-label text-[0.68rem]" style={{ color: "#ff7050" }}>[ чего мы не делаем ]</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {ROLE_NOT.map((x) => (
                <li key={x} className="text-[15.5px] leading-relaxed text-runtime-ink-soft">— {x}</li>
              ))}
            </ul>
          </div>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-[15.5px]">
              <thead>
                <tr>
                  {["Риск", "Последствие", "Как снимаем"].map((h) => (
                    <th key={h} className="tech-label border-b border-runtime-ink-soft px-5 py-3 text-left text-[10.5px] text-runtime-ink-soft">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RISKS.map((r) => (
                  <tr key={r.risk}>
                    <td className="border-b border-runtime-line px-5 py-4 align-top font-semibold text-runtime-ink">{r.risk}</td>
                    <td className="border-b border-runtime-line px-5 py-4 align-top text-runtime-ink-soft">{r.effect}</td>
                    <td className="border-b border-runtime-line px-5 py-4 align-top text-runtime-ink-soft">{r.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 max-w-3xl space-y-4 text-[16.5px] leading-relaxed text-runtime-ink-soft">
            <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>[ почему не готовая коробка ]</p>
            {WHY_NOT_BOX.map((t) => <p key={t}>{t}</p>)}
          </div>
        </section>

        {/* ---------- 11 кто делает ---------- */}
        <section id="studio" className="scroll-mt-28 pt-16">
          <Eyebrow>11 · кто делает</Eyebrow>
          <H2>
            <span className="font-display">AICS-93</span>
          </H2>
          <p className="mt-5 max-w-3xl text-[16.5px] leading-relaxed text-runtime-ink-soft">{STUDIO_LEAD}</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {STUDIO_TEAM.map((t) => (
              <div key={t.role} className="p-5 sm:p-6" style={CARD}>
                <h3 className="text-[16.5px] font-semibold leading-snug text-runtime-ink">{t.role}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-runtime-ink-soft">{t.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {STUDIO_FACTS.map((f) => (
              <span key={f} className="tech-label rounded-full border border-runtime-line bg-black/30 px-3.5 py-1.5 text-[11px] text-runtime-ink-soft">{f}</span>
            ))}
          </div>
          <div className="mt-8 grid gap-x-10 gap-y-6 lg:grid-cols-3">
            {STUDIO_VALUE.map((v) => (
              <div key={v.lead} className="border-l-2 pl-5" style={{ borderColor: "var(--color-signal)" }}>
                <p className="text-[16.5px] font-semibold leading-snug text-runtime-ink">{v.lead}</p>
                <p className="mt-2 text-[15.5px] leading-relaxed text-runtime-ink-soft">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 12 вопросы и словарь ---------- */}
        <section id="faq" className="scroll-mt-28 pt-16">
          <Eyebrow>12 · вопросы и словарь</Eyebrow>
          <H2>Что обычно спрашивают</H2>
          <div className="mt-8 max-w-4xl">
            {FAQ.map((f) => (
              <details key={f.q} className="faq-acc border-b border-runtime-line">
                <summary className="cursor-pointer py-4 text-[16.5px] font-semibold text-runtime-ink">{f.q}</summary>
                <p className="pb-4 text-[15.5px] leading-relaxed text-runtime-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
          <h3 className="mt-12 text-[19px] font-semibold text-runtime-ink">Термины, с которыми вы будете жить</h3>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {GLOSSARY.map((g) => (
              <div key={g.group} className="p-5 sm:p-6" style={CARD}>
                <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>{g.group}</p>
                <dl className="mt-4 grid gap-3">
                  {g.items.map((it) => (
                    <div key={it.term}>
                      <dt className="hud text-[12px] text-runtime-ink">{it.term}</dt>
                      <dd className="mt-1 text-[14.5px] leading-relaxed text-runtime-ink-soft">{it.text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 13 пути входа ---------- */}
        <section id="paths" className="scroll-mt-28 pt-16">
          <Eyebrow>13 · пути входа</Eyebrow>
          <H2>Три пути — и не все требуют капитала</H2>
          <p className="mt-5 max-w-3xl text-[16.5px] leading-relaxed text-runtime-ink-soft">{PATHS_LEAD}</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {PATHS.map((p, i) => (
              <div key={p.way} className="p-5 sm:p-6" style={i === 2 ? { ...CARD, border: "1px solid var(--color-signal-cool)" } : CARD}>
                <h3 className="text-[17px] font-semibold leading-snug text-runtime-ink">{p.way}</h3>
                <p className="font-display mt-2 text-[1.3rem]" style={{ color: "var(--color-signal-2)" }}>{p.freeze}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-runtime-ink-soft">{p.who}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 max-w-4xl p-5 sm:p-6" style={PANEL}>
            <p className="tech-label text-[0.68rem] text-runtime-ink-soft">[ данные и источники ]</p>
            <ul className="mt-3 grid gap-1.5">
              {SOURCES.map((s) => (
                <li key={s.href} className="text-[14.5px] leading-relaxed text-runtime-ink-soft">
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline decoration-1 underline-offset-2 transition-colors hover:text-runtime-ink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[14.5px] leading-relaxed text-runtime-ink-soft">{SOURCES_NOTE}</p>
          </div>
        </section>
      </div>

      {/* ---------- квиз вместо формы: ответы уходят Тихоном ---------- */}
      <QuizInline source="kp_broker" title={QUIZ.title} text={QUIZ.text} steps={QUIZ.steps()} />
    </div>
  );
}
