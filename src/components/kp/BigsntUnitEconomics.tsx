"use client";

import { useMemo, useState } from "react";
import { UNIT_PRESETS, TIERS_PRICE, type UnitVals } from "@/lib/kp/bigsnt";

/* BigsntUnitEconomics — живая экономика одного заказа: маркетплейс против
   своего сайта. Слева ползунки в трёх группах (товар / площадка / свой сайт),
   справа — прибыль с заказа по двум каналам, бар «каждые 100 ₽ покупателя»
   для обоих, построчная структура и окупаемость трёх объёмов работ.

   Ключевая поправка модели: на WB комиссия и ДРР считаются от цены продавца
   до СПП, а сама СПП финансируется площадкой. Покупатель платит одну и ту же
   сумму в обоих каналах — так сравнение честное. Пресет выставляет ползунки
   площадки разом; ручное движение снимает подсветку пресета. tone dark/paper. */

type Field = { key: keyof UnitVals; label: string; hint?: string; min: number; max: number; step: number; fmt: (v: number) => string };

const rub = (n: number) => `${n < 0 ? "−" : ""}${Math.abs(Math.round(n)).toLocaleString("ru-RU")} ₽`;
const pct = (n: number) => `${n.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`;

const GROUPS: { title: string; fields: Field[] }[] = [
  {
    title: "товар",
    fields: [
      { key: "price", label: "Цена для покупателя", hint: "одна и та же на площадке и на сайте", min: 500, max: 4000, step: 10, fmt: rub },
      { key: "cogs", label: "Себестоимость единицы", min: 150, max: 2500, step: 10, fmt: rub },
      { key: "orders", label: "Заказов в месяц", min: 100, max: 5000, step: 50, fmt: (v) => `${v.toLocaleString("ru-RU")} шт` },
      { key: "cycle", label: "Цикл повторной покупки", min: 2, max: 12, step: 1, fmt: (v) => `${v} нед` },
    ],
  },
  {
    title: "маркетплейс",
    fields: [
      { key: "spp", label: "СПП — скидка за счёт площадки", hint: "WB 23–25%, точную площадка не показывает", min: 0, max: 45, step: 0.5, fmt: pct },
      { key: "comm", label: "Комиссия от цены продавца", hint: "WB спортпит 29–39%", min: 5, max: 60, step: 0.5, fmt: pct },
      { key: "mpLogi", label: "Логистика до клиента", min: 0, max: 300, step: 5, fmt: rub },
      { key: "mpStore", label: "Хранение, приёмка, невыкуп", min: 0, max: 200, step: 5, fmt: rub },
      { key: "mpAds", label: "Реклама на площадке, ДРР", hint: "лидеры 4–7%, середина 10–17%", min: 0, max: 30, step: 0.5, fmt: pct },
    ],
  },
  {
    title: "свой сайт",
    fields: [
      { key: "acq", label: "Эквайринг", min: 0, max: 5, step: 0.1, fmt: pct },
      { key: "sLogi", label: "Доставка за ваш счёт", hint: "часть платит покупатель", min: 0, max: 500, step: 5, fmt: rub },
      { key: "sPack", label: "Упаковка и сборка", min: 0, max: 150, step: 5, fmt: rub },
      { key: "sAds", label: "Реклама на первый заказ, ДРР", hint: "на повторах → 0", min: 0, max: 40, step: 0.5, fmt: pct },
      { key: "sFix", label: "Платформа в месяц", hint: "хостинг, платёжка, поддержка", min: 0, max: 60000, step: 1000, fmt: rub },
    ],
  },
];

export function computeUnit(v: UnitVals) {
  const P = v.price, C = v.cogs, N = Math.max(1, v.orders);
  const spp = Math.min(v.spp, 95) / 100;
  const Ps = P / (1 - spp);
  const sppAmt = Ps - P;
  const commGross = (Ps * v.comm) / 100;
  const commNet = commGross - sppAmt; // что площадка реально оставляет себе из денег покупателя
  const mpLogi = v.mpLogi + v.mpStore;
  const mpAds = (Ps * v.mpAds) / 100;
  const mpPayout = Ps - commGross - mpLogi - mpAds;
  const mpProfit = mpPayout - C;

  const sFixPer = v.sFix / N;
  const sPlat = (P * v.acq) / 100 + sFixPer;
  const sLogi = v.sLogi + v.sPack;
  const sAds = (P * v.sAds) / 100;
  const sNet = P - sPlat - sLogi - sAds;
  const sProfit = sNet - C;
  const sRepeat = P - sPlat - sLogi - C; // повтор — без рекламы

  const repeats = Math.max(0, Math.round(52 / Math.max(1, v.cycle)) - 1);
  const ltvMp = mpProfit * repeats;
  const ltvSite = sRepeat * repeats;
  const delta = sRepeat - mpProfit;
  const payback = TIERS_PRICE.map((t) => (delta > 0 ? Math.ceil(t / delta) : null));

  return { P, C, N, Ps, sppAmt, commGross, commNet, mpLogi, mpAds, mpPayout, mpProfit, sPlat, sLogi, sAds, sNet, sProfit, sRepeat, repeats, ltvMp, ltvSite, delta, payback };
}

