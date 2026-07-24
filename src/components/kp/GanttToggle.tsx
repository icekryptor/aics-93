"use client";

import { useState } from "react";

/* GanttToggle — полноширинный Гант с переключателем «лендинг / сайт».
   Данные приходят пропсами; бары — паттерн ServiceDetail. */

export type GanttPhase = { name: string; days: number; start: number; color: string };
export type GanttVariant = { key: string; label: string; note: string; total: number; phases: GanttPhase[] };

export default function GanttToggle({ variants }: { variants: GanttVariant[] }) {
  const [active, setActive] = useState(variants[0].key);
  const v = variants.find((x) => x.key === active) ?? variants[0];

  return (
    <div
      className="overflow-hidden rounded-2xl px-6 py-7 sm:px-8"
      style={{ border: "1px solid var(--color-runtime-line)", background: "rgba(23,16,41,0.4)" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* тогглер */}
        <div
          className="inline-flex items-center gap-1 rounded-full p-1"
          style={{ border: "1px solid var(--color-runtime-line)", background: "rgba(14,10,27,0.6)" }}
        >
          {variants.map((x) => {
            const on = x.key === active;
            return (
              <button
                key={x.key}
                type="button"
                onClick={() => setActive(x.key)}
                aria-pressed={on}
                className={`tech-label cursor-pointer rounded-full px-4 py-1.5 text-[12px] transition-colors ${
                  on ? "text-white" : "text-runtime-ink-soft hover:text-runtime-ink"
                }`}
                style={on ? { background: "color-mix(in srgb, var(--color-signal) 45%, transparent)" } : undefined}
              >
                {x.label}
              </button>
            );
          })}
        </div>
        <p className="text-[0.85rem] text-runtime-ink-soft">{v.note}</p>
      </div>

      <div className="mt-7 space-y-5">
        {v.phases.map((p) => (
          <div key={`${v.key}-${p.name}`}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-[0.88rem]">
              <span className="font-medium text-runtime-ink">{p.name}</span>
              <span className="shrink-0 text-runtime-ink-soft">
                {p.days} {p.days === 1 ? "день" : p.days < 5 ? "дня" : "дней"}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[rgba(151,71,255,0.1)]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  marginLeft: `${(p.start / v.total) * 100}%`,
                  width: `${(p.days / v.total) * 100}%`,
                  background: p.color,
                  boxShadow: `0 0 12px ${p.color}55`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="hud mt-5 text-[9px] text-runtime-ink-soft/60">
        // итого ≈ {v.total} дней · этапы идут каскадом
      </p>
    </div>
  );
}
