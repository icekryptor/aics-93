import type { Metadata } from "next";
import QuizInline from "@/components/QuizInline";
import RevenueBar from "@/components/kp/RevenueBar";
import KpViewSwitch from "@/components/kp/KpViewSwitch";
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
  SEGMENTS,
  REVENUE_CAPTION,
  PAYBACK,
  PAYBACK_NOTE,
  PRICE_NOTE,
  PLANS,
  STAGES,
  NEED,
  QUIZ,
} from "@/lib/kp/gagarin";

/* КП для школы «Гагарин» — студийный вид (тёмная сцена, канон ДС).
   Второй вариант отображения того же предложения — /kp/gagarin/doc
   (светлый лист, сериф). Контент общий: lib/kp/gagarin.ts.
   Аудитория нетехническая (преподаватели-гуманитарии), поэтому
   технический словарь запрещён, а body 16.5px вместо 15px. */

export const metadata: Metadata = {
  title: "КП для школы «Гагарин» — своя учебная платформа",
  description:
    "Коммерческое предложение AICS-93: учебная платформа для школы русского и английского языка «Гагарин» — механики, педагогический смысл, доходная часть и окупаемость.",
  robots: { index: false, follow: false },
};

const CHIP: React.CSSProperties = {
  clipPath:
    "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
};

