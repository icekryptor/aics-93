"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { aboutFacts, aboutStats, aboutPhoto, aboutLogos } from "@/lib/content";

const CUT: React.CSSProperties = {
  clipPath:
    "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)",
};

// fires when the element scrolls in; safety timeout guarantees it eventually
// turns on so nothing can stay hidden if the observer misbehaves
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    const safety = window.setTimeout(() => setSeen(true), 4000);
    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, [threshold]);
  return [ref, seen] as const;
}

// shows the final value by default (SSR / no-JS safe); animates 0 → target
// once `run` flips true
function useCountUp(target: number, run: boolean, duration = 1500) {
  const [val, setVal] = useState(target);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    let start: number | null = null;
    setVal(0);
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(p < 1 ? Math.round(target * e) : target);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return val;
}

function Deco({ kind, on }: { kind: "rings" | "dots" | "people"; on: boolean }) {
  if (kind === "rings") {
    return (
      <div className="flex items-center gap-3">
        <img src="/assets/about/1y.svg" alt="" aria-hidden className="size-12" />
        <img
          src="/assets/about/2y.svg"
          alt=""
          aria-hidden
          className="size-12 animate-spin [animation-duration:9s]"
        />
      </div>
    );
  }
  const src = kind === "dots" ? "/assets/about/projects.svg" : "/assets/about/ppl.svg";
  return (
    <div className="overflow-hidden">
      <img
        src={src}
        alt=""
        aria-hidden
        className="h-auto w-full max-w-[230px] transition-[clip-path] duration-[1200ms] ease-out"
        style={{ clipPath: on ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
      />
    </div>
  );
}

function StatBlock({ stat, on }: { stat: (typeof aboutStats)[number]; on: boolean }) {
  const n = useCountUp(stat.target, on);
  const prefix = "prefix" in stat && stat.prefix ? stat.prefix : "";
  const suffix = "suffix" in stat && stat.suffix ? stat.suffix : "";
  return (
    <div>
      <p className="font-display text-[2.7rem] font-normal leading-none tracking-tight tabular-nums">
        {prefix}
        {n.toLocaleString("ru-RU")}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
      <div className="mt-4">
        <Deco kind={stat.deco} on={on} />
      </div>
      {stat.sub && <p className="mt-3 text-xs text-ink-soft">{stat.sub}</p>}
    </div>
  );
}

export default function AboutMe() {
  const [secRef, on] = useInView<HTMLElement>(0.15);

  return (
    <section
      id="exp"
      ref={secRef}
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-[30px] sm:px-6 lg:py-[50px]"
    >
      <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        {/* Panel + logos */}
        <div>
          <div className="relative bg-ink/25 p-px" style={CUT}>
            <div className="relative h-full bg-bg p-6 sm:p-8" style={CUT}>
              <span className="pointer-events-none absolute left-3 top-3 size-2.5 border-l border-t border-ink/40" />
              <span className="pointer-events-none absolute bottom-3 right-3 size-2.5 border-b border-r border-ink/40" />

              <div className="grid gap-6 md:grid-cols-[1fr_0.82fr] md:gap-8">
                <div>
                  <span className="inline-block rounded-md bg-ink px-4 py-1.5 font-display text-sm tracking-wide text-bg">
                    КТО Я
                  </span>
                  <ul className="mt-6 space-y-5">
                    {aboutFacts.map((f, i) => (
                      <li
                        key={i}
                        className="border-l border-ink/25 pl-4 text-[15px] leading-relaxed transition-all duration-500"
                        style={{
                          opacity: on ? 1 : 0.35,
                          transform: on ? "none" : "translateX(-6px)",
                          transitionDelay: `${i * 90}ms`,
                        }}
                      >
                        {f.lead && <span className="font-semibold">{f.lead}</span>}
                        {f.rest}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative min-h-[260px] overflow-hidden bg-bg-soft" style={CUT}>
                  <Image
                    src={aboutPhoto}
                    alt="Василий Аистов"
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* brand logos */}
          <div className="mt-7">
            <p className="tech-label mb-4 text-xs text-ink-soft">работал с брендами</p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
              {aboutLogos.map((l) => (
                <img
                  key={l.alt}
                  src={l.src}
                  alt={l.alt}
                  title={l.alt}
                  className="h-7 w-auto opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-8"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-9">
          {aboutStats.map((s) => (
            <StatBlock key={s.label} stat={s} on={on} />
          ))}
        </div>
      </div>
    </section>
  );
}
