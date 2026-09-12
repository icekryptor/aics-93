import type { Metadata } from "next";
import Link from "next/link";
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

/* КП «Свой канал продаж для BIGSNT» — студийный вид (тёмная сцена, канон ДС).
   Второй вид — /kp/bigsnt/doc (светлый лист, сериф). Контент общий: lib/kp/bigsnt.ts.

   Аудитория — производитель спортпита, живущий на маркетплейсах: словарь
   площадок им родной, объясняем только то, что считаем (СПП в модели). */

export const metadata: Metadata = {
  title: "КП «Свой канал продаж для BIGSNT» — AICS-93",
  description:
    "Коммерческое предложение AICS-93 для BIGSNT: аудит сайта, экономика заказа на маркетплейсе и на своём сайте, три объёма работ, план и стоимость.",
  robots: { index: false, follow: false },
};

const CHIP: React.CSSProperties = {
  clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
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

const TAG_COLOR: Record<string, string> = {
  критично: "#ff7050",
  дизайн: "var(--color-signal-2)",
  контент: "var(--color-signal-2)",
  удержание: "#5fd9f5",
  актив: "#c5ff44",
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
    <h2 className="mt-4 max-w-3xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">{children}</h2>
  );
}
function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden className="mt-[5px]">
      <path d="M4 10.5l4 4 8-9" fill="none" stroke="#5fd9f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function KpBigsntPage() {
  return (
    <div className="text-runtime-ink">
      <KpChapterNav items={TOC} />

      {/* ---------- hero ---------- */}
      <div className="relative overflow-hidden">
        <div className="runtime-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-20 sm:px-8 sm:pt-28">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <span className="tech-label inline-flex items-center gap-2 text-[0.72rem]" style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}>
              <span className="hud-dot" style={{ display: "inline-block" }} />
              коммерческое предложение · <span className="font-display">aics-93</span> · для bigsnt
            </span>
            <KpViewSwitch base={KP_BASE} active="studio" />
          </div>

          <h1 className="mt-8 max-w-4xl text-[clamp(2rem,4.6vw,3.3rem)] font-semibold leading-[1.05] tracking-tight">{KP_META.h1}</h1>
          <p className="mt-5 max-w-3xl text-[1.07rem] leading-relaxed text-runtime-ink-soft">{KP_META.lead}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {KP_META.chips.map((c) => (
              <span key={c} className="tech-label rounded-full border border-runtime-line bg-black/30 px-3.5 py-1.5 text-[11px] text-runtime-ink-soft">{c}</span>
            ))}
          </div>
          <p className="tech-label mt-4 text-[11px] text-runtime-ink-soft">
            {KP_META.date} · действительно до {KP_META.validUntil} · Василий Аистов
          </p>

          <nav aria-label="Содержание" className="mt-10 max-w-4xl">
            <p className="tech-label text-[0.68rem] text-runtime-ink-soft">[ содержание ]</p>
            <div className="mt-3 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {TOC.map((t) => (
                <a key={t.id} href={`#${t.id}`} className="group flex items-baseline gap-2.5 rounded-[3px] px-2 py-1.5 transition-colors hover:bg-white/[0.05]">
                  <span className="hud text-[10px]" style={{ color: "var(--color-signal-2)" }}>{t.num}</span>
                  <span className="tech-label text-[12.5px] text-runtime-ink-soft transition-colors group-hover:text-runtime-ink">{t.label}</span>
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
        {/* ---------- 01 что увидел ---------- */}
        <section id="task" className="scroll-mt-28 pt-14">
          <Eyebrow>01 · что увидел · 05.09.2026</Eyebrow>
          <H2>Сайт есть, но он не продаёт — он отправляет на Wildberries</H2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-[20px] border border-runtime-line bg-runtime-line sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.v} className="p-5" style={{ background: "rgba(23,16,41,0.6)" }}>
                <p className="font-display text-[1.6rem] leading-none" style={{ color: f.tone === "warm" ? "#ff7050" : "var(--color-signal-2)" }}>{f.v}</p>
                <p className="mt-3 text-[14.5px] leading-relaxed text-runtime-ink-soft">{f.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 max-w-3xl space-y-4 text-[16.5px] leading-relaxed text-runtime-ink-soft">
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
        </section>

        {/* ---------- 02 аудит ---------- */}
        <section id="audit" className="scroll-mt-28 pt-16">
          <Eyebrow>02 · аудит сайта · путь покупателя</Eyebrow>
          <H2>Что видит человек, который кликнул по вашему объявлению</H2>
          <p className="mt-5 max-w-3xl text-[16.5px] leading-relaxed text-runtime-ink-soft">{AUDIT_LEAD}</p>
          <blockquote className="mt-6 max-w-3xl border-l-2 pl-5" style={{ borderColor: "#ff7050" }}>
            <p className="text-[18px] leading-snug text-runtime-ink">«{AUDIT_QUOTE.text}»</p>
            <p className="hud mt-2 text-[10.5px] text-runtime-ink-soft">{AUDIT_QUOTE.meta}</p>
          </blockquote>

          <div className="mt-8 grid gap-4">
            {AUDIT_ROWS.map((r) => (
              <div key={r.what} className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_1fr_minmax(200px,260px)]" style={CARD}>
                <div>
                  <span className="tech-label inline-block rounded-[3px] px-2 py-0.5 text-[10.5px]" style={{ border: `1px solid ${TAG_COLOR[r.tag]}`, color: TAG_COLOR[r.tag] }}>{r.tag}</span>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-runtime-ink">{r.what}</p>
                </div>
                <div>
                  <p className="tech-label text-[10.5px] text-runtime-ink-soft">что это стоит бизнесу</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-runtime-ink-soft">{r.cost}</p>
                </div>
                {r.shot ? (
                  <figure className="m-0 lg:justify-self-end">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.shot.src}
                      alt={r.shot.alt}
                      loading="lazy"
                      className="block rounded-[10px] border border-runtime-line"
                      style={r.shot.ratio === "mobile" ? { width: 150, height: "auto" } : { width: "100%", height: "auto" }}
                    />
                    <figcaption className="hud mt-2 text-[9.5px] text-runtime-ink-soft">{r.shot.caption}</figcaption>
                  </figure>
                ) : (
                  <div className="hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 03 экономика ---------- */}
        <section id="unit" className="scroll-mt-28 pt-16">
          <Eyebrow>03 · экономика заказа · маркетплейс против своего сайта</Eyebrow>
          <H2>Куда уходит каждый рубль с продажи одной банки</H2>
          <p className="mt-5 max-w-3xl text-[16.5px] leading-relaxed text-runtime-ink-soft">{UNIT_LEAD}</p>
          <div className="mt-8"><BigsntUnitEconomics /></div>
          <div className="mt-6 p-5 sm:p-6" style={{ ...CHIP, border: "1px solid var(--color-signal-cool)", background: "rgba(151,71,255,0.07)" }}>
            <Eyebrow>что из этого следует</Eyebrow>
            <p className="mt-3 max-w-4xl text-[15.5px] leading-relaxed text-runtime-ink-soft">{UNIT_NOTE}</p>
          </div>
        </section>

        {/* ---------- 04 директ ---------- */}
        <section id="direct" className="scroll-mt-28 pt-16">
          <Eyebrow>04 · яндекс директ · сейчас и после</Eyebrow>
          <H2>Тот же бюджет — другое количество заказов</H2>
          <p className="mt-5 max-w-3xl text-[16.5px] leading-relaxed text-runtime-ink-soft">{DIRECT_LEAD}</p>
          <div className="mt-8"><BigsntDirect /></div>
        </section>

        {/* ---------- 05 три объёма ---------- */}
        <section id="offer" className="scroll-mt-28 pt-16">
          <Eyebrow>05 · три объёма работ</Eyebrow>
          <H2>Что предлагаю сделать</H2>
          <p className="mt-5 max-w-3xl text-[16.5px] leading-relaxed text-runtime-ink-soft">{OFFER_LEAD}</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {TIERS.map((t) => (
              <article key={t.key} className="relative flex flex-col p-5 sm:p-6" style={t.rec ? { ...CARD, border: "1px solid var(--color-signal-cool)" } : CARD}>
                {t.rec ? (
                  <span className="tech-label absolute -top-3 left-5 rounded-[3px] px-2.5 py-1 text-[10px]" style={{ background: "#5fd9f5", color: "#0b1e33" }}>рекомендую</span>
                ) : null}
                <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>{t.num} · {t.name}</p>
                <h3 className="mt-2 text-[18px] font-semibold leading-snug text-runtime-ink">{t.title}</h3>
                <p className="font-display mt-4 text-[1.7rem] leading-none" style={{ color: "var(--color-signal-2)" }}>{t.price}</p>
                <p className="hud mt-1.5 text-[10.5px] text-runtime-ink-soft">{t.hours} ч × 5 000 ₽ · {t.days}</p>
                <p className="mt-4 border-b border-runtime-line pb-4 text-[14.5px] leading-relaxed text-runtime-ink-soft">{t.forWhom}</p>
                <ul className="mt-4 grid flex-1 content-start gap-2.5">
                  {t.items.map((it) => (
                    <li key={it.text} className="grid grid-cols-[1fr_auto] items-baseline gap-3">
                      <span className={`text-[14.5px] leading-relaxed ${it.inherit ? "italic text-runtime-ink-soft/70" : "text-runtime-ink-soft"}`}>{it.text}</span>
                      <span className="hud text-[10.5px] text-runtime-ink-soft">{it.h} ч</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-4xl text-[15.5px] leading-relaxed text-runtime-ink-soft">{OFFER_NOTE}</p>
        </section>

        {/* ---------- 06 план ---------- */}
        <section id="plan" className="scroll-mt-28 pt-16">
          <Eyebrow>06 · план работ · пять этапов, параллельные дорожки</Eyebrow>
          <H2>Как пройдут эти недели</H2>
          <p className="mt-5 max-w-3xl text-[16.5px] leading-relaxed text-runtime-ink-soft">{PLAN_LEAD}</p>
          <div className="mt-8"><BigsntPlan /></div>
          <p className="mt-4 max-w-4xl text-[14.5px] leading-relaxed text-runtime-ink-soft">{PLAN_CAPTION}</p>
        </section>

        {/* ---------- 07 стоимость ---------- */}
        <section id="price" className="scroll-mt-28 pt-16">
          <Eyebrow>07 · стоимость и условия</Eyebrow>
          <H2>
            <span className="font-display">320 / 500 / 750</span> тысяч рублей — по объёму, без сюрпризов
          </H2>
          <p className="mt-5 max-w-3xl text-[16.5px] leading-relaxed text-runtime-ink-soft">{PRICE_LEAD}</p>
          <div className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRICE_TERMS.map((t) => (
              <div key={t.t} className="border-l-2 pl-5" style={{ borderColor: "var(--color-signal)" }}>
                <p className="text-[16px] font-semibold leading-snug text-runtime-ink">{t.t}</p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-runtime-ink-soft">{t.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="p-5 sm:p-6" style={CARD}>
              <h3 className="text-[17px] font-semibold text-runtime-ink">Нужно от вас</h3>
              <ul className="mt-4 grid gap-2.5">
                {ROLE_YOURS.map((x) => (
                  <li key={x} className="grid grid-cols-[18px_1fr] gap-3"><Check /><span className="text-[15px] leading-relaxed text-runtime-ink-soft">{x}</span></li>
                ))}
              </ul>
            </div>
            <div className="p-5 sm:p-6" style={{ ...CHIP, border: "1px solid #ff7050", background: "rgba(255,112,80,0.07)" }}>
              <p className="tech-label text-[0.68rem]" style={{ color: "#ff7050" }}>[ чего я не делаю ]</p>
              <ul className="mt-3 grid gap-2">
                {ROLE_NOT.map((x) => (
                  <li key={x} className="text-[15px] leading-relaxed text-runtime-ink-soft">— {x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- 08 кто делает ---------- */}
        <section id="studio" className="scroll-mt-28 pt-16">
          <Eyebrow>08 · кто делает</Eyebrow>
          <H2><span className="font-display">AICS-93</span> · Василий Аистов</H2>
          <p className="mt-5 max-w-3xl text-[16.5px] leading-relaxed text-runtime-ink-soft">{STUDIO_LEAD}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CASES.map((c) => (
              <Link key={c.name} href={c.href} className="group flex flex-col overflow-hidden transition-colors hover:border-[color:var(--color-signal-cool)]" style={CARD}>
                {c.shot ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.shot} alt={`Сайт ${c.name}`} loading="lazy" className="block aspect-[16/10] w-full object-cover object-top" />
                ) : (
                  <div className="aspect-[16/10] w-full" style={{ background: "linear-gradient(135deg, rgba(151,71,255,0.25), rgba(95,217,245,0.12))" }} aria-hidden />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[16px] font-semibold text-runtime-ink">{c.name}</p>
                  <p className="tech-label mt-1 text-[10.5px]" style={{ color: "var(--color-signal-2)" }}>{c.meta}</p>
                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-runtime-ink-soft">{c.text}</p>
                  <span className="tech-label mt-4 text-[11px] text-runtime-ink-soft transition-colors group-hover:text-runtime-ink">смотреть кейс →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {STUDIO_FACTS.map((f) => (
              <span key={f} className="tech-label rounded-full border border-runtime-line bg-black/30 px-3.5 py-1.5 text-[11px] text-runtime-ink-soft">{f}</span>
            ))}
          </div>
        </section>

        {/* ---------- 09 вопросы и источники ---------- */}
        <section id="faq" className="scroll-mt-28 pt-16">
          <Eyebrow>09 · вопросы и источники</Eyebrow>
          <H2>Что обычно спрашивают</H2>
          <div className="mt-8 max-w-4xl">
            {FAQ.map((f) => (
              <details key={f.q} className="faq-acc border-b border-runtime-line">
                <summary className="cursor-pointer py-4 text-[16.5px] font-semibold text-runtime-ink">{f.q}</summary>
                <p className="pb-4 text-[15.5px] leading-relaxed text-runtime-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 max-w-4xl p-5 sm:p-6" style={PANEL}>
            <p className="tech-label text-[0.68rem] text-runtime-ink-soft">[ данные и источники ]</p>
            <ul className="mt-3 grid gap-1.5">
              {SOURCES.map((s) => (
                <li key={s.href} className="text-[14.5px] leading-relaxed text-runtime-ink-soft">
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline decoration-1 underline-offset-2 transition-colors hover:text-runtime-ink">{s.label}</a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[14.5px] leading-relaxed text-runtime-ink-soft">{SOURCES_NOTE}</p>
          </div>
        </section>
      </div>

      {/* ---------- квиз вместо формы: ответы уходят Тихоном ---------- */}
      <QuizInline source="kp_bigsnt" title={QUIZ.title} text={QUIZ.text} steps={QUIZ.steps()} />
    </div>
  );
}
