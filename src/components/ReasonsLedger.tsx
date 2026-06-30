"use client";

import { useEffect, useRef, useState } from "react";
import { reasons } from "@/lib/content";

const N = reasons.length;

function Corners() {
  const b = "pointer-events-none absolute size-2.5 border-ink/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100";
  return (
    <>
      <span className={`${b} left-0 top-0 border-l border-t`} />
      <span className={`${b} right-0 top-0 border-r border-t`} />
      <span className={`${b} bottom-0 left-0 border-b border-l`} />
      <span className={`${b} bottom-0 right-0 border-b border-r`} />
    </>
  );
}

function useCountUp(target: number, run: boolean, duration = 700) {
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

export default function ReasonsLedger() {
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const secRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(false);
  const total = useCountUp(N, seen);

  // active row = the one whose centre is nearest the viewport centre
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      rowRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
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

  // count-up trigger
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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const fill = (active + 1) / N;

  return (
    <section
      ref={secRef}
      className="relative mx-auto max-w-[1100px] px-4 py-[30px] sm:px-6 lg:py-[50px]"
    >
      {/* spec header */}
      <div className="flex items-end justify-between border-b border-line pb-5">
        <div>
          <p className="tech-label text-[11px] text-ink-soft">[ зачем это бизнесу ]</p>
          <h2 className="mt-3 text-[clamp(1.55rem,3.4vw,2.9rem)] font-normal leading-tight tracking-[-0.015em]">
            <span className="font-display text-accent">6</span> весомых причин заняться брендингом
          </h2>
        </div>
        <div className="hidden shrink-0 text-right sm:block">
          <p className="font-display text-[2rem] font-normal leading-none text-ink-soft tabular-nums">
            {String(total).padStart(2, "0")}
          </p>
          <p className="tech-label mt-1 text-[10px] text-ink-soft">причин / reasons</p>
        </div>
      </div>

      {/* ledger with measurement rail */}
      <div className="relative">
        {/* left rail (desktop) */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 hidden w-16 lg:block" aria-hidden>
          <div
            className="absolute inset-y-0 left-[30px] w-px"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, var(--color-ink) 0 1px, transparent 1px 11px)",
              opacity: 0.25,
            }}
          />
          <div
            className="absolute left-[28px] top-0 w-[3px] origin-top"
            style={{
              height: "100%",
              transform: `scaleY(${fill})`,
              transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
              background: "linear-gradient(var(--color-accent), var(--color-accent-2))",
            }}
          />
        </div>

        <ol className="border-b border-line lg:pl-16">
          {reasons.map((r, i) => {
            const on = active === i;
            return (
              <li
                key={r.title}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                data-active={on ? "" : undefined}
                style={{ "--d": `${(i * 0.06).toFixed(2)}s` } as React.CSSProperties}
                className="ledger-row group relative grid grid-cols-[auto_1fr] items-start gap-x-4 border-t border-line py-6 sm:gap-x-6 lg:grid-cols-[110px_1fr_minmax(140px,180px)] lg:py-[clamp(24px,3vw,34px)] lg:min-h-[132px]"
              >
                <Corners />

                  {/* number */}
                  <span
                    className={`font-display text-[2.4rem] font-normal leading-none tracking-tight tabular-nums transition-colors duration-300 lg:text-[clamp(2.6rem,4vw,3.6rem)] ${
                      on ? "text-accent" : "text-ink"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* content */}
                  <div className="col-start-2 lg:col-start-2">
                    <div className="flex items-baseline justify-between gap-3 lg:block">
                      <h3 className="text-[1.12rem] font-medium leading-snug tracking-tight transition-transform duration-200 lg:text-[1.3rem] lg:group-hover:translate-x-[2px]">
                        {r.title}
                      </h3>
                      {/* mobile inline tag */}
                      <span
                        className={`tech-label shrink-0 text-[10px] lowercase lg:hidden ${
                          on ? "text-accent" : "text-ink-soft"
                        }`}
                      >
                        [ {r.tag} ]
                      </span>
                    </div>
                    <p className="mt-2 max-w-[48ch] text-[13.5px] leading-relaxed text-ink-soft lg:mt-3 lg:text-[14px]">
                      {r.text}
                    </p>
                  </div>

                  {/* desktop spec tag column */}
                  <div className="col-start-3 hidden justify-self-end text-right lg:block">
                    <span
                      className={`tech-label text-[11px] lowercase tracking-wide transition-colors ${
                        on ? "text-accent" : "text-ink-soft"
                      }`}
                    >
                      [ {r.tag} ]
                    </span>
                    <span
                      className={`stripe-bar mt-3 block h-3 w-full rounded-[1px] transition-opacity ${
                        on ? "opacity-50" : "opacity-25"
                      }`}
                    />
                  </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
