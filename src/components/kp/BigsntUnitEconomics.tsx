"use client";

import { useMemo, useState, type ReactNode } from "react";
import { UNIT_PRESETS, TIERS_PRICE, type UnitVals } from "@/lib/kp/bigsnt";

/* BigsntUnitEconomics — живая экономика одного заказа, разложенная на три шага:
   общие вводные по товару → два независимых калькулятора (маркетплейс и свой
   сайт) → сравнительная панель с KPI, шкалой «каждые 100 ₽» и двумя графиками
   (год одного клиента и окупаемость объёмов работ).

   Ключевая поправка модели: на WB комиссия и ДРР считаются от цены продавца
   до СПП, а сама СПП финансируется площадкой. Покупатель платит одну и ту же
   сумму в обоих каналах — так сравнение честное. Пресет выставляет ползунки
   площадки разом; ручное движение снимает подсветку пресета.

   Вид один — документный лист. Проп tone оставлен для совместимости вызовов
   и не влияет на палитру. */

type Field = { key: keyof UnitVals; label: string; hint?: string; min: number; max: number; step: number; fmt: (v: number) => string };

const rub = (n: number) => `${n < 0 ? "−" : ""}${Math.abs(Math.round(n)).toLocaleString("ru-RU")} ₽`;
const pct = (n: number) => `${n.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`;
const kRub = (n: number) =>
  Math.abs(n) >= 1000 ? `${n < 0 ? "−" : ""}${Math.round(Math.abs(n) / 1000).toLocaleString("ru-RU")} тыс` : `${Math.round(n)}`;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const plural = (n: number, one: string, few: string, many: string) => {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b > 1 && b < 5) return few;
  return b === 1 ? one : many;
};

/* ---------- палитра листа ---------- */
const LINE = "var(--paper-line)";
const INK = "var(--paper-ink)";
const SOFT = "var(--paper-ink-soft)";
const ACCENT = "var(--paper-accent)";
const CARD = "var(--paper-card)";
const WARM = "#b4450f";
const GOOD = "#4a7a10";
const MP_LINE = "#6b7a94";
const R = "10px";

const SEG = {
  cogs: { bg: "rgba(30,36,48,0.10)", bd: "#565d70" },
  plat: { bg: "rgba(180,69,15,0.16)", bd: "#b4450f" },
  logi: { bg: "rgba(30,138,122,0.16)", bd: "#1e8a7a" },
  ads: { bg: "rgba(138,91,184,0.16)", bd: "#8a5bb8" },
  profit: { bg: "rgba(74,122,16,0.18)", bd: "#4a7a10" },
};

const PRODUCT_FIELDS: Field[] = [
  { key: "price", label: "Цена для покупателя", hint: "одна и та же на площадке и на сайте", min: 500, max: 4000, step: 10, fmt: rub },
  { key: "cogs", label: "Себестоимость единицы", min: 150, max: 2500, step: 10, fmt: rub },
  { key: "orders", label: "Заказов в месяц", min: 100, max: 5000, step: 50, fmt: (v) => `${v.toLocaleString("ru-RU")} шт` },
  { key: "cycle", label: "Цикл повторной покупки", min: 2, max: 12, step: 1, fmt: (v) => `${v} нед` },
];

const MP_FIELDS: Field[] = [
  { key: "spp", label: "СПП — скидка за счёт площадки", hint: "WB 23–25%, точную площадка не показывает", min: 0, max: 45, step: 0.5, fmt: pct },
  { key: "comm", label: "Комиссия от цены продавца", hint: "WB спортпит 29–39%", min: 5, max: 60, step: 0.5, fmt: pct },
  { key: "mpLogi", label: "Логистика до клиента", min: 0, max: 300, step: 5, fmt: rub },
  { key: "mpStore", label: "Хранение, приёмка, невыкуп", min: 0, max: 200, step: 5, fmt: rub },
  { key: "mpAds", label: "Реклама на площадке, ДРР", hint: "лидеры 4–7%, середина 10–17%", min: 0, max: 30, step: 0.5, fmt: pct },
];

