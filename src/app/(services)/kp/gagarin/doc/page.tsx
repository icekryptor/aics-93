import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import QuizInline from "@/components/QuizInline";
import RevenueBar from "@/components/kp/RevenueBar";
import KpViewSwitch from "@/components/kp/KpViewSwitch";
import KpChapterNav from "@/components/kp/KpChapterNav";
import GagarinMark from "@/components/kp/GagarinMark";
import {
  KP_BASE,
  KP_META,
  TOC,
  WHAT_PARAS,
  SPEED_NOTE,
  FEATURES,
  PEDAGOGY,
  COMPARE,
  UPKEEP_NOTE,
  SEGMENTS_PAPER,
  REVENUE_CAPTION,
  PAYBACK,
  PAYBACK_NOTE,
  PRICE_NOTE,
  PLANS,
  STAGES,
  NEED,
  QUIZ,
} from "@/lib/kp/gagarin";

/* Документная версия КП «Гагарина» — второй вариант отображения того же
   предложения (контент общий, `lib/kp/gagarin.ts`). Светлый лист, сериф,
   18px/140%: КП читают целиком и печатают, а аудитория нетехническая.
   Стили — scoped-класс `.kp-doc` в globals.css (санкционированное
   исключение из §2 канона, объяснено там же). */

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
  title: "КП для школы «Гагарин» — документная версия",
  description:
    "Коммерческое предложение AICS-93 школе «Гагарин» в виде документа: механики платформы, педагогический смысл, доходная часть и окупаемость.",
  robots: { index: false, follow: false },
};

/* Заголовок секции: глазок + волосяная линия до конца листа. */
function Rule({ children }: { children: React.ReactNode }) {
  return (
    <div className="doc-rule mb-5">
      <span className="doc-eyebrow whitespace-nowrap">{children}</span>
    </div>
  );
}

