"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { featured, cases, moreProjects } from "@/lib/content";

// cut-corner octagon frame — same language as the About / Frameworks panels
const CUT: React.CSSProperties = {
  clipPath:
    "polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)",
};

const TOTAL = 1 + cases.length + moreProjects.length;

// hover corner brackets — identical treatment to ReasonsLedger
function Corners() {
  const b =
    "pointer-events-none absolute size-2.5 border-ink/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100";
  return (
    <>
      <span className={`${b} left-0 top-0 border-l border-t`} />
      <span className={`${b} right-0 top-0 border-r border-t`} />
      <span className={`${b} bottom-0 left-0 border-b border-l`} />
      <span className={`${b} bottom-0 right-0 border-b border-r`} />
    </>
  );
}

function useCountUp(target: number, run: boolean, duration = 800) {
  const [v, setV] = useState(target);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    let s: number | null = null;
    setV(0);
    const tick = (t: number) => {
      if (s === null) s = t;
      const p = Math.min(1, (t - s) / duration);
      setV(p < 1 ? Math.round(target * (1 - Math.pow(1 - p, 3))) : target);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return v;
}

// caption bar in the bottom-right of a media frame (echoes the GraphCanvas frame)
function MediaCaption({ text }: { text: string }) {
  return (
    <span className="tech-label absolute bottom-0 right-0 z-10 bg-ink px-2.5 py-1 text-[10px] lowercase text-bg">
      {text}
    </span>
  );
}

// tick ruler along the top edge of a media frame
function TickRuler() {
  return (
    <span
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-2"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to right, rgba(48, 32, 85,0.35) 0 1px, transparent 1px 9px)",
      }}
      aria-hidden
    />
  );
}

