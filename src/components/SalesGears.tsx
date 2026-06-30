"use client";

import { useEffect, useRef } from "react";

type Size = "big" | "med" | "sm";
const SIZES: Record<Size, { px: number; css: string }> = {
  big: { px: 232, css: "clamp(150px, 17vw, 232px)" },
  med: { px: 186, css: "clamp(120px, 13.5vw, 186px)" },
  sm: { px: 150, css: "clamp(98px, 11vw, 150px)" },
};

// chain order left→right; direction alternates (meshing gears spin opposite ways)
const GEARS: { f: string; s: Size; label: string; left: string; top: string }[] = [
  { f: "gear1.svg", s: "big", label: "Маркетинг-стратегия", left: "9%", top: "44%" },
  { f: "gear3.svg", s: "sm", label: "Брендбук", left: "24%", top: "76%" },
  { f: "gear2.svg", s: "med", label: "Контент и реклама", left: "37%", top: "39%" },
  { f: "gear6.svg", s: "med", label: "Собственный сайт", left: "53%", top: "73%" },
  { f: "gear5.svg", s: "med", label: "Продакт-дизайн", left: "67%", top: "45%" },
  { f: "gear4.svg", s: "big", label: "Удержание, LTV", left: "83%", top: "53%" },
];

const BASE = 34; // rotation speed constant (deg ≈ scrollY * BASE / sizePx)

export default function SalesGears() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const render = () => {
      raf = 0;
      const y = window.scrollY;
      GEARS.forEach((g, i) => {
        const el = refs.current[i];
        if (!el) return;
        const dir = i % 2 === 0 ? 1 : -1;
        const deg = (y * BASE * dir) / SIZES[g.s].px;
        el.style.transform = `rotate(${deg}deg)`;
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
    <div className="relative mx-auto h-[clamp(360px,42vw,540px)] w-full max-w-[1120px]">
      {GEARS.map((g, i) => {
        const size = SIZES[g.s].css;
        return (
          <div
            key={g.f}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: g.left, top: g.top, width: size, height: size }}
          >
            <div
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="engine-gear size-full"
              style={{
                WebkitMaskImage: `url(/assets/gears/${g.f})`,
                maskImage: `url(/assets/gears/${g.f})`,
              }}
            />
            <span className="pointer-events-none absolute left-1/2 top-1/2 w-max max-w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-bg/90 px-3 py-1 text-center text-[11px] font-medium leading-tight text-ink shadow-[0_4px_16px_-8px_rgba(22,18,29,0.4)] backdrop-blur-sm">
              {g.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
