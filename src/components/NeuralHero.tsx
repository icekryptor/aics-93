"use client";

import { useEffect, useRef, useState } from "react";
import LogoMark from "./LogoMark";
import BrainGL from "./system/BrainGL";
import StudioGrid from "./StudioGrid";
import { heroStats } from "@/lib/content";

const STATES = ["biology", "hybrid", "machine"] as const;

// BOOT / THE SYMBIOSIS — act one. Three columns: offer / living brain / telemetry.
export default function NeuralHero() {
  const secRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [brainState, setBrainState] = useState<number | null>(null);

  // BrainGL is the source of truth for the current state (scroll or click)
  useEffect(() => {
    const on = (e: Event) => setBrainState((e as CustomEvent<number>).detail);
    window.addEventListener("aics:brainstate", on);
    return () => window.removeEventListener("aics:brainstate", on);
  }, []);

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

  const stateIdx = brainState ?? (progress < 0.34 ? 0 : progress < 0.7 ? 1 : 2);

  return (
    <section
      id="top"
      ref={secRef}
      className="runtime relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* faint blueprint grid */}
      <div className="runtime-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      {/* legibility vignette + soft ramp into the light act below */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 80% at 14% 40%, rgba(14, 10, 27,0.85) 0%, rgba(14, 10, 27,0.45) 40%, transparent 72%), linear-gradient(to top, #0e0a1b 3%, transparent 24%), linear-gradient(to bottom, transparent 80%, color-mix(in srgb, #0e0a1b 62%, var(--color-bg)) 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1640px] flex-col px-6 pb-14 pt-[84px] sm:px-10 lg:px-14">
        {/* top: lockup + state HUD */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="[&_img]:brightness-0 [&_img]:invert">
              <LogoMark />
            </span>
            <div>
              <p className="font-bold text-[1.55rem] leading-none tracking-tight text-runtime-ink sm:text-[1.9rem]">
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
            <p className="tech-label mt-2 hidden text-[9px] text-runtime-ink-soft lg:block">
              [ клик по мозгу — сменить состояние ]
            </p>
          </div>
        </div>

        {/* middle: offer | brain | telemetry */}
        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.02fr_1.15fr_0.72fr] lg:gap-8">
          {/* left: offer (three lines) + description */}
          <div>
            <p className="tech-label mb-5 text-[11px] text-[color-mix(in_srgb,var(--color-signal)_80%,white)]">
              [ boot · симбиоз мозга и машины ]
            </p>
            <h1 className="text-[clamp(2.1rem,3.6vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.028em] text-runtime-ink">
              Мозг и машина —
              <br />в <span className="signal-text text-glow">симбиозе</span>
              <br />
              для вашего бренда.
            </h1>
            <p className="mt-6 max-w-md text-[clamp(0.95rem,1.2vw,1.1rem)] leading-relaxed text-runtime-ink-soft">
              Я соединяю креатив с ИИ-системами и внедряю их в процессы компаний —
              чтобы бренды росли на данных, а не на догадках.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#upgrade"
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

          {/* center: the living brain — shifted 20px left; the canvas overflows
              its cell vertically so the cloud is never cropped (overlay allowed).
              Vertical growth doesn't change the brain size — its scale keys off
              the smaller (width) dimension. */}
          <div className="relative order-first h-[360px] sm:h-[440px] lg:order-none lg:h-full lg:min-h-[560px] lg:-mx-12 xl:-mx-16">
            <div
              className="pointer-events-none absolute -inset-y-12 inset-x-0 lg:-inset-y-20"
              style={{ transform: "translateX(-20px)" }}
              aria-hidden
            >
              <BrainGL className="h-full w-full" />
            </div>
          </div>

          {/* right: telemetry stats + человек-студия */}
          <div className="space-y-7">
            {heroStats.map((s) => (
              <div key={s.big} className="border-t border-runtime-line pt-3">
                <p className="font-display text-[1.5rem] leading-none tracking-tight text-runtime-ink sm:text-[1.7rem]">
                  {s.big}
                </p>
                <p className="mt-2 text-[11.5px] leading-snug text-runtime-ink-soft">{s.text}</p>
              </div>
            ))}

            {/* человек-студия card */}
            <div className="relative pt-3">
              <span className="signal-grad absolute left-4 top-0 z-10 rounded-md px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                человек-студия
              </span>
              <div className="rounded-2xl border border-runtime-line bg-[color-mix(in_srgb,var(--color-runtime-2)_80%,transparent)] px-5 pb-5 pt-7 backdrop-blur-sm">
                <p className="text-[12.5px] leading-relaxed text-runtime-ink-soft">
                  Я — Василий Аистов, co-founder / CMO в Химичке. Делаю яркие бренды,
                  запоминающиеся среди конкурентов.
                </p>
                <div className="mt-4 text-runtime-ink [&_.studio-grid]:!text-[color:var(--color-signal)]">
                  <StudioGrid className="mt-0" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom: scroll cue */}
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