export default function BigsntUnitEconomics({ tone = "dark" }: { tone?: "dark" | "paper" }) {
  const [vals, setVals] = useState<UnitVals>(UNIT_PRESETS[0].values);
  const [preset, setPreset] = useState<string | null>(UNIT_PRESETS[0].key);

  const paper = tone === "paper";
  const line = paper ? "var(--paper-line)" : "var(--color-runtime-line)";
  const soft = paper ? "var(--paper-ink-soft)" : "var(--color-runtime-ink-soft)";
  const ink = paper ? "var(--paper-ink)" : "var(--color-runtime-ink)";
  const signal = paper ? "var(--paper-accent)" : "var(--color-signal)";
  const warm = paper ? "#b4450f" : "#ff7050";
  const good = paper ? "#4a7a10" : "#c5ff44";
  const cardBg = paper ? "var(--paper-card)" : "rgba(23,16,41,0.45)";
  const radius = paper ? "10px" : "20px";
  const shellRadius = paper ? "10px" : "25px 55px 55px 5px";

  const m = useMemo(() => computeUnit(vals), [vals]);
  const set = (k: keyof UnitVals, v: number) => {
    setVals((p) => ({ ...p, [k]: v }));
    setPreset(null);
  };
  const mpName = UNIT_PRESETS.find((p) => p.key === preset)?.label ?? "Маркетплейс";

  /* сегменты бара — от цены покупателя; порядок и палитра общие для обоих каналов */
  const SEG = paper
    ? { cogs: { bg: "rgba(30,36,48,0.10)", bd: "#565d70" }, plat: { bg: "rgba(180,69,15,0.16)", bd: "#b4450f" }, logi: { bg: "rgba(30,138,122,0.16)", bd: "#1e8a7a" }, ads: { bg: "rgba(138,91,184,0.16)", bd: "#8a5bb8" }, profit: { bg: "rgba(74,122,16,0.18)", bd: "#4a7a10" } }
    : { cogs: { bg: "rgba(255,255,255,0.07)", bd: "var(--color-runtime-ink-soft)" }, plat: { bg: "rgba(255,112,80,0.2)", bd: "#ff7050" }, logi: { bg: "rgba(95,217,245,0.18)", bd: "#5fd9f5" }, ads: { bg: "rgba(201,182,255,0.18)", bd: "var(--color-signal-cool)" }, profit: { bg: "rgba(197,255,68,0.18)", bd: "#c5ff44" } };

  const bars = [
    {
      name: mpName,
      segs: [
        { k: "cogs", label: "Себестоимость", val: m.C },
        { k: "plat", label: "Комиссия за вычетом СПП", val: Math.max(0, m.commNet) },
        { k: "logi", label: "Логистика, хранение, невыкуп", val: m.mpLogi },
        { k: "ads", label: "Реклама площадки", val: m.mpAds },
        { k: "profit", label: "Ваша прибыль", val: m.mpProfit },
      ],
    },
    {
      name: "Свой сайт",
      segs: [
        { k: "cogs", label: "Себестоимость", val: m.C },
        { k: "plat", label: "Эквайринг и платформа", val: m.sPlat },
        { k: "logi", label: "Доставка и упаковка", val: m.sLogi },
        { k: "ads", label: "Директ на первый заказ", val: m.sAds },
        { k: "profit", label: "Ваша прибыль", val: m.sProfit },
      ],
    },
  ];

  const kpis = [
    { k: `${mpName} · с заказа`, v: rub(m.mpProfit), s: `выплата ${rub(m.mpPayout)} минус себестоимость`, warn: m.mpProfit < 0 },
    { k: "Свой сайт · с заказа", v: rub(m.sProfit), s: `повтор без рекламы — ${rub(m.sRepeat)}`, warn: m.sProfit < 0, good: m.sProfit > m.mpProfit },
    { k: "Один клиент за год", v: `${m.ltvSite - m.ltvMp >= 0 ? "+" : ""}${rub(m.ltvSite - m.ltvMp)}`, s: `${m.repeats} повторных заказов: ${rub(m.ltvSite)} на сайте против ${rub(m.ltvMp)}`, good: m.ltvSite > m.ltvMp },
    { k: "Прибыль в месяц", v: `${rub(m.sProfit * m.N)}`, s: `на сайте при ${m.N.toLocaleString("ru-RU")} заказах; на площадке ${rub(m.mpProfit * m.N)}` },
  ];

  const colRows = (side: "mp" | "site") =>
    side === "mp"
      ? [
          { label: "Покупатель платит", val: m.P },
          { label: vals.spp > 0 ? `Цена продавца до СПП ${pct(vals.spp)}` : "Цена продавца (СПП нет)", val: m.Ps, sub: true },
          { label: `Комиссия ${pct(vals.comm)} от цены продавца`, val: -m.commGross, sub: true },
          { label: "Логистика, хранение, невыкуп", val: -m.mpLogi, sub: true },
          { label: "Реклама площадки", val: -m.mpAds, sub: true },
          { label: "Выплата продавцу", val: m.mpPayout },
          { label: "Себестоимость", val: -m.C, sub: true },
          { label: "Прибыль с заказа", val: m.mpProfit, total: true },
        ]
      : [
          { label: "Покупатель платит", val: m.P },
          { label: "Эквайринг и платформа", val: -m.sPlat, sub: true },
          { label: "Доставка и упаковка", val: -m.sLogi, sub: true },
          { label: "Директ на первый заказ", val: -m.sAds, sub: true },
          { label: "Остаётся после канала", val: m.sNet },
          { label: "Себестоимость", val: -m.C, sub: true },
          { label: "Прибыль с заказа", val: m.sProfit, total: true },
        ];

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      {/* ---------- ползунки ---------- */}
      <div className="self-start px-5 py-5" style={{ borderRadius: radius, border: `1px solid ${line}`, background: cardBg }}>
        <div className="mb-3 flex flex-wrap gap-2">
          {UNIT_PRESETS.map((p) => {
            const on = preset === p.key;
            return (
              <button
                key={p.key}
                type="button"
                title={p.hint}
                aria-pressed={on}
                onClick={() => {
                  setVals((prev) => ({ ...prev, spp: p.values.spp, comm: p.values.comm, mpLogi: p.values.mpLogi, mpStore: p.values.mpStore }));
                  setPreset(p.key);
                }}
                className="tech-label cursor-pointer rounded-[3px] px-3 py-1.5 text-[11px] transition-colors"
                style={on ? { background: signal, color: "#ffffff" } : { border: `1px solid ${line}`, color: soft }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        {GROUPS.map((g) => (
          <div key={g.title} className="border-t pt-3.5 pb-1" style={{ borderColor: line }}>
            <p className="tech-label mb-2.5 text-[10.5px]" style={{ color: signal }}>[ {g.title} ]</p>
            {g.fields.map((f) => (
              <div key={f.key} className="mb-3 last:mb-2">
                <label className="mb-1 flex items-baseline justify-between gap-3 text-[0.86rem]" style={{ color: soft }}>
                  <span>
                    {f.label}
                    {f.hint ? <span className="block text-[0.72rem] opacity-80">{f.hint}</span> : null}
                  </span>
                  <output className="font-display whitespace-nowrap text-[0.8rem]" style={{ color: ink }}>{f.fmt(vals[f.key])}</output>
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
                  aria-label={f.label}
                />
              </div>
            ))}
          </div>
        ))}
        <p className="mt-2 text-[0.78rem]" style={{ color: soft }}>
          Ozon: СПП в нуле, в комиссию сложены эквайринг и последняя миля. Ставки пересматриваются несколько раз в год — сверьте с кабинетом.
        </p>
      </div>

      {/* ---------- результат ---------- */}
      <div className="flex min-w-0 flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((x) => (
            <div key={x.k} className="px-4 py-3.5" style={{ borderRadius: paper ? "10px" : "18px", border: `1px solid ${line}`, background: cardBg }}>
              <p className="tech-label text-[10px]" style={{ color: soft }}>{x.k}</p>
              <p className="font-display mt-1.5 text-[1.3rem] leading-tight" style={{ color: x.warn ? warm : x.good ? good : ink }}>{x.v}</p>
              <p className="mt-1 text-[0.8rem] leading-snug" style={{ color: soft }}>{x.s}</p>
            </div>
          ))}
        </div>

        <div className="px-5 py-5" style={{ borderRadius: shellRadius, border: `1px solid ${line}`, background: cardBg }}>
          <p className="text-[0.95rem] font-semibold" style={{ color: ink }}>Каждые 100 ₽, которые заплатил покупатель</p>
          <p className="mt-1 text-[0.82rem]" style={{ color: soft }}>Одна шкала для обоих каналов. Для площадки «комиссия» показана уже за вычетом СПП, которую она финансирует сама.</p>
          <div className="mt-4 grid gap-3">
            {bars.map((b) => {
              const total = m.P || 1;
              return (
                <div key={b.name} className="grid items-center gap-3 sm:grid-cols-[110px_1fr]">
                  <span className="text-[0.85rem] font-semibold" style={{ color: ink }}>{b.name}</span>
                  <div className="flex h-10 gap-[2px]">
                    {b.segs.map((s) => {
                      const neg = s.val < 0;
                      const w = Math.min(100, (Math.abs(s.val) / total) * 100);
                      const c = SEG[s.k as keyof typeof SEG];
                      return (
                        <div
                          key={s.k}
                          title={`${s.label}: ${rub(s.val)} · ${Math.round(w)}%`}
                          className="flex min-w-0 items-center justify-center overflow-hidden rounded-[4px]"
                          style={{ width: `${w}%`, background: neg ? "transparent" : c.bg, boxShadow: `inset 0 0 0 1.2px ${neg ? warm : c.bd}`, opacity: neg ? 0.8 : 1 }}
                        >
                          {w >= 7 && <span className="font-display text-[10.5px]" style={{ color: ink }}>{Math.round(w)}%</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2 text-[0.82rem]" style={{ color: soft }}>
            {[
              ["cogs", "Себестоимость"],
              ["plat", "Площадка / эквайринг"],
              ["logi", "Логистика и упаковка"],
              ["ads", "Реклама"],
              ["profit", "Ваша прибыль"],
            ].map(([k, l]) => {
              const c = SEG[k as keyof typeof SEG];
              return (
                <span key={k} className="inline-flex items-center gap-2">
                  <i aria-hidden className="inline-block h-3.5 w-3.5 rounded-[3px]" style={{ background: c.bg, boxShadow: `inset 0 0 0 1.2px ${c.bd}` }} />
                  {l}
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {(["mp", "site"] as const).map((side) => (
            <div key={side} className="px-5 py-2" style={{ borderRadius: paper ? "10px" : "18px", border: `1px solid ${line}`, background: cardBg }}>
              <p className="tech-label pt-3 text-[10px]" style={{ color: signal }}>[ {side === "mp" ? mpName.toLowerCase() : "свой сайт"} ]</p>
              {colRows(side).map((r) => (
                <div
                  key={r.label}
                  className="flex items-baseline justify-between gap-4 py-2"
                  style={r.total ? { borderTop: `2px solid ${ink}` } : { borderBottom: `1px solid ${line}`, paddingLeft: r.sub ? 16 : 0 }}
                >
                  <span className={r.sub ? "text-[0.86rem]" : "text-[0.92rem] font-semibold"} style={{ color: r.sub ? soft : ink }}>{r.label}</span>
                  <span className="font-display whitespace-nowrap text-[0.9rem]" style={{ color: r.total ? (r.val < 0 ? warm : good) : ink }}>{rub(r.val)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="px-5 py-4" style={{ borderRadius: paper ? "10px" : "18px", border: `1px solid ${line}`, background: cardBg }}>
          <p className="text-[0.95rem] font-semibold" style={{ color: ink }}>Окупаемость — в переведённых повторных заказах</p>
          <p className="mt-1 text-[0.82rem]" style={{ color: soft }}>
            Каждый повтор, который клиент сделал на сайте вместо площадки, приносит на {m.delta > 0 ? rub(m.delta) : "—"} больше. Сколько таких заказов окупает каждый объём работ:
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {["01 · Магазин", "02 · Магазин + рефреш", "03 · Платформа"].map((t, i) => (
              <div key={t} className="rounded-[8px] px-3.5 py-3" style={{ border: `1px solid ${line}` }}>
                <p className="tech-label text-[10px]" style={{ color: soft }}>{t}</p>
                <p className="font-display mt-1 text-[1.15rem]" style={{ color: m.payback[i] ? ink : warm }}>
                  {m.payback[i] ? `${m.payback[i]!.toLocaleString("ru-RU")} заказов` : "не окупается"}
                </p>
                <p className="mt-0.5 text-[0.78rem]" style={{ color: soft }}>
                  {m.payback[i] ? `≈ ${Math.ceil(m.payback[i]! / Math.max(1, m.N * 0.25))} мес при переводе четверти заказов` : "измените вводные"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
