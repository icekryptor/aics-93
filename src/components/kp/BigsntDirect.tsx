"use client";

import { useMemo, useState } from "react";
import { DIRECT_BASE, UNIT_PRESETS, type DirectVals } from "@/lib/kp/bigsnt";
import { computeUnit } from "@/components/kp/BigsntUnitEconomics";

/* BigsntDirect — тот же бюджет Директа при двух конверсиях сайта: сейчас
   (пустой каталог, баннер «уходите на WB») и после запуска. Четыре ползунка,
   четыре плашки и две полосы, показывающие разницу в заказах на один и тот же
   бюджет. Дополнительная прибыль считается по экономике своего сайта со
   значениями по умолчанию из раздела 03 (реклама уже внутри бюджета, поэтому
   берётся маржа без ДРР).

   Вид один — документный лист. Проп tone оставлен для совместимости вызовов
   и не влияет на палитру. */

const rub = (n: number) => `${n < 0 ? "−" : ""}${Math.abs(Math.round(n)).toLocaleString("ru-RU")} ₽`;

const LINE = "var(--paper-line)";
const INK = "var(--paper-ink)";
const SOFT = "var(--paper-ink-soft)";
const ACCENT = "var(--paper-accent)";
const CARD = "var(--paper-card)";
const WARM = "#b4450f";
const GOOD = "#4a7a10";
const R = "10px";

const FIELDS: { key: keyof DirectVals; label: string; hint?: string; min: number; max: number; step: number; fmt: (v: number) => string }[] = [
  { key: "budget", label: "Бюджет Директа в месяц", min: 10000, max: 500000, step: 5000, fmt: rub },
  { key: "cpc", label: "Средняя цена клика", min: 5, max: 200, step: 1, fmt: rub },
  { key: "cr0", label: "Конверсия сайта сейчас", hint: "оценка при пустом каталоге", min: 0, max: 3, step: 0.1, fmt: (v) => `${v.toLocaleString("ru-RU")}%` },
  { key: "cr1", label: "Конверсия после запуска", hint: "норма e-com спортпита 1,5–3%", min: 0.5, max: 5, step: 0.1, fmt: (v) => `${v.toLocaleString("ru-RU")}%` },
];

export default function BigsntDirect({ tone }: { tone?: "dark" | "paper" }) {
  void tone; // лист — единственный вид; проп оставлен для совместимости вызовов

  const [v, setV] = useState<DirectVals>(DIRECT_BASE);

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

  const peak = Math.max(m.o0, m.o1, 1);
  const bars = [
    { label: "сейчас", val: m.o0, color: WARM, bg: "rgba(180,69,15,0.14)" },
    { label: "после запуска", val: m.o1, color: ACCENT, bg: "rgba(128,56,232,0.14)" },
  ];
  const ratio = m.o0 > 0 ? m.o1 / m.o0 : null;

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[320px_1fr]">
      <div className="self-start px-5 py-5" style={{ borderRadius: R, border: `1px solid ${LINE}`, background: CARD }}>
        {FIELDS.map((f) => (
          <div key={f.key} className="mb-3 last:mb-0">
            <label className="mb-1 flex items-baseline justify-between gap-3 text-[0.86rem]" style={{ color: SOFT }}>
              <span>
                {f.label}
                {f.hint ? <span className="block text-[0.72rem] opacity-80">{f.hint}</span> : null}
              </span>
              <output className="font-display whitespace-nowrap text-[0.8rem]" style={{ color: INK }}>{f.fmt(v[f.key])}</output>
            </label>
            <input
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={v[f.key]}
              onChange={(e) => setV((p) => ({ ...p, [f.key]: Number(e.target.value) }))}
              className="block w-full cursor-pointer"
              style={{ accentColor: ACCENT }}
              aria-label={f.label}
            />
          </div>
        ))}
      </div>

      <div className="grid min-w-0 gap-4 self-start">
        <div className="grid gap-3 sm:grid-cols-2">
          {tiles.map((t) => (
            <div key={t.k} className="px-5 py-4" style={{ borderRadius: R, border: `1px solid ${LINE}`, background: CARD }}>
              <p className="tech-label text-[10px]" style={{ color: SOFT }}>{t.k}</p>
              <p className="font-display mt-2 text-[1.7rem] leading-none" style={{ color: t.tone === "warm" ? WARM : t.tone === "good" ? GOOD : INK }}>{t.v}</p>
              <p className="mt-2 text-[0.82rem]" style={{ color: SOFT }}>{t.s}</p>
            </div>
          ))}
        </div>

        <div className="px-5 py-5" style={{ borderRadius: R, border: `1px solid ${LINE}`, background: CARD }}>
          <p className="text-[0.95rem] font-semibold" style={{ color: INK }}>Тот же бюджет — другое количество заказов</p>
          <p className="mt-1 text-[0.82rem]" style={{ color: SOFT }}>
            {rub(v.budget)} в месяц и {Math.round(m.clicks).toLocaleString("ru-RU")} кликов не меняются. Меняется только то, что человек видит, дойдя до сайта.
          </p>
          <div className="mt-4 grid gap-3">
            {bars.map((b) => {
              const w = Math.max(2, (b.val / peak) * 100);
              return (
                <div key={b.label} className="grid items-center gap-3 sm:grid-cols-[130px_1fr]">
                  <span className="text-[0.85rem]" style={{ color: SOFT }}>{b.label}</span>
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className="h-8 rounded-[4px]"
                      style={{ width: `${w}%`, background: b.bg, boxShadow: `inset 0 0 0 1.2px ${b.color}` }}
                    />
                    <span className="font-display whitespace-nowrap text-[0.95rem]" style={{ color: b.color }}>
                      {Math.round(b.val).toLocaleString("ru-RU")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3.5 text-[0.82rem]" style={{ color: SOFT }}>
            {ratio
              ? `Разница — в ${ratio.toLocaleString("ru-RU", { maximumFractionDigits: 1 })} раза: ${Math.round(m.o1 - m.o0).toLocaleString("ru-RU")} дополнительных заказов в месяц без единого лишнего рубля в Директе.`
              : `Сейчас пустой каталог не даёт заказов вовсе — все ${Math.round(m.o1).toLocaleString("ru-RU")} заказов после запуска добавляются к нулю.`}
          </p>
        </div>
      </div>
    </div>
  );
}
