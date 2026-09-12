"use client";

import { useState } from "react";
import { TIERS, planFor, PLAN_LANE_LABEL, type PlanLane, type Tier } from "@/lib/kp/bigsnt";

/* BigsntPlan — Гант плана работ по пяти этапам производственного пайплайна
   студии (исследование → прототип → дизайн-система → сборка → настройка и
   передача), с переключателем объёма 01/02/03: базовые полосы растягиваются,
   полосы дополнительного объёма добавляются. Полосы окрашены по типу работы
   (думаем / рисуем и пишем / собираем / проверяем), точки решений клиента —
   ромбы, гейты — пунктирные вертикали. tone dark/paper. */

const GROUP: Record<PlanLane, "think" | "make" | "build" | "qa"> = {
  research: "think", plan: "think", content: "make", design: "make", build: "build", engine: "build", qa: "qa",
};

export default function BigsntPlan({ tone = "dark" }: { tone?: "dark" | "paper" }) {
  const [key, setKey] = useState<Tier["key"]>("t2");
  const tier = TIERS.find((t) => t.key === key) ?? TIERS[0];
  const { days, stages, gates } = planFor(tier);

  const paper = tone === "paper";
  const line = paper ? "var(--paper-line)" : "var(--color-runtime-line)";
  const soft = paper ? "var(--paper-ink-soft)" : "var(--color-runtime-ink-soft)";
  const ink = paper ? "var(--paper-ink)" : "var(--color-runtime-ink)";
  const signal = paper ? "var(--paper-accent)" : "var(--color-signal)";
  const warm = paper ? "#b4450f" : "#ff7050";
  const cardBg = paper ? "var(--paper-card)" : "rgba(23,16,41,0.45)";
  const shell: React.CSSProperties = paper
    ? { borderRadius: "10px", border: `1px solid ${line}`, background: cardBg }
    : { borderRadius: "25px 55px 55px 5px", border: `1px solid ${line}`, background: cardBg };

  const COL = paper
    ? { think: { bg: "rgba(128,56,232,0.12)", bd: "#8038e8" }, make: { bg: "rgba(30,138,122,0.14)", bd: "#1e8a7a" }, build: { bg: "rgba(138,91,184,0.14)", bd: "#8a5bb8" }, qa: { bg: "rgba(74,122,16,0.16)", bd: "#4a7a10" } }
    : { think: { bg: "rgba(151,71,255,0.2)", bd: "var(--color-signal)" }, make: { bg: "rgba(95,217,245,0.16)", bd: "#5fd9f5" }, build: { bg: "rgba(201,182,255,0.16)", bd: "var(--color-signal-cool)" }, qa: { bg: "rgba(197,255,68,0.16)", bd: "#c5ff44" } };

  const pct = (v: number) => `${(v / days) * 100}%`;
  const weeks = Math.ceil(days / 7);

  return (
    <figure className="m-0 overflow-hidden px-5 py-6 sm:px-7" style={shell}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 rounded-full p-1" style={{ border: `1px solid ${line}`, background: paper ? "var(--paper-2)" : "rgba(14,10,27,0.6)" }}>
          {TIERS.map((t) => {
            const on = t.key === key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setKey(t.key)}
                aria-pressed={on}
                className="tech-label cursor-pointer rounded-full px-3.5 py-1.5 text-[11.5px] transition-colors"
                style={on ? { background: signal, color: "#fff" } : { color: soft }}
              >
                {t.num} · {t.name}
              </button>
            );
          })}
        </div>
        <p className="text-[0.85rem]" style={{ color: soft }}>
          <span className="font-display" style={{ color: ink }}>{tier.hours} ч</span> · <span className="font-display" style={{ color: ink }}>{days}</span> календарных дней · {tier.price}
        </p>
      </div>

      <div className="mt-6 overflow-x-auto pb-1">
        <div className="min-w-[760px]">
          {/* шкала: недели сверху, дни снизу */}
          <div className="relative mb-2 h-5 border-b" style={{ borderColor: line }}>
            {Array.from({ length: weeks }, (_, i) => (
              <span key={i} className="tech-label absolute top-0 text-[10.5px]" style={{ left: pct(i * 7), color: soft }}>
                {i === 0 ? "нед. 1" : `нед. ${i + 1}`}
              </span>
            ))}
          </div>

          <div className="relative">
            {/* сетка дней */}
            {Array.from({ length: days + 1 }, (_, i) => (
              <span key={i} aria-hidden className="pointer-events-none absolute top-0 bottom-0 border-l" style={{ left: pct(i), borderColor: line, opacity: i % 7 === 0 ? 0.9 : 0.35 }} />
            ))}
            {/* гейты */}
            {gates.map((g) => (
              <span key={g.text} aria-hidden className="pointer-events-none absolute top-0 bottom-0 border-l border-dashed" style={{ left: `min(${pct(g.at)}, calc(100% - 1px))`, borderColor: signal, opacity: 0.7 }} />
            ))}

            {stages.map((s) => (
              <div key={s.num} className="relative mb-4 last:mb-0">
                <p className="relative z-[1] mb-1.5 text-[12px] font-semibold" style={{ color: ink }}>
                  <span className="font-display mr-2 text-[11px]" style={{ color: signal }}>{s.num}</span>
                  {s.title}
                </p>
                {s.bars.map((b) => {
                  const c = COL[GROUP[b.lane]];
                  return (
                    <div key={b.label} className="relative mb-1 h-6 last:mb-0">
                      <div
                        className="absolute inset-y-0 flex items-center gap-1.5 overflow-hidden rounded-[4px] px-2.5"
                        style={{ left: pct(b.start), width: `max(${pct(b.len)}, 6px)`, background: c.bg, boxShadow: `inset 0 0 0 1px ${c.bd}` }}
                        title={`${b.label} · ${PLAN_LANE_LABEL[b.lane]} · день ${Math.round(b.start * 10) / 10 + 1}–${Math.ceil(b.start + b.len)}`}
                      >
                        {b.hitl ? <span aria-hidden className="inline-block h-2 w-2 shrink-0 rotate-45" style={{ background: warm }} /> : null}
                        <span className="truncate text-[11px]" style={{ color: ink }}>{b.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* легенда */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-4 text-[11.5px]" style={{ borderColor: line, color: soft }}>
            {([
              ["think", "исследование и проектирование"],
              ["make", "дизайн и контент"],
              ["build", "сборка, движок, интеграции"],
              ["qa", "тесты и запуск"],
            ] as const).map(([k, l]) => (
              <span key={k} className="inline-flex items-center gap-2">
                <i aria-hidden className="inline-block h-3 w-5 rounded-[3px]" style={{ background: COL[k].bg, boxShadow: `inset 0 0 0 1px ${COL[k].bd}` }} />
                {l}
              </span>
            ))}
            <span className="inline-flex items-center gap-2">
              <i aria-hidden className="inline-block h-2 w-2 rotate-45" style={{ background: warm }} />
              нужно ваше решение
            </span>
            <span className="inline-flex items-center gap-2">
              <i aria-hidden className="inline-block h-0 w-5 border-t border-dashed" style={{ borderColor: signal }} />
              гейт
            </span>
          </div>

          <ul className="mt-3 space-y-1.5 text-[11.5px]" style={{ color: soft }}>
            {gates.map((g) => (
              <li key={g.text} className="flex items-start gap-2.5">
                <span className="font-display shrink-0" style={{ color: ink }}>день {Math.round(g.at)}</span>
                <span>— {g.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </figure>
  );
}
