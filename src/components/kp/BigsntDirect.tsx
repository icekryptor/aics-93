"use client";

import { useMemo, useState } from "react";
import { DIRECT_BASE, UNIT_PRESETS, type DirectVals } from "@/lib/kp/bigsnt";
import { computeUnit } from "@/components/kp/BigsntUnitEconomics";

/* BigsntDirect — тот же бюджет Директа при двух конверсиях сайта: сейчас
   (пустой каталог, баннер «уходите на WB») и после запуска. Четыре ползунка,
   четыре плашки. Дополнительная прибыль считается по экономике своего сайта
   с значениями по умолчанию из раздела 03 (реклама уже внутри бюджета,
   поэтому берётся маржа без ДРР). tone dark/paper. */

const rub = (n: number) => `${n < 0 ? "−" : ""}${Math.abs(Math.round(n)).toLocaleString("ru-RU")} ₽`;

const FIELDS: { key: keyof DirectVals; label: string; hint?: string; min: number; max: number; step: number; fmt: (v: number) => string }[] = [
  { key: "budget", label: "Бюджет Директа в месяц", min: 10000, max: 500000, step: 5000, fmt: rub },
  { key: "cpc", label: "Средняя цена клика", min: 5, max: 200, step: 1, fmt: rub },
  { key: "cr0", label: "Конверсия сайта сейчас", hint: "оценка при пустом каталоге", min: 0, max: 3, step: 0.1, fmt: (v) => `${v.toLocaleString("ru-RU")}%` },
  { key: "cr1", label: "Конверсия после запуска", hint: "норма e-com спортпита 1,5–3%", min: 0.5, max: 5, step: 0.1, fmt: (v) => `${v.toLocaleString("ru-RU")}%` },
];

export default function BigsntDirect({ tone = "dark" }: { tone?: "dark" | "paper" }) {
  const [v, setV] = useState<DirectVals>(DIRECT_BASE);
  const paper = tone === "paper";
  const line = paper ? "var(--paper-line)" : "var(--color-runtime-line)";
  const soft = paper ? "var(--paper-ink-soft)" : "var(--color-runtime-ink-soft)";
  const ink = paper ? "var(--paper-ink)" : "var(--color-runtime-ink)";
  const signal = paper ? "var(--paper-accent)" : "var(--color-signal)";
  const warm = paper ? "#b4450f" : "#ff7050";
  const good = paper ? "#4a7a10" : "#c5ff44";
  const cardBg = paper ? "var(--paper-card)" : "rgba(23,16,41,0.45)";

  const m = useMemo(() => {
    const clicks = v.cpc > 0 ? v.budget / v.cpc : 0;
    const o0 = (clicks * v.cr0) / 100;
    const o1 = (clicks * v.cr1) / 100;
    const u = computeUnit(UNIT_PRESETS[0].values);
    const marginNoAds = u.P - u.C - (u.P * UNIT_PRESETS[0].values.acq) / 100 - u.sLogi;
    return { clicks, o0, o1, cpo0: o0 > 0 ? v.budget / o0 : null, cpo1: o1 > 0 ? v.budget / o1 : null, gain: (o1 - o0) * marginNoAds };
  }, [v]);

  const tiles = [
    { k: "Кликов в месяц", v: Math.round(m.clicks).toLocaleString("ru-RU"), s: "бюджет ÷ цена клика" },
    { k: "Заказов сейчас", v: Math.round(m.o0).toLocaleString("ru-RU"), s: m.cpo0 ? `стоимость заказа ${rub(m.cpo0)}` : "заказов нет", tone: "warm" as const },
    { k: "Заказов после запуска", v: Math.round(m.o1).toLocaleString("ru-RU"), s: m.cpo1 ? `стоимость заказа ${rub(m.cpo1)}` : "—", tone: "good" as const },
    { k: "Дополнительная прибыль", v: `${m.gain >= 0 ? "+" : ""}${rub(m.gain)}`, s: "в месяц, при том же бюджете", tone: "good" as const },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <div className="self-start px-5 py-5" style={{ borderRadius: paper ? "10px" : "20px", border: `1px solid ${line}`, background: cardBg }}>
        {FIELDS.map((f) => (
          <div key={f.key} className="mb-3 last:mb-0">
            <label className="mb-1 flex items-baseline justify-between gap-3 text-[0.86rem]" style={{ color: soft }}>
              <span>
                {f.label}
                {f.hint ? <span className="block text-[0.72rem] opacity-80">{f.hint}</span> : null}
              </span>
              <output className="font-display whitespace-nowrap text-[0.8rem]" style={{ color: ink }}>{f.fmt(v[f.key])}</output>
            </label>
            <input
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={v[f.key]}
              onChange={(e) => setV((p) => ({ ...p, [f.key]: Number(e.target.value) }))}
              className="block w-full cursor-pointer"
              style={{ accentColor: signal }}
              aria-label={f.label}
            />
          </div>
        ))}
      </div>
      <div className="grid gap-3 self-start sm:grid-cols-2">
        {tiles.map((t) => (
          <div key={t.k} className="px-5 py-4" style={{ borderRadius: paper ? "10px" : "18px", border: `1px solid ${line}`, background: cardBg }}>
            <p className="tech-label text-[10px]" style={{ color: soft }}>{t.k}</p>
            <p className="font-display mt-2 text-[1.7rem] leading-none" style={{ color: t.tone === "warm" ? warm : t.tone === "good" ? good : ink }}>{t.v}</p>
            <p className="mt-2 text-[0.82rem]" style={{ color: soft }}>{t.s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
