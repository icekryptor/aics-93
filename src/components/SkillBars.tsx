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
              <span className="skew-track">
                {Array.from({ length: CELLS }).map((_, i) => {
                  const isFilled = i < filled;
                  const delay = isFilled ? seq++ * STEP : 0;
                  return (
                    <span
                      key={i}
                      className="skew-cell2"
                      style={
                        {
                          "--fill": go && isFilled ? 1 : 0,
                          "--delay": `${delay}ms`,
                        } as React.CSSProperties
                      }
                    />
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
