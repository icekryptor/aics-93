"use client";

import { useEffect, useRef, useState } from "react";

const SKILLS = [
  { n: "01", label: "бренд-дизайнер", pct: 90 },
  { n: "02", label: "маркетинговое управление", pct: 80 },
  { n: "03", label: "веб-разработка", pct: 100 },
];

const CELLS = 14;
const STEP = 55; // ms between cells (sequential, across all bars)

export default function SkillBars() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [go, setGo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setGo(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let seq = 0; // running index over filled cells → sequential delay across bars

  return (
    <div ref={ref} className="max-w-sm space-y-4">
      {SKILLS.map((s) => {
        const filled = Math.round((CELLS * s.pct) / 100);
        return (
          <div key={s.n}>
            <div className="flex items-center gap-3">
              <span className="tech-label text-xs text-ink-soft">{s.n}:</span>
              <span className="seg-track">
                {Array.from({ length: CELLS }).map((_, i) => {
                  const isFilled = i < filled;
                  const delay = isFilled ? seq++ * STEP : 0;
                  return (
                    <svg
                      key={i}
                      viewBox="0 0 7 6"
                      className={`seg ${go && isFilled ? "on" : ""}`}
                      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
                      aria-hidden
                    >
                      <path d="M6.19141 0.5L3.69141 5.5H0.808594L3.30859 0.5H6.19141Z" />
                    </svg>
                  );
                })}
              </span>
            </div>
            <p className="mt-1.5 text-[13px] font-medium">{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}
