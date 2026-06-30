"use client";

import { useEffect, useRef, useState } from "react";

// Fixed coordinate canvas; gears placed tangent (centre distance = r₁+r₂) so
// they connect at the teeth without overlapping. The whole canvas is scaled to
// fit its container.
const CANVAS_W = 1140;
const CANVAS_H = 460;

type G = { f: string; r: number; cx: number; cy: number; label: string };
const TRAIN: G[] = [
  { f: "gear1.svg", r: 115, cx: 130, cy: 200, label: "Маркетинг-стратегия" },
  { f: "gear3.svg", r: 70, cx: 301, cy: 269, label: "Брендбук" },
  { f: "gear2.svg", r: 100, cx: 459, cy: 206, label: "Контент и реклама" },
  { f: "gear6.svg", r: 88, cx: 633, cy: 276, label: "Собственный сайт" },
  { f: "gear5.svg", r: 95, cx: 803, cy: 208, label: "Продакт-дизайн" },
  { f: "gear4.svg", r: 118, cx: 1006, cy: 273, label: "Удержание, LTV" },
];

const K = 17; // rotation speed: deg ≈ scrollY * K / radius (bigger gear → slower)

function maskStyle(f: string): React.CSSProperties {
  return {
    WebkitMaskImage: `url(/assets/gears/${f})`,
    maskImage: `url(/assets/gears/${f})`,
  };
}

export default function SalesGears() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const refsD = useRef<(HTMLDivElement | null)[]>([]);
  const refsM = useRef<(HTMLDivElement | null)[]>([]);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const measure = () => {
      const w = wrapRef.current?.clientWidth ?? CANVAS_W;
      setScale(Math.min(1, w / CANVAS_W));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    let raf = 0;
    const render = () => {
      raf = 0;
      const y = window.scrollY;
      TRAIN.forEach((g, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const deg = (y * K * dir) / g.r;
        const t = `rotate(${deg}deg)`;
        if (refsD.current[i]) refsD.current[i]!.style.transform = t;
        if (refsM.current[i]) refsM.current[i]!.style.transform = t;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Desktop / tablet: tangent gear train, scaled to fit */}
      <div ref={wrapRef} className="hidden sm:block">
        <div
          className="relative mx-auto"
          style={{ width: CANVAS_W * scale, height: CANVAS_H * scale }}
        >
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${scale})` }}
          >
            {TRAIN.map((g, i) => (
              <div
                key={g.f}
                className="absolute"
                style={{ left: g.cx - g.r, top: g.cy - g.r, width: g.r * 2, height: g.r * 2 }}
              >
                <div
                  ref={(el) => {
                    refsD.current[i] = el;
                  }}
                  className="engine-gear size-full"
                  style={maskStyle(g.f)}
                />
                <span className="pointer-events-none absolute left-1/2 top-1/2 w-max max-w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-bg/90 px-3 py-1 text-center text-[12px] font-medium leading-tight text-ink shadow-[0_4px_16px_-8px_rgba(22,18,29,0.4)] backdrop-blur-sm">
                  {g.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: clean list — rotating gear + label */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:hidden">
        {TRAIN.map((g, i) => (
          <div key={g.f} className="flex items-center gap-3">
            <div
              ref={(el) => {
                refsM.current[i] = el;
              }}
              className="engine-gear size-16 shrink-0"
              style={maskStyle(g.f)}
            />
            <span className="text-[13px] font-medium leading-tight">{g.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}
