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
  const [experience, setExperience] = useState(false);

  useEffect(() => {
    setExperience(document.documentElement.hasAttribute("data-experience"));
  }, []);

  // AI core position (above the train) + traces to each gear centre
  const CORE = { x: CANVAS_W / 2, y: 34, r: 26 };

  useEffect(() => {
    const measure = () => {
      const w = wrapRef.current?.clientWidth ?? CANVAS_W;
      // fill the full working area (12 cols) — allow scaling up too
      setScale(w / CANVAS_W);
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
            {/* AI core driving the train (immersive route only) */}
            {experience && (
              <svg
                className="pointer-events-none absolute left-0 top-0"
                width={CANVAS_W}
                height={CANVAS_H}
                viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
                aria-hidden
              >
                {TRAIN.map((g) => (
                  <line
                    key={g.f}
                    x1={CORE.x}
                    y1={CORE.y}
                    x2={g.cx}
                    y2={g.cy}
                    stroke="url(#coreGrad)"
                    strokeWidth={1.4}
                    className="ai-core-flow"
                    opacity={0.5}
                  />
                ))}
                <defs>
                  <linearGradient id="coreGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#b57bff" />
                    <stop offset="1" stopColor="#9747ff" />
                  </linearGradient>
                  <radialGradient id="coreFill">
                    <stop offset="0" stopColor="#b57bff" />
                    <stop offset="1" stopColor="#6d28d9" />
                  </radialGradient>
                </defs>
                <g className="ai-core-throb" style={{ transformOrigin: `${CORE.x}px ${CORE.y}px` }}>
                  <circle cx={CORE.x} cy={CORE.y} r={CORE.r + 10} fill="#9747ff" opacity={0.18} />
                  <circle cx={CORE.x} cy={CORE.y} r={CORE.r} fill="url(#coreFill)" />
                </g>
                <text
                  x={CORE.x}
                  y={CORE.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#ffffff"
                  style={{ font: "600 13px var(--font-display), sans-serif", letterSpacing: "0.05em" }}
                >
                  AI
                </text>
                <text
                  x={CORE.x}
                  y={CORE.y + CORE.r + 16}
                  textAnchor="middle"
                  fill="#9747ff"
                  style={{ font: "600 10px var(--font-display), monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}
                >
                  ядро · core
                </text>
              </svg>
            )}

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
                <span className="pointer-events-none absolute left-1/2 top-1/2 w-max max-w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-bg/90 px-3 py-1 text-center text-[12px] font-medium leading-tight text-ink shadow-[0_4px_16px_-8px_rgba(48,32,85,0.4)] backdrop-blur-sm">
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