export default function Portfolio() {
  const secRef = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);
  const count = useCountUp(TOTAL, seen);

  useEffect(() => {
    const el = secRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="prtf"
      ref={secRef}
      className="relative scroll-mt-24 py-[30px] lg:py-[50px]"
    >
      {/* vertical measurement label */}
      <span
        className="tech-label pointer-events-none absolute left-3 top-28 hidden text-[11px] tracking-[0.35em] text-ink-soft lg:block"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        архив / portfolio
      </span>

      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:pl-16">
        {/* spec header — matches the ReasonsLedger header */}
        <div className="flex items-end justify-between border-b border-line pb-5">
          <div>
            <p className="tech-label text-[11px] text-ink-soft">[ отобранные работы ]</p>
            <h2 className="mt-3 text-[clamp(1.55rem,3.4vw,2.9rem)] font-normal leading-tight tracking-[-0.015em]">
              портфолио <span className="text-accent">/</span> избранное
            </h2>
          </div>
          <div className="hidden shrink-0 text-right sm:block">
            <p className="font-display text-[2rem] font-normal leading-none text-ink-soft tabular-nums">
              {String(count).padStart(2, "0")}
            </p>
            <p className="tech-label mt-1 text-[10px] text-ink-soft">проектов / total</p>
          </div>
        </div>

        {/* ── Featured specimen: ХИМИЧКА ── */}
        <Reveal className="mt-10">
          <article className="group relative bg-ink/25 p-px" style={CUT}>
            <div className="relative grid gap-0 bg-bg lg:grid-cols-[1.05fr_1fr]" style={CUT}>
              <Corners />

              {/* left: dossier */}
              <div className="flex flex-col p-7 sm:p-9 lg:p-11">
                <div className="flex items-center gap-3">
                  <span className="font-display text-[1.6rem] font-normal leading-none text-accent tabular-nums">
                    00
                  </span>
                  <span className="tech-label rounded-sm bg-accent/12 px-2 py-1 text-[10px] text-accent-ink">
                    главный проект
                  </span>
                </div>

                <p className="mt-6 text-sm text-ink-soft">моя главная гордость:</p>
                <h3 className="mt-1 text-[clamp(2.1rem,4.4vw,3.4rem)] font-normal leading-none tracking-tight">
                  {featured.name}
                </h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                  {featured.subtitle}
                </p>

                {/* services as a spec grid */}
                <ul className="mt-7 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {featured.services.map((s, i) => (
                    <li key={s} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
                      <span className="mt-1 shrink-0 font-display text-[11px] text-accent tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={featured.link}
                  className="mt-9 inline-flex w-fit items-center gap-2 rounded-xl border border-ink px-7 py-3.5 text-sm font-semibold transition-all hover:bg-ink hover:text-bg"
                >
                  Подробный кейс <span aria-hidden>→</span>
                </a>
              </div>

              {/* right: framed screenshot */}
              <div className="relative min-h-[280px] overflow-hidden border-l border-line bg-bg-soft lg:min-h-full">
                <TickRuler />
                <Image
                  src={featured.image}
                  alt={featured.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className="object-cover object-top"
                  priority
                />
                <MediaCaption text="featured specimen" />
              </div>
            </div>
          </article>
        </Reveal>

        {/* ── Case files ── */}
        <div className="mt-16">
          <div className="flex items-baseline gap-3 border-b border-line pb-3">
            <span className="tech-label text-[11px] text-ink-soft">[ картотека кейсов ]</span>
            <span className="font-display text-[11px] text-ink-soft tabular-nums">
              {String(cases.length).padStart(2, "0")} шт.
            </span>
          </div>

          <div className="mt-10 space-y-14 lg:space-y-20">
            {cases.map((c, i) => {
              const flip = i % 2 === 1;
              return (
                <Reveal key={c.name}>
                  <article className="group relative grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-12">
                    {/* media */}
                    <div
                      className={`relative bg-ink/15 p-px ${flip ? "lg:order-last" : ""}`}
                      style={CUT}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-bg-soft" style={CUT}>
                        <TickRuler />
                        <Image
                          src={c.image}
                          alt={c.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 560px"
                          className="object-cover object-top opacity-90 grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
                        />
                        <MediaCaption text={`case ${String(i + 1).padStart(2, "0")}`} />
                      </div>
                    </div>

                    {/* dossier */}
                    <div className="relative lg:px-2">
                      <div className="flex items-start gap-4">
                        <span className="font-display text-[clamp(2.4rem,4vw,3.4rem)] font-normal leading-none tracking-tight text-ink/25 tabular-nums transition-colors duration-300 group-hover:text-accent">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-[clamp(1.5rem,2.6vw,2.1rem)] font-normal leading-none tracking-tight">
                            {c.name}
                          </h3>
                          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-soft">
                            {c.subtitle}
                          </p>
                        </div>
                      </div>

                      {c.tags && c.tags.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2 lg:pl-[calc(clamp(2.4rem,4vw,3.4rem)+1rem)]">
                          {c.tags.map((t) => (
                            <span
                              key={t}
                              className="tech-label rounded-full border border-line px-3 py-1 text-[10px] lowercase text-ink-soft"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {c.services.length > 0 && (
                        <ul className="mt-5 grid gap-x-6 gap-y-1.5 text-[12.5px] text-ink-soft sm:grid-cols-2 lg:pl-[calc(clamp(2.4rem,4vw,3.4rem)+1rem)]">
                          {c.services.map((s) => (
                            <li
                              key={s}
                              className="flex items-start gap-2 before:mt-[6px] before:h-px before:w-3 before:shrink-0 before:bg-accent before:content-['']"
                            >
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}

                      {c.link && (
                        <a
                          href={c.link}
                          target={c.link.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent-ink underline-offset-4 hover:underline lg:ml-[calc(clamp(2.4rem,4vw,3.4rem)+1rem)]"
                        >
                          {c.link.replace(/^https?:\/\//, "")} <span aria-hidden>↗</span>
                        </a>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* ── More projects grid ── */}
        <div className="mt-20">
          <div className="flex items-baseline gap-3 border-b border-line pb-3">
            <span className="tech-label text-[11px] text-ink-soft">[ прочие образцы ]</span>
            <span className="font-display text-[11px] text-ink-soft tabular-nums">
              {String(moreProjects.length).padStart(2, "0")} шт.
            </span>
          </div>

          <div className="mt-8 grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {moreProjects.map((p, i) => (
              <Reveal key={p.name} delay={(i % 4) * 60}>
                <a href={p.link} className="group block">
                  <div className="relative bg-ink/15 p-px" style={CUT}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-bg-soft" style={CUT}>
                      <Corners />
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover object-top opacity-85 grayscale transition-all duration-500 group-hover:scale-[1.05] group-hover:opacity-100 group-hover:grayscale-0"
                      />
                      <span className="tech-label absolute left-0 top-0 z-10 bg-ink px-2 py-0.5 text-[9px] lowercase text-bg tabular-nums">
                        обр-{String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-ink-soft">{p.subtitle}</p>
                  <p className="mt-0.5 text-sm font-normal leading-tight">{p.name}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-accent-ink">
                    Смотреть сайт <span aria-hidden>→</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
