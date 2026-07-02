"use client";

import { useEffect, useRef, useState } from "react";
import LogoMark from "./LogoMark";
import BrainGL from "./system/BrainGL";
import { heroStats } from "@/lib/content";

const STATES = ["biology", "hybrid", "machine"] as const;

// BOOT / THE SYMBIOSIS — act one. The hero is a live neural brain morphing
// biology → hybrid → machine as you scroll, wrapped in the AICS-93 lockup.
export default function NeuralHero() {
  const secRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = secRef.current;
    if (!el) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height * 0.9)));
      setProgress(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const stateIdx = progress < 0.34 ? 0 : progress < 0.7 ? 1 : 2;

  return (
    <section
      id="top"
      ref={secRef}
      className="runtime relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* faint blueprint grid */}
      <div className="runtime-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      {/* the living brain — WebGL point cloud (falls back to the 2D engine);
          boxed to the right on desktop so it clears the headline */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-full lg:left-[34%] lg:w-auto"
        aria-hidden
      >
        <BrainGL className="h-full w-full" />
      </div>
      {/* legibility vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 92% at 16% 42%, rgba(14, 10, 27,0.9) 0%, rgba(14, 10, 27,0.6) 36%, rgba(14, 10, 27,0.12) 66%, transparent 100%), linear-gradient(to top, #0e0a1b 3%, transparent 26%), linear-gradient(to bottom, transparent 80%, color-mix(in srgb, #0e0a1b 62%, var(--color-bg)) 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1640px] flex-col px-6 pb-14 pt-[88px] sm:px-10 lg:px-16">
        {/* top: lockup + state HUD */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="[&_img]:brightness-0 [&_img]:invert">
              <LogoMark />
            </span>
            <div>
              <p className="font-display text-[1.55rem] leading-none tracking-tight text-runtime-ink sm:text-[1.9rem]">
                AICS<span className="signal-text">-93</span>
              </p>
              <p className="tech-label mt-1.5 text-[10px] leading-tight text-runtime-ink-soft">
                autonomous intelligent
                <br />
                cyberhuman system #93
              </p>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <p className="hud text-[10px] text-runtime-ink-soft">
              <span className="hud-dot mr-2 inline-block align-middle" />
              state
            </p>
            <p className="mt-1 font-display text-[13px] uppercase tracking-widest text-runtime-ink">
              {STATES.map((s, i) => (
                <span key={s} className={i === stateIdx ? "signal-text" : "opacity-30"}>
                  {s}
                  {i < STATES.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* middle: thesis + telemetry stats, vertically centred */}
        <div className="flex flex-1 flex-col justify-center py-10">
          <div className="max-w-[54rem]">
            <p className="tech-label mb-5 text-[11px] text-[color-mix(in_srgb,var(--color-signal)_80%,white)]">
              [ boot · симбиоз мозга и машины ]
            </p>
            <h1 className="text-[clamp(2.4rem,6vw,5.2rem)] font-medium leading-[0.98] tracking-[-0.03em] text-runtime-ink">
              Мозг и машина —
              <br />
              в <span className="signal-text text-glow">симбиозе</span>.
            </h1>
            <p className="mt-7 max-w-xl text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed text-runtime-ink-soft">
              Я соединяю креатив с ИИ-системами и внедряю их в процессы компаний —
              чтобы бренды росли на данных, а не на догадках.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#ai"
                data-magnetic
                data-cursor="route signal"
                className="signal-grad inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
              >
                Получить КП <span aria-hidden>→</span>
              </a>
              <a
                href="#prtf"
                data-magnetic
                data-cursor="open node"
                className="inline-flex items-center gap-2 rounded-xl border border-runtime-line px-7 py-3.5 text-sm font-semibold text-runtime-ink transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_60%,transparent)]"
              >
                Смотреть работы
              </a>
            </div>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-6 sm:gap-10">
            {heroStats.map((s) => (
              <div key={s.big} className="border-t border-runtime-line pt-3">
                <p className="font-display text-[1.4rem] leading-none tracking-tight text-runtime-ink sm:text-[1.8rem]">
                  {s.big}
                </p>
                <p className="mt-2 text-[11px] leading-snug text-runtime-ink-soft sm:text-[12px]">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* bottom: scroll cue (right, clear of the bottom-left HUD) */}
        <div className="flex justify-end">
          <div className="hidden items-center gap-2 lg:flex">
            <span className="tech-label text-[10px] text-runtime-ink-soft">scroll</span>
            <span className="relative block h-9 w-px overflow-hidden bg-runtime-line">
              <span
                className="signal-grad absolute inset-x-0 top-0 h-3 w-full"
                style={{ animation: "bootScan 1.8s ease-in-out infinite" }}
              />
            </span>
          </div>
        </div>
      </div>

      <div className="signal-seam absolute inset-x-0 bottom-0" aria-hidden />
    </section>
  );
}