const SITE_FIELDS: Field[] = [
  { key: "acq", label: "Эквайринг", min: 0, max: 5, step: 0.1, fmt: pct },
  { key: "sLogi", label: "Доставка за ваш счёт", hint: "часть платит покупатель", min: 0, max: 500, step: 5, fmt: rub },
  { key: "sPack", label: "Упаковка и сборка", min: 0, max: 150, step: 5, fmt: rub },
  { key: "sAds", label: "Реклама на первый заказ, ДРР", hint: "на повторах → 0", min: 0, max: 40, step: 0.5, fmt: pct },
  { key: "sFix", label: "Платформа в месяц", hint: "хостинг, платёжка, поддержка", min: 0, max: 60000, step: 1000, fmt: rub },
];

const PRESET_KEYS: (keyof UnitVals)[] = ["spp", "comm", "mpLogi", "mpStore"];
const TIER_NAMES = ["01 · Магазин", "02 · Магазин + рефреш"];
const tierName = (i: number) => TIER_NAMES[i] ?? `Объём ${i + 1}`;

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

/* ---------- мелкие кирпичи ---------- */

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 ${className}`} style={{ borderRadius: R, border: `1px solid ${LINE}`, background: CARD }}>
      {children}
    </div>
  );
}

function Slider({ f, value, onChange }: { f: Field; value: number; onChange: (v: number) => void }) {
  return (
    <div className="min-w-0">
      <label className="mb-1 flex items-baseline justify-between gap-3 text-[0.86rem]" style={{ color: SOFT }}>
        <span>
          {f.label}
          {f.hint ? <span className="block text-[0.72rem] opacity-80">{f.hint}</span> : null}
        </span>
        <output className="font-display whitespace-nowrap text-[0.8rem]" style={{ color: INK }}>{f.fmt(value)}</output>
      </label>
      <input
        type="range"
        min={f.min}
        max={f.max}
        step={f.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="block w-full cursor-pointer"
        style={{ accentColor: ACCENT }}
        aria-label={f.label}
      />
    </div>
  );
}

type Seg = { k: keyof typeof SEG; label: string; val: number };

function SegBar({ segs, total }: { segs: Seg[]; total: number }) {
  const base = total || 1;
  return (
    <div className="flex h-9 gap-[2px]">
      {segs.map((s) => {
        const neg = s.val < 0;
        const w = Math.min(100, (Math.abs(s.val) / base) * 100);
        const c = SEG[s.k];
        return (
          <div
            key={s.k}
            title={`${s.label}: ${rub(s.val)} · ${Math.round(w)}%`}
            className="flex min-w-0 items-center justify-center overflow-hidden rounded-[4px]"
            style={{ width: `${w}%`, background: neg ? "transparent" : c.bg, boxShadow: `inset 0 0 0 1.2px ${neg ? WARM : c.bd}`, opacity: neg ? 0.8 : 1 }}
          >
            {w >= 7 && <span className="font-display text-[10.5px]" style={{ color: INK }}>{Math.round(w)}%</span>}
          </div>
        );
      })}
    </div>
  );
}

function Rows({ rows }: { rows: { label: string; val: number; sub?: boolean; total?: boolean }[] }) {
  return (
    <div>
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-baseline justify-between gap-4 py-2"
          style={r.total ? { borderTop: `2px solid ${INK}` } : { borderBottom: `1px solid ${LINE}`, paddingLeft: r.sub ? 16 : 0 }}
        >
          <span className={r.sub ? "text-[0.86rem]" : "text-[0.92rem] font-semibold"} style={{ color: r.sub ? SOFT : INK }}>{r.label}</span>
          <span className="font-display whitespace-nowrap text-[0.9rem]" style={{ color: r.total ? (r.val < 0 ? WARM : GOOD) : INK }}>{rub(r.val)}</span>
        </div>
      ))}
    </div>
  );
}

function Swatch({ color, dashed = false }: { color: string; dashed?: boolean }) {
  return (
    <i
      aria-hidden
      className="inline-block h-0 w-5 align-middle"
      style={{ borderTop: `2px ${dashed ? "dashed" : "solid"} ${color}` }}
    />
  );
}

export default function BigsntUnitEconomics({ tone }: { tone?: "dark" | "paper" }) {
  void tone; // лист — единственный вид; проп оставлен для совместимости вызовов

  const [vals, setVals] = useState<UnitVals>(UNIT_PRESETS[0].values);
  const [preset, setPreset] = useState<string | null>(UNIT_PRESETS[0].key);

  const m = useMemo(() => computeUnit(vals), [vals]);
  const set = (k: keyof UnitVals, v: number) => {
    setVals((p) => ({ ...p, [k]: v }));
    if (PRESET_KEYS.includes(k)) setPreset(null);
  };
  const mpName = UNIT_PRESETS.find((p) => p.key === preset)?.label ?? "Маркетплейс";

  const mpSegs: Seg[] = [
    { k: "cogs", label: "Себестоимость", val: m.C },
    { k: "plat", label: "Комиссия за вычетом СПП", val: Math.max(0, m.commNet) },
    { k: "logi", label: "Логистика, хранение, невыкуп", val: m.mpLogi },
    { k: "ads", label: "Реклама площадки", val: m.mpAds },
    { k: "profit", label: "Ваша прибыль", val: m.mpProfit },
  ];
  const siteSegs: Seg[] = [
    { k: "cogs", label: "Себестоимость", val: m.C },
    { k: "plat", label: "Эквайринг и платформа", val: m.sPlat },
    { k: "logi", label: "Доставка и упаковка", val: m.sLogi },
    { k: "ads", label: "Директ на первый заказ", val: m.sAds },
    { k: "profit", label: "Ваша прибыль", val: m.sProfit },
  ];

  const mpRows = [
    { label: "Покупатель платит", val: m.P },
    { label: vals.spp > 0 ? `Цена продавца до СПП ${pct(vals.spp)}` : "Цена продавца (СПП нет)", val: m.Ps, sub: true },
    { label: `Комиссия ${pct(vals.comm)} от цены продавца`, val: -m.commGross, sub: true },
    { label: "Логистика, хранение, невыкуп", val: -m.mpLogi, sub: true },
    { label: "Реклама площадки", val: -m.mpAds, sub: true },
    { label: "Выплата продавцу", val: m.mpPayout },
    { label: "Себестоимость", val: -m.C, sub: true },
    { label: "Прибыль с заказа", val: m.mpProfit, total: true },
  ];
  const siteRows = [
    { label: "Покупатель платит", val: m.P },
    { label: "Эквайринг и платформа", val: -m.sPlat, sub: true },
    { label: "Доставка и упаковка", val: -m.sLogi, sub: true },
    { label: "Директ на первый заказ", val: -m.sAds, sub: true },
    { label: "Остаётся после канала", val: m.sNet },
    { label: "Себестоимость", val: -m.C, sub: true },
    { label: "Прибыль с заказа", val: m.sProfit, total: true },
  ];

  const kpis = [
    { k: `${mpName} · с заказа`, v: rub(m.mpProfit), s: `выплата ${rub(m.mpPayout)} минус себестоимость`, warn: m.mpProfit < 0 },
    { k: "Свой сайт · с заказа", v: rub(m.sProfit), s: `повтор без рекламы — ${rub(m.sRepeat)}`, warn: m.sProfit < 0, good: m.sProfit > m.mpProfit },
    { k: "Один клиент за год", v: `${m.ltvSite - m.ltvMp >= 0 ? "+" : ""}${rub(m.ltvSite - m.ltvMp)}`, s: `${m.repeats} повторных заказов: ${rub(m.ltvSite)} на сайте против ${rub(m.ltvMp)}`, good: m.ltvSite > m.ltvMp },
    { k: "Прибыль в месяц", v: `${rub(m.sProfit * m.N)}`, s: `на сайте при ${m.N.toLocaleString("ru-RU")} заказах; на площадке ${rub(m.mpProfit * m.N)}` },
  ];

  /* ---------- график 1: год одного клиента ---------- */
  const year = useMemo(() => {
    const stepMonths = (Math.max(1, vals.cycle) * 12) / 52;
    const pts: { month: number; mp: number; site: number }[] = [];
    for (let i = 0; i <= m.repeats; i++) {
      pts.push({ month: Math.min(12, i * stepMonths), mp: m.mpProfit * (i + 1), site: m.sProfit + m.sRepeat * i });
    }

    const W = 720, H = 250, padL = 62, padR = 20, padT = 18, padB = 32;
    const flat = pts.flatMap((p) => [p.mp, p.site]);
    const yMax = Math.max(0, ...flat);
    const yMin = Math.min(0, ...flat);
    const span = yMax - yMin || 1;
    const x = (month: number) => padL + (month / 12) * (W - padL - padR);
    const y = (v: number) => padT + (1 - (v - yMin) / span) * (H - padT - padB);

    const path = (key: "mp" | "site") => {
      let d = `M ${x(pts[0].month).toFixed(1)} ${y(pts[0][key]).toFixed(1)}`;
      for (let i = 1; i < pts.length; i++) {
        d += ` L ${x(pts[i].month).toFixed(1)} ${y(pts[i - 1][key]).toFixed(1)} L ${x(pts[i].month).toFixed(1)} ${y(pts[i][key]).toFixed(1)}`;
      }
      d += ` L ${x(12).toFixed(1)} ${y(pts[pts.length - 1][key]).toFixed(1)}`;
      return d;
    };

    const last = pts[pts.length - 1];
    const grid = [0, 0.25, 0.5, 0.75, 1].map((t) => yMin + t * span);
    return { pts, W, H, padL, padR, padT, padB, x, y, path, last, grid, yZero: y(0), showZero: yMin < 0 };
  }, [vals.cycle, m]);

  const yearDelta = year.last.site - year.last.mp;

  /* ---------- график 2: окупаемость ---------- */
  const pay = useMemo(() => {
    const perMonth = m.delta > 0 ? m.delta * m.N * 0.25 : 0;
    const topTier = TIERS_PRICE[TIERS_PRICE.length - 1] ?? 500000;
    const monthsTop = perMonth > 0 ? topTier / perMonth : Infinity;
    const horizon = perMonth > 0 ? clamp(Math.ceil(monthsTop * 1.2), 6, 36) : 12;
    const W = 720, H = 230, padL = 62, padR = 20, padT = 22, padB = 32;
    const yMax = Math.max(topTier * 1.08, perMonth * horizon) || 1;
    const x = (month: number) => padL + (month / horizon) * (W - padL - padR);
    const y = (v: number) => padT + (1 - v / yMax) * (H - padT - padB);
    const tickStep = horizon <= 12 ? 2 : horizon <= 24 ? 4 : 6;
    const ticks: number[] = [];
    for (let t = 0; t <= horizon; t += tickStep) ticks.push(t);
    const tiers = TIERS_PRICE.map((t, i) => ({ sum: t, name: tierName(i), months: perMonth > 0 ? t / perMonth : null }));
    return { perMonth, horizon, W, H, padL, padR, padT, padB, x, y, ticks, tiers, yMax };
  }, [m]);

  return (
    <div className="grid min-w-0 gap-5">
      {/* ============ 1 · общие вводные ============ */}
      <Card className="px-5 py-5">
        <p className="tech-label text-[10.5px]" style={{ color: ACCENT }}>[ товар · общие вводные ]</p>
        <p className="mt-1.5 text-[0.85rem]" style={{ color: SOFT }}>
          Эти четыре числа общие для обоих каналов: покупатель платит одну и ту же цену, банка стоит одинаково, объём и цикл повтора одни и те же.
        </p>
        <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCT_FIELDS.map((f) => (
            <Slider key={f.key} f={f} value={vals[f.key]} onChange={(v) => set(f.key, v)} />
          ))}
        </div>
      </Card>

      {/* ============ 2 · два калькулятора ============ */}
      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        {/* --- маркетплейс --- */}
        <Card className="flex flex-col px-5 py-5">
          <p className="tech-label text-[10.5px]" style={{ color: ACCENT }}>[ канал 01 ]</p>
          <h3 className="mt-1 text-[1.15rem] leading-tight" style={{ color: INK }}>{mpName}</h3>
          <p className="mt-1.5 text-[0.85rem]" style={{ color: SOFT }}>
            Комиссия и ДРР считаются от цены продавца до СПП; скидку постоянного покупателя финансирует площадка.
          </p>

          <div className="mt-3.5 flex flex-wrap gap-2">
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
                  style={on ? { background: ACCENT, color: "#ffffff" } : { border: `1px solid ${LINE}`, color: SOFT }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid gap-x-6 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {MP_FIELDS.map((f) => (
              <Slider key={f.key} f={f} value={vals[f.key]} onChange={(v) => set(f.key, v)} />
            ))}
          </div>

          <div className="mt-4 border-t pt-1" style={{ borderColor: LINE }}>
            <Rows rows={mpRows} />
          </div>

          <div className="mt-4">
            <p className="text-[0.82rem]" style={{ color: SOFT }}>Каждые 100 ₽ покупателя на площадке</p>
            <div className="mt-2"><SegBar segs={mpSegs} total={m.P} /></div>
          </div>

          <p className="mt-4 text-[0.78rem]" style={{ color: SOFT }}>
            Ozon: СПП в нуле, в комиссию сложены эквайринг и последняя миля. Ставки пересматриваются несколько раз в год — сверьте с кабинетом.
          </p>
        </Card>

        {/* --- свой сайт --- */}
        <Card className="flex flex-col px-5 py-5">
          <p className="tech-label text-[10.5px]" style={{ color: ACCENT }}>[ канал 02 ]</p>
          <h3 className="mt-1 text-[1.15rem] leading-tight" style={{ color: INK }}>Свой сайт</h3>
          <p className="mt-1.5 text-[0.85rem]" style={{ color: SOFT }}>
            Реклама нужна только на первый заказ. Повтор идёт без ДРР — это и есть разница, за счёт которой окупается проект.
          </p>

          {/* распорка под ряд пресетов соседней карточки — чтобы ползунки шли в одну линию */}
          <div aria-hidden className="hidden lg:block lg:h-[2.5rem]" />

          <div className="mt-4 grid gap-x-6 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {SITE_FIELDS.map((f) => (
              <Slider key={f.key} f={f} value={vals[f.key]} onChange={(v) => set(f.key, v)} />
            ))}
          </div>

          <div className="mt-4 border-t pt-1" style={{ borderColor: LINE }}>
            <Rows rows={siteRows} />
          </div>

          <div className="mt-4">
            <p className="text-[0.82rem]" style={{ color: SOFT }}>Каждые 100 ₽ покупателя на сайте</p>
            <div className="mt-2"><SegBar segs={siteSegs} total={m.P} /></div>
          </div>

          <p className="mt-4 text-[0.78rem]" style={{ color: SOFT }}>
            Повтор без рекламы — {rub(m.sRepeat)} с заказа: из первого заказа вычтен только Директ, остальное остаётся как есть.
          </p>
        </Card>
      </div>

      {/* ============ 3 · сравнение ============ */}
      <Card className="px-5 py-5">
        <p className="tech-label text-[10.5px]" style={{ color: ACCENT }}>[ сравнение каналов ]</p>
        <h3 className="mt-1 text-[1.25rem] leading-tight" style={{ color: INK }}>Сравнение каналов</h3>
        <p className="mt-1.5 max-w-[46rem] text-[0.85rem]" style={{ color: SOFT }}>
          Оба калькулятора сведены в одну картину: сколько остаётся с заказа, куда уходит каждая сотня рублей покупателя, что даёт один клиент за год и через сколько месяцев разница окупает работы.
        </p>

        {/* --- KPI --- */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((x) => (
            <div key={x.k} className="px-4 py-3.5" style={{ borderRadius: R, border: `1px solid ${LINE}` }}>
              <p className="tech-label text-[10px]" style={{ color: SOFT }}>{x.k}</p>
              <p className="font-display mt-1.5 text-[1.3rem] leading-tight" style={{ color: x.warn ? WARM : x.good ? GOOD : INK }}>{x.v}</p>
              <p className="mt-1 text-[0.8rem] leading-snug" style={{ color: SOFT }}>{x.s}</p>
            </div>
          ))}
        </div>

        {/* --- объединённая шкала 100 ₽ --- */}
        <div className="mt-6 border-t pt-5" style={{ borderColor: LINE }}>
          <p className="text-[0.95rem] font-semibold" style={{ color: INK }}>Каждые 100 ₽, которые заплатил покупатель</p>
          <p className="mt-1 text-[0.82rem]" style={{ color: SOFT }}>Одна шкала для обоих каналов. Для площадки «комиссия» показана уже за вычетом СПП, которую она финансирует сама.</p>
          <div className="mt-4 grid gap-3">
            {[{ name: mpName, segs: mpSegs }, { name: "Свой сайт", segs: siteSegs }].map((b) => (
              <div key={b.name} className="grid items-center gap-3 sm:grid-cols-[110px_1fr]">
                <span className="text-[0.85rem] font-semibold" style={{ color: INK }}>{b.name}</span>
                <SegBar segs={b.segs} total={m.P} />
              </div>
            ))}
          </div>
          <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2 text-[0.82rem]" style={{ color: SOFT }}>
            {([
              ["cogs", "Себестоимость"],
              ["plat", "Площадка / эквайринг"],
              ["logi", "Логистика и упаковка"],
              ["ads", "Реклама"],
              ["profit", "Ваша прибыль"],
            ] as const).map(([k, l]) => (
              <span key={k} className="inline-flex items-center gap-2">
                <i aria-hidden className="inline-block h-3.5 w-3.5 rounded-[3px]" style={{ background: SEG[k].bg, boxShadow: `inset 0 0 0 1.2px ${SEG[k].bd}` }} />
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* --- график: год одного клиента --- */}
        <div className="mt-6 border-t pt-5" style={{ borderColor: LINE }}>
          <p className="text-[0.95rem] font-semibold" style={{ color: INK }}>Год одного клиента</p>
          <p className="mt-1 max-w-[46rem] text-[0.82rem]" style={{ color: SOFT }}>
            Накопленная прибыль с одного покупателя, который заказывает раз в {vals.cycle} нед: {m.repeats + 1}{" "}
            {plural(m.repeats + 1, "заказ", "заказа", "заказов")} за год. Первый заказ на сайте стоит рекламы, каждый следующий — нет.
          </p>
          <div className="mt-3 overflow-x-auto">
            <svg viewBox={`0 0 ${year.W} ${year.H}`} role="img" aria-label="График накопленной прибыли с одного клиента по месяцам" style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}>
              {year.grid.map((v, i) => (
                <g key={i}>
                  <line x1={year.padL} y1={year.y(v)} x2={year.W - year.padR} y2={year.y(v)} stroke={LINE} strokeWidth={1} />
                  <text x={year.padL - 8} y={year.y(v) + 3.5} textAnchor="end" fontSize={10.5} fill={SOFT}>{kRub(v)}</text>
                </g>
              ))}
              {year.showZero ? <line x1={year.padL} y1={year.yZero} x2={year.W - year.padR} y2={year.yZero} stroke={SOFT} strokeWidth={1.2} /> : null}
              {[0, 2, 4, 6, 8, 10, 12].map((t) => (
                <text key={t} x={year.x(t)} y={year.H - 12} textAnchor="middle" fontSize={10.5} fill={SOFT}>{t}</text>
              ))}
              <text x={year.W - year.padR} y={year.H - 1} textAnchor="end" fontSize={10} fill={SOFT}>месяцев с первого заказа</text>
              <path d={year.path("mp")} fill="none" stroke={MP_LINE} strokeWidth={2} strokeLinejoin="round" />
              <path d={year.path("site")} fill="none" stroke={ACCENT} strokeWidth={2.4} strokeLinejoin="round" />
              {year.pts.map((p, i) => (
                <g key={i}>
                  <circle cx={year.x(p.month)} cy={year.y(p.mp)} r={2.6} fill={MP_LINE} />
                  <circle cx={year.x(p.month)} cy={year.y(p.site)} r={2.9} fill={ACCENT} />
                </g>
              ))}
              <text x={year.W - year.padR} y={year.y(year.last.site) - 8} textAnchor="end" fontSize={11.5} fill={ACCENT}>сайт {rub(year.last.site)}</text>
              <text x={year.W - year.padR} y={year.y(year.last.mp) + 14} textAnchor="end" fontSize={11.5} fill={MP_LINE}>площадка {rub(year.last.mp)}</text>
            </svg>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.82rem]" style={{ color: SOFT }}>
            <span className="inline-flex items-center gap-2"><Swatch color={ACCENT} /> свой сайт</span>
            <span className="inline-flex items-center gap-2"><Swatch color={MP_LINE} /> {mpName.toLowerCase()}</span>
            <span style={{ color: yearDelta >= 0 ? GOOD : WARM }}>
              за год с учётом первого заказа разница {yearDelta >= 0 ? "+" : ""}{rub(yearDelta)} с одного клиента
            </span>
          </div>
        </div>

        {/* --- график: окупаемость --- */}
        <div className="mt-6 border-t pt-5" style={{ borderColor: LINE }}>
          <p className="text-[0.95rem] font-semibold" style={{ color: INK }}>Окупаемость по месяцам</p>
          <p className="mt-1 max-w-[46rem] text-[0.82rem]" style={{ color: SOFT }}>
            Допущение: на сайт переезжает четверть месячных заказов — {Math.round(m.N * 0.25).toLocaleString("ru-RU")} повторов в месяц. Каждый из них приносит на {m.delta > 0 ? rub(m.delta) : "—"} больше, чем тот же заказ на площадке.
          </p>

          {pay.perMonth > 0 ? (
            <>
              <div className="mt-3 overflow-x-auto">
                <svg viewBox={`0 0 ${pay.W} ${pay.H}`} role="img" aria-label="График накопленной дополнительной прибыли и точек окупаемости объёмов работ" style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}>
                  <defs>
                    <linearGradient id="bigsnt-pay-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT} stopOpacity={0.18} />
                      <stop offset="100%" stopColor={ACCENT} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <line x1={pay.padL} y1={pay.y(0)} x2={pay.W - pay.padR} y2={pay.y(0)} stroke={LINE} strokeWidth={1} />
                  {pay.tiers.map((t) => (
                    <g key={t.sum}>
                      <line x1={pay.padL} y1={pay.y(t.sum)} x2={pay.W - pay.padR} y2={pay.y(t.sum)} stroke={SOFT} strokeWidth={1} strokeDasharray="5 4" />
                      <text x={pay.padL + 6} y={pay.y(t.sum) - 6} fontSize={11} fill={SOFT}>{t.name} · {t.sum.toLocaleString("ru-RU")} ₽</text>
                      <text x={pay.padL - 8} y={pay.y(t.sum) + 3.5} textAnchor="end" fontSize={10.5} fill={SOFT}>{kRub(t.sum)}</text>
                    </g>
                  ))}
                  <path
                    d={`M ${pay.x(0)} ${pay.y(0)} L ${pay.x(pay.horizon).toFixed(1)} ${pay.y(pay.perMonth * pay.horizon).toFixed(1)} L ${pay.x(pay.horizon).toFixed(1)} ${pay.y(0)} Z`}
                    fill="url(#bigsnt-pay-fill)"
                  />
                  <path d={`M ${pay.x(0)} ${pay.y(0)} L ${pay.x(pay.horizon).toFixed(1)} ${pay.y(pay.perMonth * pay.horizon).toFixed(1)}`} fill="none" stroke={ACCENT} strokeWidth={2.4} />
                  {pay.tiers.map((t) =>
                    t.months !== null && t.months <= pay.horizon ? (
                      <g key={`x-${t.sum}`}>
                        <line x1={pay.x(t.months)} y1={pay.y(t.sum)} x2={pay.x(t.months)} y2={pay.y(0)} stroke={ACCENT} strokeWidth={1} strokeDasharray="4 4" />
                        <circle cx={pay.x(t.months)} cy={pay.y(t.sum)} r={4} fill={CARD} stroke={ACCENT} strokeWidth={2} />
                        <text x={pay.x(t.months)} y={pay.H - 12} textAnchor="middle" fontSize={11} fill={ACCENT}>{Math.ceil(t.months)} мес</text>
                      </g>
                    ) : null
                  )}
                  {pay.ticks.map((t) =>
                    pay.tiers.some((z) => z.months !== null && z.months <= pay.horizon && Math.abs(Math.ceil(z.months) - t) < 1.2) ? null : (
                      <text key={t} x={pay.x(t)} y={pay.H - 12} textAnchor="middle" fontSize={10.5} fill={SOFT}>{t}</text>
                    )
                  )}
                  <text x={pay.W - pay.padR} y={pay.H - 1} textAnchor="end" fontSize={10} fill={SOFT}>месяцев после запуска</text>
                </svg>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.82rem]" style={{ color: SOFT }}>
                <span className="inline-flex items-center gap-2"><Swatch color={ACCENT} /> накопленная дополнительная прибыль</span>
                <span className="inline-flex items-center gap-2"><Swatch color={SOFT} dashed /> стоимость объёма работ</span>
                <span>{rub(pay.perMonth)} в месяц при этих вводных</span>
              </div>
            </>
          ) : (
            <p className="mt-3 rounded-[8px] px-4 py-3 text-[0.86rem]" style={{ border: `1px solid ${WARM}`, color: WARM }}>
              При этих вводных повтор на сайте не выгоднее повтора на площадке — окупаться нечему. Измените вводные: цену, себестоимость, ДРР или расходы канала.
            </p>
          )}
        </div>

        {/* --- окупаемость в заказах --- */}
        <div className="mt-6 border-t pt-5" style={{ borderColor: LINE }}>
          <p className="text-[0.95rem] font-semibold" style={{ color: INK }}>Окупаемость — в переведённых повторных заказах</p>
          <p className="mt-1 max-w-[46rem] text-[0.82rem]" style={{ color: SOFT }}>
            То же самое, но без календаря: сколько повторов, сделанных на сайте вместо площадки, окупает каждый объём работ.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {TIERS_PRICE.map((t, i) => (
              <div key={t} className="rounded-[8px] px-3.5 py-3" style={{ border: `1px solid ${LINE}` }}>
                <p className="tech-label text-[10px]" style={{ color: SOFT }}>{tierName(i)} · {t.toLocaleString("ru-RU")} ₽</p>
                <p className="font-display mt-1 text-[1.15rem]" style={{ color: m.payback[i] ? INK : WARM }}>
                  {m.payback[i] ? `${m.payback[i]!.toLocaleString("ru-RU")} заказов` : "не окупается"}
                </p>
                <p className="mt-0.5 text-[0.78rem]" style={{ color: SOFT }}>
                  {m.payback[i] ? `≈ ${Math.ceil(m.payback[i]! / Math.max(1, m.N * 0.25))} мес при переводе четверти заказов` : "измените вводные"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
