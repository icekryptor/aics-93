"use client";

import { useMemo, useState } from "react";
import { UNIT_PRESETS, type UnitPreset } from "@/lib/kp/broker";

/* BrokerUnitEconomics — живая модель юнит-экономики брокера. Слева ползунки
   (спред, комиссия, своп, объёмы, доля B-book, привлечение, поток FTD,
   постоянные расходы), справа — распределение дохода с одного клиента баром
   и построчная структура. Смысл: на созвоне двигаем ползунки под цифры
   клиента, и порог окупаемости перестаёт быть абстракцией.

   Пресеты выставляют все ползунки разом; ручное движение снимает подсветку
   пресета — это честнее, чем оставлять активным сценарий, от которого ушли. */

type Vals = UnitPreset["values"];

const FIELDS: { key: keyof Vals; label: string; min: number; max: number; step: number; fmt: (v: number) => string }[] = [
  { key: "markup", label: "Наценка к спреду", min: 0, max: 4, step: 0.1, fmt: (v) => `${v.toFixed(1)} п.` },
  { key: "com", label: "Комиссия за лот", min: 0, max: 12, step: 0.5, fmt: (v) => `${v.toFixed(1)} $` },
  { key: "swap", label: "Своп-доход за лот", min: 0, max: 6, step: 0.5, fmt: (v) => `${v.toFixed(1)} $` },
  { key: "lots", label: "Лотов в месяц на клиента", min: 1, max: 15, step: 1, fmt: (v) => `${v}` },
  { key: "life", label: "Жизнь клиента", min: 1, max: 12, step: 1, fmt: (v) => `${v} мес` },
  { key: "dep", label: "Депозиты за жизнь", min: 100, max: 3000, step: 50, fmt: (v) => `${v.toLocaleString("ru-RU")} $` },
  { key: "bb", label: "B-book, % от депозитов", min: 0, max: 50, step: 1, fmt: (v) => `${v}%` },
  { key: "cac", label: "Привлечение клиента", min: 50, max: 800, step: 10, fmt: (v) => `${v.toLocaleString("ru-RU")} $` },
  { key: "ftd", label: "FTD в месяц", min: 30, max: 500, step: 10, fmt: (v) => `${v}` },
  { key: "opex", label: "Постоянные расходы, мес", min: 20000, max: 70000, step: 1000, fmt: (v) => `${v.toLocaleString("ru-RU")} $` },
];

const money = (n: number) => `${n < 0 ? "−" : ""}${Math.abs(Math.round(n)).toLocaleString("ru-RU")} $`;