export default function KpGagarinPage() {
  return (
    <div className="text-runtime-ink">
      {/* ---------- hero ---------- */}
      <div className="relative overflow-hidden">
        <div className="runtime-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-20 sm:px-8 sm:pt-28">
          <span
            className="tech-label inline-flex items-center gap-2 text-[0.72rem]"
            style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
          >
            <span className="hud-dot" style={{ display: "inline-block" }} />
            коммерческое предложение · aics-93 → школа «гагарин»
          </span>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <GagarinMark />
              <div>
                <p className="font-display text-[20px] font-semibold tracking-[0.06em] text-runtime-ink">
                  ГАГАРИН
                </p>
                <p className="tech-label text-[11.5px] text-runtime-ink-soft">
                  школа русского и английского языка
                </p>
              </div>
            </div>
            <KpViewSwitch base={KP_BASE} active="studio" />
          </div>

          <h1 className="mt-8 max-w-3xl text-[clamp(2rem,4.6vw,3.3rem)] font-semibold leading-[1.05] tracking-tight">
            Своя учебная платформа для школы <span className="signal-text">«Гагарин»</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[1.07rem] leading-relaxed text-runtime-ink-soft">
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

          {/* содержание */}
          <nav aria-label="Содержание" className="mt-10 max-w-3xl">
            <p className="tech-label text-[0.68rem] text-runtime-ink-soft">[ содержание ]</p>
            <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {TOC.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className="group flex items-baseline gap-2.5 rounded-[3px] px-2 py-1.5 transition-colors hover:bg-white/[0.05]"
                >
                  <span className="hud text-[10px]" style={{ color: "var(--color-signal-2)" }}>
                    {t.num}
                  </span>
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
        {/* ---------- 01 что это ---------- */}
        <section id="what" className="scroll-mt-28 pt-14">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 01 · что это такое ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Такая же платформа, как та, что вам понравилась — только ваша и про языки
          </h2>
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.15fr_1fr]">
            <div className="space-y-4 text-[16.5px] leading-relaxed text-runtime-ink-soft">
              {WHAT_PARAS.map((par) => {
                const [before, after] = par.strong ? par.text.split(par.strong) : [par.text, ""];
                return (
                  <p key={par.text}>
                    {before}
                    {par.strong ? <span className="text-runtime-ink">{par.strong}</span> : null}
                    {after}
                  </p>
                );
              })}
            </div>
            <div
              className="p-5 sm:p-6"
              style={{ ...CHIP, border: "1px solid var(--color-runtime-line)", background: "rgba(23,16,41,0.4)" }}
            >
              <p className="tech-label text-[0.68rem]" style={{ color: "var(--color-signal-2)" }}>
                [ откуда берётся скорость ]
              </p>
              {SPEED_NOTE.map((t) => (
                <p key={t} className="mt-3 text-[15px] leading-relaxed text-runtime-ink-soft">
                  {t}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 02 что умеет ---------- */}
        <section id="features" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 02 · что умеет платформа ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Восемь механик, которые уже работают
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-5 sm:p-6"
                style={{
                  borderRadius: "20px",
                  border: "1px solid var(--color-runtime-line)",
                  background: "rgba(23,16,41,0.4)",
                }}
              >
                <h3 className="text-[17px] font-semibold leading-snug text-runtime-ink">{f.title}</h3>
                <p className="mt-2.5 text-[15.5px] leading-relaxed text-runtime-ink-soft">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 03 педагогика ---------- */}
        <section id="pedagogy" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 03 · зачем это педагогически ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Платформа не заменяет преподавателя. Она забирает то, что мешает преподавать
          </h2>
          <div className="mt-8 grid gap-x-10 gap-y-6 lg:grid-cols-2">
            {PEDAGOGY.map((p) => (
              <div key={p.lead} className="border-l-2 pl-5" style={{ borderColor: "var(--color-signal)" }}>
                <p className="text-[16.5px] font-semibold leading-snug text-runtime-ink">{p.lead}</p>
                <p className="mt-2 text-[15.5px] leading-relaxed text-runtime-ink-soft">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 04 своя или аренда ---------- */}
        <section id="own" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 04 · своя или аренда ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Почему своя платформа, а не готовый сервис за подписку
          </h2>
          <div
            className="mt-8 overflow-x-auto"
            style={{
              borderRadius: "20px",
              border: "1px solid var(--color-runtime-line)",
              background: "rgba(23,16,41,0.4)",
            }}
          >
            <table className="w-full min-w-[640px] border-collapse text-[15.5px]">
              <thead>
                <tr>
                  <th className="w-[150px] border-b border-runtime-line px-5 py-4 text-left" />
                  <th className="border-b border-runtime-line px-5 py-4 text-left">
                    <span className="tech-label text-[11.5px]" style={{ color: "var(--color-signal-2)" }}>
                      своя платформа · это предложение
                    </span>
                  </th>
                  <th className="border-b border-runtime-line px-5 py-4 text-left">
                    <span className="tech-label text-[11.5px] text-runtime-ink-soft">
                      аренда готового сервиса
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((c) => (
                  <tr key={c.row}>
                    <td className="border-b border-runtime-line px-5 py-4 align-top text-runtime-ink-soft">
                      {c.row}
                    </td>
                    <td className="border-b border-runtime-line px-5 py-4 align-top text-runtime-ink">
                      {c.own}
                    </td>
                    <td className="border-b border-runtime-line px-5 py-4 align-top text-runtime-ink-soft">
                      {c.rent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-3xl text-[15.5px] leading-relaxed text-runtime-ink-soft">
            {UPKEEP_NOTE}
          </p>
        </section>

        {/* ---------- 05 доходная часть ---------- */}
        <section id="revenue" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 05 · сколько может приносить ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Платформа — не расход, а новый продукт школы
          </h2>
          <p className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-runtime-ink-soft">
            Вот из чего складывается её месячный доход. Цифры нарочно скромные — подставьте свои.
          </p>
          <div className="mt-8">
            <RevenueBar
              segments={SEGMENTS}
              caption={REVENUE_CAPTION}
            />
          </div>
        </section>

        {/* ---------- 06 окупаемость ---------- */}
        <section id="payback" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 06 · когда окупится ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Даже если сработает только один источник
          </h2>
          <div
            className="mt-8 overflow-x-auto"
            style={{
              borderRadius: "20px",
              border: "1px solid var(--color-runtime-line)",
              background: "rgba(23,16,41,0.4)",
            }}
          >
            <table className="w-full min-w-[560px] border-collapse text-[15.5px]">
              <thead>
                <tr>
                  <th className="border-b border-runtime-line px-5 py-4 text-left">
                    <span className="tech-label text-[11.5px] text-runtime-ink-soft">если работает…</span>
                  </th>
                  <th className="border-b border-runtime-line px-5 py-4 text-left">
                    <span className="tech-label text-[11.5px] text-runtime-ink-soft">доход в месяц</span>
                  </th>
                  <th className="border-b border-runtime-line px-5 py-4 text-left">
                    <span className="tech-label text-[11.5px] text-runtime-ink-soft">80 000 ₽ вернутся через</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {PAYBACK.map((p) => (
                  <tr key={p.when}>
                    <td className="border-b border-runtime-line px-5 py-4 align-top text-runtime-ink-soft">
                      {p.when}
                    </td>
                    <td className="font-display border-b border-runtime-line px-5 py-4 align-top font-semibold text-runtime-ink">
                      {p.month}
                    </td>
                    <td
                      className="font-display border-b border-runtime-line px-5 py-4 align-top font-semibold"
                      style={{ color: "#5fd9f5" }}
                    >
                      {p.back}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-3xl text-[15.5px] leading-relaxed text-runtime-ink-soft">
            {PAYBACK_NOTE}
          </p>
        </section>

        {/* ---------- 07 цена ---------- */}
        <section id="price" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 07 · стоимость и оплата ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            80 000 ₽ — окончательная цена, без скрытых доплат
          </h2>

          <div
            className="mt-8 p-6 sm:p-8"
            style={{
              borderRadius: "25px 55px 55px 5px",
              border: "1px solid rgba(151,71,255,0.35)",
              background:
                "radial-gradient(120% 140% at 88% 0%, rgba(151,71,255,0.16), transparent 60%), rgba(23,16,41,0.6)",
            }}
          >
            <p className="font-display text-[clamp(2.2rem,6vw,3.4rem)] font-semibold leading-none text-runtime-ink">
              80 000 ₽
            </p>
            <p className="mt-5 max-w-2xl text-[16.5px] leading-relaxed text-runtime-ink-soft">
              {PRICE_NOTE}
            </p>
          </div>

          <div className="mt-5 grid items-start gap-4 sm:grid-cols-2">
            {PLANS.map((pl, i) => (
              <div
                key={pl.title}
                className="p-6"
                style={{
                  borderRadius: "20px",
                  border:
                    i === 0 ? "1px solid rgba(151,71,255,0.45)" : "1px solid var(--color-runtime-line)",
                  background: i === 0 ? "rgba(23,16,41,0.5)" : "rgba(23,16,41,0.4)",
                }}
              >
                <p
                  className="tech-label text-[11px]"
                  style={i === 0 ? { color: "var(--color-signal-2)" } : undefined}
                >
                  [ {pl.tag} ]
                </p>
                <h3 className="mt-3 text-[18px] font-semibold text-runtime-ink">{pl.title}</h3>
                <ul className="mt-4 space-y-2.5 text-[15.5px] leading-relaxed text-runtime-ink-soft">
                  {pl.steps.map((st) => (
                    <li key={st.text}>
                      <span className="font-display font-semibold text-runtime-ink">{st.sum}</span> —{" "}
                      {st.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 08 план ---------- */}
        <section id="plan" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 08 · как пойдёт работа ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Четыре шага, 2–3 недели
          </h2>
          <div className="mt-8">
            {STAGES.map((s, i) => (
              <div
                key={s.title}
                className="grid grid-cols-[46px_1fr] gap-5 border-b border-runtime-line py-6 last:border-b-0"
              >
                <span
                  className="font-display grid size-[38px] place-items-center rounded-[3px] text-[14px] font-semibold"
                  style={
                    i < 2
                      ? { background: "var(--color-signal)", color: "#ffffff" }
                      : { background: "#5fd9f5", color: "#302055" }
                  }
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-[17.5px] font-semibold text-runtime-ink">{s.title}</h3>
                    <span className="tech-label text-[12px]" style={{ color: "#5fd9f5" }}>
                      · {s.dur}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-[15.5px] leading-relaxed text-runtime-ink-soft">
                    {s.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 09 что нужно от школы ---------- */}
        <section id="need" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 09 · что нужно от школы ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Четыре вещи — и мы стартуем
          </h2>
          <ul className="mt-8 grid max-w-3xl gap-4">
            {NEED.map((n) => (
              <li key={n} className="grid grid-cols-[20px_1fr] gap-4">
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className="mt-[3px]">
                  <path
                    d="M4 10.5l4 4 8-9"
                    fill="none"
                    stroke="#5fd9f5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[16px] leading-relaxed text-runtime-ink-soft">{n}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ---------- квиз вместо формы: ответы уходят Тихоном ---------- */}
      <QuizInline
        source="kp_gagarin"
        title={QUIZ.title}
        text={QUIZ.text}
        steps={QUIZ.steps()}
      />
    </div>
  );
}
