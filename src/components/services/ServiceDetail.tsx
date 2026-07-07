import type { Service } from "@/lib/services";
import SiteBuilderGL from "./SiteBuilderGL";
import StageCaption from "./StageCaption";
import CardSigil from "./CardSigil";
import PipelineSchematic from "./PipelineSchematic";

/* Server-rendered service detail — dark cyber-lab layout. Content-first
   (all copy in SSR HTML for SEO/GEO). No client JS: FAQ uses <details>. */

// 2-corner chamfer (chip language of the DS).
const CHIP: React.CSSProperties = {
  clipPath:
    "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
};

const SHELL = "mx-auto w-full max-w-6xl px-5 sm:px-8";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="tech-label inline-flex items-center gap-2 text-[0.72rem]"
      style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
    >
      <span className="hud-dot" style={{ display: "inline-block" }} />
      {children}
    </span>
  );
}

export default function ServiceDetail({ service: s }: { service: Service }) {
  return (
    <div className="text-runtime-ink">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className={`${SHELL} pt-14 pb-14 sm:pt-20 sm:pb-20`}>
          <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-4">
            {/* copy — heading in Neue Haas (sans), not Unbounded */}
            <div>
              <Eyebrow>{s.hero.eyebrow}</Eyebrow>

              <h1 className="mt-6 max-w-xl text-balance text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.04] tracking-tight">
                {s.hero.h1}
              </h1>

              <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-runtime-ink-soft sm:text-lg">
                {s.hero.subhead}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="#upgrade"
                  data-magnetic
                  data-cursor="route signal"
                  className="signal-grad inline-flex h-12 items-center rounded-full px-7 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                >
                  {s.hero.primaryCta} <span aria-hidden className="ml-2">→</span>
                </a>
                <a
                  href="#upgrade"
                  data-magnetic
                  className="inline-flex h-12 items-center rounded-full border border-runtime-line px-7 text-sm text-runtime-ink transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_60%,transparent)]"
                >
                  {s.hero.secondaryCta}
                </a>
              </div>
            </div>

            {/* 3D site-builder: данные → прототип → реализация (клик — сменить стадию) */}
            <div className="relative h-[320px] w-full sm:h-[400px] lg:h-[560px]">
              <SiteBuilderGL className="h-full w-full" />
              <div className="pointer-events-none absolute inset-x-0 bottom-1 z-10 flex items-center justify-center">
                <StageCaption className="tech-label text-[0.58rem] text-runtime-ink-soft/70" />
              </div>
            </div>
          </div>

          {/* stat strip */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-4">
            {s.hero.stats.map((st) => (
              <div
                key={st.label}
                className="relative p-5"
                style={{
                  ...CHIP,
                  border: "1px solid var(--color-runtime-line)",
                  background: "rgba(23,16,41,0.5)",
                }}
              >
                <div
                  className="signal-text font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-semibold leading-none"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {st.value}
                </div>
                <div className="mt-2 text-[0.8rem] leading-snug text-runtime-ink-soft">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VALUE PROPS ================= */}
      <section className="relative py-16 sm:py-20">
        <div className="signal-seam absolute inset-x-0 top-0" aria-hidden />
        <div className={SHELL}>
          <Eyebrow>преимущества подхода</Eyebrow>
          <h2 className="mt-5 max-w-3xl text-[clamp(1.5rem,3.4vw,2.4rem)] font-semibold leading-tight tracking-tight">
            Почему это быстрее, дешевле и живее классической разработки
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.valueProps.map((v, i) => (
              <article
                key={v.title}
                className="group relative flex h-full flex-col overflow-hidden p-6"
                style={{
                  ...CHIP,
                  border: "1px solid var(--color-runtime-line)",
                  background:
                    "linear-gradient(180deg, rgba(23,16,41,0.6), rgba(14,10,27,0.3))",
                }}
              >
                <CardSigil
                  seed={`vp-${v.title}`}
                  className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 opacity-[0.28] transition-opacity duration-300 group-hover:opacity-60"
                />
                <span
                  className="relative tech-label text-[0.7rem]"
                  style={{ color: "var(--color-signal-2)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-[1.05rem] font-semibold leading-snug">
                  {v.title}
                </h3>
                <p className="mt-2.5 text-[0.92rem] leading-relaxed text-runtime-ink-soft">
                  {v.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="relative py-16 sm:py-20">
        <div className="signal-seam absolute inset-x-0 top-0" aria-hidden />
        <div className={SHELL}>
          <Eyebrow>порядок работы</Eyebrow>
          <h2 className="mt-5 max-w-3xl text-[clamp(1.5rem,3.4vw,2.4rem)] font-semibold leading-tight tracking-tight">
            От брифа до аналитического сопровождения — единый прозрачный контур
          </h2>

          {s.pipeline?.length ? (
            <div
              className="mt-10 hidden overflow-hidden rounded-2xl px-6 py-7 sm:block"
              style={{
                border: "1px solid var(--color-runtime-line)",
                background: "rgba(23,16,41,0.4)",
              }}
            >
              <PipelineSchematic stages={s.pipeline.map((l) => ({ label: l }))} />
            </div>
          ) : null}

          <ol className="mt-12 space-y-0">
            {s.process.map((p, i) => {
              const last = i === s.process.length - 1;
              return (
                <li key={p.title} className="relative grid grid-cols-[auto_1fr] gap-5 sm:gap-7">
                  {/* index + connector */}
                  <div className="relative flex flex-col items-center">
                    <span
                      className="relative z-10 grid size-11 shrink-0 place-items-center font-display text-[0.85rem] font-semibold"
                      style={{
                        ...CHIP,
                        border: "1px solid color-mix(in srgb, var(--color-signal) 45%, transparent)",
                        background: "rgba(151,71,255,0.12)",
                        color: "var(--color-signal-cool)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {!last && (
                      <span
                        aria-hidden
                        className="w-px flex-1"
                        style={{
                          background:
                            "linear-gradient(to bottom, color-mix(in srgb, var(--color-signal) 40%, transparent), transparent)",
                          minHeight: 28,
                        }}
                      />
                    )}
                  </div>

                  {/* body */}
                  <div className={last ? "pb-0" : "pb-9"}>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-[1.1rem] font-semibold leading-snug">
                        {p.title}
                      </h3>
                      {p.duration && (
                        <span
                          className="tech-label rounded-full px-2.5 py-1 text-[0.6rem]"
                          style={{
                            border: "1px solid var(--color-runtime-line)",
                            color: "var(--color-runtime-ink-soft)",
                          }}
                        >
                          {p.duration}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 max-w-2xl text-[0.92rem] leading-relaxed text-runtime-ink-soft">
                      {p.detail}
                    </p>
                    <p className="mt-2.5 flex items-start gap-2 text-[0.9rem] leading-relaxed">
                      <span
                        aria-hidden
                        className="mt-[0.5em] inline-block h-[7px] w-[7px] shrink-0 rounded-full"
                        style={{
                          background:
                            "linear-gradient(92deg, var(--color-signal), var(--color-signal-2))",
                          boxShadow: "0 0 10px rgba(151,71,255,0.8)",
                        }}
                      />
                      <span style={{ color: "var(--color-signal-cool)" }}>{p.benefit}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ================= COMPARISON ================= */}
      <section className="relative py-16 sm:py-20">
        <div className="signal-seam absolute inset-x-0 top-0" aria-hidden />
        <div className={SHELL}>
          <Eyebrow>сравнение</Eyebrow>
          <h2 className="mt-5 max-w-3xl text-[clamp(1.5rem,3.4vw,2.4rem)] font-semibold leading-tight tracking-tight">
            Классическая студия и AICS-93
          </h2>

          <div className="mt-10 overflow-x-auto">
            <div className="min-w-[640px]">
              {/* header */}
              <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-3">
                <div />
                <div className="tech-label px-4 pb-3 text-[0.72rem] text-runtime-ink-soft">
                  классическая студия
                </div>
                <div
                  className="tech-label rounded-t-xl px-4 pb-3 pt-3 text-[0.72rem]"
                  style={{ color: "var(--color-signal-cool)", background: "rgba(151,71,255,0.08)" }}
                >
                  AICS-93
                </div>
              </div>
              {/* rows */}
              <div
                className="overflow-hidden rounded-b-xl"
                style={{ border: "1px solid var(--color-runtime-line)" }}
              >
                {s.comparison.rows.map((r, i) => (
                  <div
                    key={r.metric}
                    className="grid grid-cols-[1.2fr_1fr_1fr] gap-3 px-0"
                    style={{
                      borderTop: i === 0 ? "none" : "1px solid var(--color-runtime-line)",
                    }}
                  >
                    <div className="px-4 py-4 text-[0.9rem] font-medium text-runtime-ink">
                      {r.metric}
                    </div>
                    <div className="px-4 py-4 text-[0.9rem] text-runtime-ink-soft">{r.classic}</div>
                    <div
                      className="px-4 py-4 text-[0.9rem] font-medium text-runtime-ink"
                      style={{ background: "rgba(151,71,255,0.06)" }}
                    >
                      {r.aics}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DELIVERABLES ================= */}
      <section className="relative py-16 sm:py-20">
        <div className="signal-seam absolute inset-x-0 top-0" aria-hidden />
        <div className={SHELL}>
          <Eyebrow>что вы получаете</Eyebrow>
          <h2 className="mt-5 max-w-3xl text-[clamp(1.5rem,3.4vw,2.4rem)] font-semibold leading-tight tracking-tight">
            Не просто сайт, а работающий актив с сопровождением
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {s.deliverables.map((d) => (
              <div
                key={d.title}
                className="signal-glow group relative overflow-hidden p-6"
                style={{
                  ...CHIP,
                  border: "1px solid rgba(151,71,255,0.35)",
                  background:
                    "linear-gradient(180deg, rgba(151,71,255,0.08), rgba(181,123,255,0.03))",
                }}
              >
                <CardSigil
                  seed={`dl-${d.title}`}
                  stroke="rgba(201,182,255,0.6)"
                  className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 opacity-[0.3] transition-opacity duration-300 group-hover:opacity-70"
                />
                <h3 className="relative font-display text-[1.05rem] font-semibold leading-snug">
                  {d.title}
                </h3>
                <p className="mt-2.5 text-[0.92rem] leading-relaxed text-runtime-ink-soft">
                  {d.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="relative py-16 sm:py-20">
        <div className="signal-seam absolute inset-x-0 top-0" aria-hidden />
        <div className={SHELL}>
          <Eyebrow>частые вопросы</Eyebrow>
          <h2 className="mt-5 max-w-3xl text-[clamp(1.5rem,3.4vw,2.4rem)] font-semibold leading-tight tracking-tight">
            Отвечаю на главные вопросы
          </h2>

          <div className="mt-10 max-w-3xl divide-y divide-runtime-line/70 border-y border-runtime-line/70">
            {s.faq.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <span className="font-display text-[1.02rem] font-medium leading-snug text-runtime-ink">
                    {f.q}
                  </span>
                  <span
                    aria-hidden
                    className="mt-1 grid size-6 shrink-0 place-items-center rounded-full text-runtime-ink-soft transition-transform group-open:rotate-45"
                    style={{ border: "1px solid var(--color-runtime-line)" }}
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl pr-10 text-[0.92rem] leading-relaxed text-runtime-ink-soft">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CLOSING ================= */}
      <section className="relative py-16 sm:py-20">
        <div className="signal-seam absolute inset-x-0 top-0" aria-hidden />
        <div className={SHELL}>
          <div
            className="signal-glow relative overflow-hidden p-8 sm:p-12"
            style={{
              ...CHIP,
              border: "1px solid rgba(151,71,255,0.4)",
              background:
                "radial-gradient(120% 120% at 85% 0%, rgba(151,71,255,0.18), transparent 60%), rgba(23,16,41,0.6)",
            }}
          >
            <h2 className="max-w-2xl font-display text-[clamp(1.6rem,3.6vw,2.6rem)] font-semibold leading-tight tracking-tight">
              {s.closing.title}
            </h2>
            <p className="mt-4 max-w-xl text-runtime-ink-soft">{s.closing.text}</p>
            <a
              href="#upgrade"
              data-magnetic
              data-cursor="route signal"
              className="signal-grad mt-8 inline-flex h-12 items-center rounded-full px-8 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              {s.hero.primaryCta} <span aria-hidden className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