export default function BrokerUnitEconomics({ tone = "dark" }: { tone?: "dark" | "paper" }) {
  const [vals, setVals] = useState<Vals>(UNIT_PRESETS[0].values);
  const [preset, setPreset] = useState<string | null>(UNIT_PRESETS[0].key);

  const paper = tone === "paper";
  const line = paper ? "var(--paper-line)" : "var(--color-runtime-line)";
  const soft = paper ? "var(--paper-ink-soft)" : "var(--color-runtime-ink-soft)";
  const ink = paper ? "var(--paper-ink)" : "var(--color-runtime-ink)";
  const signal = paper ? "var(--paper-accent)" : "var(--color-signal)";
  const warm = paper ? "#a8660b" : "#ff7050";
  const cardBg = paper ? "var(--paper-card)" : "rgba(23,16,41,0.45)";
  const shellRadius = paper ? "10px" : "25px 55px 55px 5px";

  const m = useMemo(() => {
    const lots = vals.lots * vals.life;
    const perLot = vals.markup * 10 + vals.com + vals.swap;
    const trade = lots * perLot;
    const bbook = (vals.dep * vals.bb) / 100;
    const nontrade = vals.dep * 0.05;
    const ltv = trade + bbook + nontrade;
    const variable = vals.dep * 0.05 + 10;
    const contrib = ltv - vals.cac - variable;
    const opexPer = vals.opex / vals.ftd;
    const profit = contrib - opexPer;
    const be = contrib > 0 ? Math.ceil(vals.opex / contrib) : null;
    const monthly = vals.ftd * contrib - vals.opex;
    const pc = (x: number) => (ltv > 0 ? Math.round((x / ltv) * 100) : 0);
    return { lots, perLot, trade, bbook, nontrade, ltv, variable, contrib, opexPer, profit, be, monthly, pc };
  }, [vals]);

  const set = (k: keyof Vals, v: number) => {
    setVals((p) => ({ ...p, [k]: v }));
    setPreset(null);
  };

  const segs = m.profit >= 0
    ? [
        { key: "cac", label: "Привлечение", val: vals.cac, bg: paper ? "rgba(168,102,11,0.18)" : "rgba(255,112,80,0.2)", bd: warm },
        { key: "var", label: "Платежи и сервисы", val: m.variable, bg: paper ? "rgba(168,102,11,0.08)" : "rgba(255,112,80,0.09)", bd: warm },
        { key: "opx", label: "Доля постоянных", val: m.opexPer, bg: paper ? "rgba(30,36,48,0.08)" : "rgba(255,255,255,0.07)", bd: soft },
        { key: "pft", label: "Прибыль", val: m.profit, bg: paper ? "rgba(128,56,232,0.12)" : "rgba(151,71,255,0.22)", bd: signal },
      ]
    : [];
  const segTotal = segs.reduce((s, x) => s + x.val, 0) || 1;

  const kpis = [
    { k: "LTV клиента", v: money(m.ltv), s: "валовый доход за жизнь" },
    { k: "Контрибуция", v: money(m.contrib), s: "LTV минус привлечение и платежи", warn: m.contrib < 0 },
    { k: "Безубыточность", v: m.be ? `${m.be} FTD` : "—", s: "в месяц, покрывает постоянные" },
    { k: "Прибыль в месяц", v: `${m.monthly >= 0 ? "+" : ""}${money(m.monthly)}`, s: `доход ${money(vals.ftd * m.ltv)}/мес`, warn: m.monthly < 0 },
  ];

  const rows: { label: string; val: number; sub?: boolean; total?: boolean }[] = [
    { label: "Доход с клиента — LTV", val: m.ltv },
    { label: `Транзакционный: ${m.lots} лотов × ${m.perLot.toFixed(1)} $`, val: m.trade, sub: true },
    { label: "B-book, ожидаемый вклад", val: m.bbook, sub: true },
    { label: "Неторговый: конвертация и вывод", val: m.nontrade, sub: true },
    { label: "Привлечение клиента", val: -vals.cac },
    { label: "Платежи и сервисы", val: -m.variable },
    { label: "Доля постоянных расходов", val: -m.opexPer },
    { label: "Прибыль на клиента", val: m.profit, total: true },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      {/* ---------- ползунки ---------- */}
      <div
        className="self-start px-5 py-5"
        style={{ borderRadius: paper ? "10px" : "20px", border: `1px solid ${line}`, background: cardBg }}
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {UNIT_PRESETS.map((p) => {
            const on = preset === p.key;
            return (
              <button
                key={p.key}
                type="button"
                title={p.hint}
                aria-pressed={on}
                onClick={() => {
                  setVals(p.values);
                  setPreset(p.key);
                }}
                className="tech-label cursor-pointer rounded-[3px] px-3 py-1.5 text-[11px] transition-colors"
                style={
                  on
                    ? { background: signal, color: "#ffffff" }
                    : { border: `1px solid ${line}`, color: soft }
                }
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {FIELDS.map((f) => (
          <div key={f.key} className="mb-3 last:mb-0">
            <label className="mb-1 flex items-baseline justify-between gap-3 text-[0.86rem]" style={{ color: soft }}>
              <span>{f.label}</span>
              <output className="font-display text-[0.8rem]" style={{ color: ink }}>
                {f.fmt(vals[f.key])}
              </output>
            </label>
            <input
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={vals[f.key]}
              onChange={(e) => set(f.key, Number(e.target.value))}
              className="block w-full cursor-pointer"
              style={{ accentColor: signal }}
            />
          </div>
        ))}
        <p className="mt-3 text-[0.78rem]" style={{ color: soft }}>
          B-book в нуле — чистый A-book. Значение ожидаемое: месяц к месяцу волатильно.
        </p>
      </div>

      {/* ---------- результат ---------- */}
      <div className="flex min-w-0 flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((x) => (
            <div
              key={x.k}
              className="px-4 py-3.5"
              style={{ borderRadius: paper ? "10px" : "18px", border: `1px solid ${line}`, background: cardBg }}
            >
              <p className="tech-label text-[10px]" style={{ color: soft }}>{x.k}</p>
              <p className="font-display mt-1.5 text-[1.35rem] leading-tight" style={{ color: x.warn ? warm : ink }}>
                {x.v}
              </p>
              <p className="mt-1 text-[0.82rem]" style={{ color: soft }}>{x.s}</p>
            </div>
          ))}
        </div>

        <div className="px-5 py-5" style={{ borderRadius: shellRadius, border: `1px solid ${line}`, background: cardBg }}>
          <p className="text-[0.95rem] font-semibold" style={{ color: ink }}>
            Распределение дохода с клиента
          </p>
          {m.profit >= 0 ? (
            <>
              <div className="mt-3.5 flex h-11 gap-[2px]">
                {segs.map((s) => {
                  const w = (s.val / segTotal) * 100;
                  return (
                    <div
                      key={s.key}
                      title={`${s.label}: ${money(s.val)}`}
                      className="flex min-w-0 items-center justify-center overflow-hidden rounded-[5px]"
                      style={{ width: `${w}%`, background: s.bg, boxShadow: `inset 0 0 0 1.2px ${s.bd}` }}
                    >
                      {w >= 8 && (
                        <span className="font-display text-[11px]" style={{ color: ink }}>
                          {m.pc(s.val)}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[0.85rem]" style={{ color: soft }}>
                {segs.map((s) => (
                  <span key={s.key} className="inline-flex items-center gap-2">
                    <i
                      aria-hidden
                      className="inline-block h-3.5 w-3.5 rounded-[3px]"
                      style={{ background: s.bg, boxShadow: `inset 0 0 0 1.2px ${s.bd}` }}
                    />
                    {s.label}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-3 text-[0.95rem] font-semibold" style={{ color: warm }}>
              Убыточно: расходы на клиента превышают доход с него — минус {money(Math.abs(m.monthly))} в месяц.
            </p>
          )}
        </div>

        <div className="px-5 py-2" style={{ borderRadius: paper ? "10px" : "18px", border: `1px solid ${line}`, background: cardBg }}>
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-baseline justify-between gap-4 py-2.5"
              style={
                r.total
                  ? { borderTop: `2px solid ${ink}` }
                  : { borderBottom: `1px solid ${line}`, paddingLeft: r.sub ? 22 : 0 }
              }
            >
              <span
                className={r.sub ? "text-[0.9rem]" : "text-[0.95rem] font-semibold"}
                style={{ color: r.sub ? soft : ink }}
              >
                {r.label}
              </span>
              <span className="whitespace-nowrap text-right">
                <span
                  className="font-display text-[0.95rem]"
                  style={{ color: r.total && r.val < 0 ? warm : ink }}
                >
                  {r.val >= 0 && r.total ? "+" : ""}
                  {money(r.val)}
                </span>
                <span className="block text-[0.75rem]" style={{ color: soft }}>
                  {m.pc(Math.abs(r.val))}%
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