export default function KpGagarinDocPage() {
  return (
    <div className={`${playfair.variable} ${lora.variable} px-4 py-10 sm:px-6 sm:py-14`}>
      <KpChapterNav items={TOC.map((t) => ({ ...t, id: `doc-${t.id}` }))} />

      {/* лист бумаги на тёмной сцене студии */}
      <article
        className="kp-doc mx-auto w-full max-w-[860px] overflow-hidden rounded-[14px] px-6 py-12 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] sm:px-14 sm:py-16"
      >
        {/* ---------- шапка документа ---------- */}
        <header className="border-b-2 border-[color:var(--paper-ink)] pb-8">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <GagarinMark tone="paper" />
              <div>
                <p className="font-display text-[19px] font-semibold tracking-[0.06em]">ГАГАРИН</p>
                <p className="doc-soft text-[13px] uppercase tracking-[0.08em]">
                  школа русского и английского языка
                </p>
              </div>
            </div>
            <KpViewSwitch base={KP_BASE} active="doc" tone="paper" />
          </div>

          <p className="doc-eyebrow">Коммерческое предложение</p>
          <h1 className="mt-3 text-[clamp(28px,5.4vw,42px)]">{KP_META.h1}</h1>
          <p className="mt-4 text-[20px] leading-[1.45]">{KP_META.lead}</p>
          <div className="doc-soft mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[15px]">
            <span>
              Кому: <span className="font-semibold text-[color:var(--paper-ink)]">школа «Гагарин»</span>
            </span>
            <span>
              Дата: <span className="font-semibold text-[color:var(--paper-ink)]">{KP_META.date}</span>
            </span>
            <span>
              Стоимость:{" "}
              <span className="font-semibold text-[color:var(--paper-ink)]">
                {KP_META.price}, можно частями
              </span>
            </span>
            <span>
              Срок: <span className="font-semibold text-[color:var(--paper-ink)]">{KP_META.term}</span>
            </span>
          </div>

          <nav aria-label="Содержание" className="mt-7">
            <p className="doc-eyebrow">Содержание</p>
            <div className="mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
              {TOC.map((t) => (
                <a
                  key={t.id}
                  href={`#doc-${t.id}`}
                  className="group flex items-baseline gap-3 text-[16px] transition-colors"
                >
                  <span className="font-display text-[13px] text-[color:var(--paper-accent)]">{t.num}</span>
                  <span className="doc-soft transition-colors group-hover:text-[color:var(--paper-ink)] group-hover:underline">
                    {t.label}
                  </span>
                </a>
              ))}
            </div>
          </nav>
        </header>

        {/* ---------- 01 что это ---------- */}
        <section id="doc-what" className="scroll-mt-8 pt-12">
          <Rule>01 · что это такое</Rule>
          <h2 className="text-[22px]">
            Такая же платформа, как та, что вам понравилась — только ваша и про языки
          </h2>
          <div className="mt-5 space-y-3.5">
            {WHAT_PARAS.map((p) => {
              const [before, after] = p.strong ? p.text.split(p.strong) : [p.text, ""];
              return (
                <p key={p.text} className="doc-soft">
                  {before}
                  {p.strong ? (
                    <span className="font-semibold text-[color:var(--paper-ink)]">{p.strong}</span>
                  ) : null}
                  {after}
                </p>
              );
            })}
          </div>
          <div className="doc-card mt-6 p-6">
            <p className="doc-eyebrow">Откуда берётся скорость</p>
            {SPEED_NOTE.map((t) => (
              <p key={t} className="doc-soft mt-3 text-[17px]">
                {t}
              </p>
            ))}
          </div>
        </section>

        {/* ---------- 02 что умеет ---------- */}
        <section id="doc-features" className="scroll-mt-8 pt-14">
          <Rule>02 · что умеет платформа</Rule>
          <h2 className="text-[22px]">Восемь механик, которые уже работают</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="doc-card p-5">
                <h3 className="text-[18px]">{f.title}</h3>
                <p className="doc-soft mt-2 text-[16px]">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 03 педагогика ---------- */}
        <section id="doc-pedagogy" className="scroll-mt-8 pt-14">
          <Rule>03 · зачем это педагогически</Rule>
          <h2 className="text-[22px]">
            Платформа не заменяет преподавателя. Она забирает то, что мешает преподавать
          </h2>
          <ul className="mt-6 space-y-5">
            {PEDAGOGY.map((p) => (
              <li
                key={p.lead}
                className="border-l-2 pl-5"
                style={{ borderColor: "var(--paper-accent)" }}
              >
                <p className="font-semibold">{p.lead}</p>
                <p className="doc-soft mt-1.5 text-[17px]">{p.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- 04 своя или аренда ---------- */}
        <section id="doc-own" className="scroll-mt-8 pt-14">
          <Rule>04 · своя или аренда</Rule>
          <h2 className="text-[22px]">Почему своя платформа, а не готовый сервис за подписку</h2>
          <div className="doc-card mt-6 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-[16px]">
              <thead>
                <tr>
                  <th className="w-[140px] border-b border-[color:var(--paper-line)] px-5 py-3.5" />
                  <th className="border-b border-[color:var(--paper-line)] px-5 py-3.5 text-left">
                    <span className="doc-eyebrow">своя платформа</span>
                  </th>
                  <th className="border-b border-[color:var(--paper-line)] px-5 py-3.5 text-left">
                    <span className="doc-soft text-[12px] font-semibold uppercase tracking-[0.14em]">
                      аренда сервиса
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((c) => (
                  <tr key={c.row}>
                    <td className="doc-soft border-b border-[color:var(--paper-line)] px-5 py-3.5 align-top">
                      {c.row}
                    </td>
                    <td className="border-b border-[color:var(--paper-line)] px-5 py-3.5 align-top font-medium">
                      {c.own}
                    </td>
                    <td className="doc-soft border-b border-[color:var(--paper-line)] px-5 py-3.5 align-top">
                      {c.rent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="doc-soft mt-5 rounded-[10px] bg-[color:var(--paper-2)] p-5 text-[17px]">
            {UPKEEP_NOTE}
          </p>
        </section>

        {/* ---------- 05 доходная часть ---------- */}
        <section id="doc-revenue" className="scroll-mt-8 pt-14">
          <Rule>05 · сколько может приносить</Rule>
          <h2 className="text-[22px]">Платформа — не расход, а новый продукт школы</h2>
          <p className="doc-soft mt-4">
            Вот из чего складывается её месячный доход. Цифры нарочно скромные — подставьте свои.
          </p>
          <div className="mt-6">
            <RevenueBar segments={SEGMENTS_PAPER} caption={REVENUE_CAPTION} tone="paper" />
          </div>
        </section>

        {/* ---------- 06 окупаемость ---------- */}
        <section id="doc-payback" className="scroll-mt-8 pt-14">
          <Rule>06 · когда окупится</Rule>
          <h2 className="text-[22px]">Даже если сработает только один источник</h2>
          <div className="doc-card mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-[16px]">
              <thead>
                <tr>
                  {["если работает…", "доход в месяц", "80 000 ₽ вернутся через"].map((h) => (
                    <th
                      key={h}
                      className="doc-soft border-b border-[color:var(--paper-line)] px-5 py-3.5 text-left text-[12px] font-semibold uppercase tracking-[0.12em]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PAYBACK.map((p) => (
                  <tr key={p.when}>
                    <td className="doc-soft border-b border-[color:var(--paper-line)] px-5 py-3.5 align-top">
                      {p.when}
                    </td>
                    <td className="font-display doc-money border-b border-[color:var(--paper-line)] px-5 py-3.5 align-top font-semibold [font-variant-numeric:tabular-nums]">
                      {p.month}
                    </td>
                    <td className="font-display border-b border-[color:var(--paper-line)] px-5 py-3.5 align-top font-semibold text-[color:var(--paper-accent)]">
                      {p.back}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="doc-soft mt-5 rounded-[10px] bg-[color:var(--paper-2)] p-5 text-[17px]">
            {PAYBACK_NOTE}
          </p>
        </section>

        {/* ---------- 07 цена ---------- */}
        <section id="doc-price" className="scroll-mt-8 pt-14">
          <Rule>07 · стоимость и оплата</Rule>
          <div className="doc-card p-7">
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span className="font-display doc-money text-[clamp(32px,6vw,48px)] font-semibold leading-none">
                {KP_META.price}
              </span>
              <span className="doc-soft">окончательная цена, без скрытых доплат</span>
            </div>
            <p className="doc-soft mt-5 text-[17px]">{PRICE_NOTE}</p>
          </div>
          <div className="mt-4 grid items-start gap-4 sm:grid-cols-2">
            {PLANS.map((pl, i) => (
              <div
                key={pl.title}
                className="doc-card p-6"
                style={i === 0 ? { borderColor: "var(--paper-accent)" } : undefined}
              >
                <p className="doc-eyebrow">{pl.tag}</p>
                <h3 className="mt-2.5 text-[18px]">{pl.title}</h3>
                <ol className="mt-4 space-y-2.5">
                  {pl.steps.map((s, k) => (
                    <li key={k} className="doc-soft text-[16px]">
                      <span className="font-display font-semibold text-[color:var(--paper-ink)]">
                        {s.sum}
                      </span>{" "}
                      — {s.text}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 08 план ---------- */}
        <section id="doc-plan" className="scroll-mt-8 pt-14">
          <Rule>08 · как пойдёт работа</Rule>
          <h2 className="text-[22px]">Четыре шага, 2–3 недели</h2>
          <div className="mt-6">
            {STAGES.map((s, i) => (
              <div
                key={s.title}
                className="grid grid-cols-[44px_1fr] gap-4 border-b border-[color:var(--paper-line)] py-5 last:border-b-0"
              >
                <span className="font-display pt-0.5 text-[15px] font-semibold text-[color:var(--paper-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3 className="text-[18px]">{s.title}</h3>
                    <span className="doc-money text-[14px] font-semibold">· {s.dur}</span>
                  </div>
                  <p className="doc-soft mt-1.5 text-[17px]">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 09 что нужно ---------- */}
        <section id="doc-need" className="scroll-mt-8 pt-14">
          <Rule>09 · что нужно от школы</Rule>
          <h2 className="text-[22px]">Четыре вещи — и мы стартуем</h2>
          <ul className="mt-6 space-y-3.5">
            {NEED.map((n) => (
              <li key={n} className="grid grid-cols-[22px_1fr] gap-3.5">
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className="mt-[5px]">
                  <path
                    d="M4 10.5l4 4 8-9"
                    fill="none"
                    stroke="var(--paper-accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="doc-soft text-[17px]">{n}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- подпись ---------- */}
        <footer className="mt-14 border-t-2 border-[color:var(--paper-ink)] pt-6">
          <p className="font-semibold">Василий Аистов · aistov@evo.center</p>
          <p className="doc-soft mt-1.5 text-[17px]">
            Платформу-основу можно посмотреть вживую до любого решения: learn.ximi4ka.ru. С
            удовольствием проведу созвон и покажу, как всё устроено изнутри.
          </p>
          <p className="doc-soft mt-5 text-[15px]">
            Ответить на предложение можно прямо ниже — четыре вопроса вместо переписки.
          </p>
        </footer>
      </article>

      {/* квиз остаётся студийным: он про действие, а не про чтение */}
      <div className="mt-12">
        <QuizInline source="kp_gagarin_doc" title={QUIZ.title} text={QUIZ.text} steps={QUIZ.steps()} />
      </div>
    </div>
  );
}
