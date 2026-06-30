"use client";

import { useEffect, useRef } from "react";

// Meshing gear train driven by scroll position.
// Physics: bigger gear → slower; each next gear spins the opposite way.
// Positions/sizes are % of the container so the whole train scales responsively.
type Gear = {
  src: string;
  size: number; // % of container width
  x: number; // centre %, horizontal
  y: number; // centre %, vertical
  label: string;
  dir: 1 | -1;
};

const GEARS: Gear[] = [
  { src: "/gears/gear1.svg", size: 21, x: 13, y: 52, label: "Маркетинг-стратегия", dir: 1 },
  { src: "/gears/gear2.svg", size: 13, x: 28, y: 80, label: "Брендбук", dir: -1 },
  { src: "/gears/gear3.svg", size: 18, x: 41, y: 44, label: "Контент и реклама", dir: 1 },
  { src: "/gears/gear4.svg", size: 16, x: 56, y: 74, label: "Собственный сайт", dir: -1 },
  { src: "/gears/gear5.svg", size: 15, x: 70, y: 46, label: "Продакт-дизайн", dir: 1 },
  { src: "/gears/gear6.svg", size: 22, x: 86, y: 64, label: "Удержание, LTV", dir: -1 },
];

const K = 2.6; // scroll → rotation factor (deg = scrollY * K / size * dir)

export default function EngineGears() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      GEARS.forEach((g, i) => {
        const el = refs.current[i];
        if (!el) return;
        const deg = (y * K * g.dir) / g.size;
        el.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative mx-auto aspect-[1000/460] w-full max-w-[1000px]">
      {/* rotating gears */}
      {GEARS.map((g, i) => (
        <div
          key={g.src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          aria-hidden
          className="engine-gear absolute aspect-square"
          style={{
            left: `${g.x}%`,
            top: `${g.y}%`,
            width: `${g.size}%`,
            transform: "translate(-50%, -50%)",
            WebkitMaskImage: `url(${g.src})`,
            maskImage: `url(${g.src})`,
          }}
        />
      ))}

      {/* static label chips */}
      {GEARS.map((g) => (
        <span
          key={g.label}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-line bg-bg/80 px-2.5 py-1 text-center text-[11px] font-medium leading-tight text-ink backdrop-blur-sm"
          style={{ left: `${g.x}%`, top: `${g.y}%` }}
        >
          {g.label}
        </span>
      ))}
    </div>
  );
}
