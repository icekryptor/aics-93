"use client";

import { useMemo, useState } from "react";
import { CHANNELS, PACKAGES, type Channel } from "@/lib/kp/uniqdoc";

/* UniqdocPricing — калькулятор пакетов продвижения: отмечаете каналы и срок,
   считает первый месяц, последующие и итог с учётом пакетной скидки. Скидка
   применяется автоматически, когда набор совпал с пакетом, — так видно, что
   пакет дешевле суммы каналов, а не наоборот. Палитра — бумажная (КП живёт
   только в сериф-виде). */

const LINE = "var(--paper-line)";
const INK = "var(--paper-ink)";
const SOFT = "var(--paper-ink-soft)";
const ACCENT = "var(--paper-accent)";
const GOOD = "#4a7a10";
const CARD = "var(--paper-card)";

const usd = (n: number) => `${n.toLocaleString("ru-RU")} $`;
const MONTHS = [1, 3, 6, 12];

export default function UniqdocPricing({ tone }: { tone?: "dark" | "paper" } = {}) {
  void tone;
  const [picked, setPicked] = useState<Channel["key"][]>(["target", "ads", "seo"]);
  const [months, setMonths] = useState(6);

  const toggle = (k: Channel["key"]) =>
    setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const m = useMemo(() => {
    const list = CHANNELS.filter((c) => picked.includes(c.key));
    const rawFirst = list.reduce((s, c) => s + c.first, 0);
    const rawNext = list.reduce((s, c) => s + c.next, 0);

    // пакет засчитывается, когда выбранный набор совпал с ним ровно
    const pack = PACKAGES.find(
      (p) => p.channels.length === picked.length && p.channels.every((c) => picked.includes(c))
    );
    const first = pack ? pack.first : rawFirst;
    const next = pack ? pack.next : rawNext;

    const total = picked.length ? first + next * Math.max(0, months - 1) : 0;
    const rawTotal = picked.length ? rawFirst + rawNext * Math.max(0, months - 1) : 0;
    const save = rawTotal - total;
    const savePct = rawTotal > 0 ? Math.round((save / rawTotal) * 100) : 0;

    return { list, first, next, rawFirst, rawNext, total, rawTotal, save, savePct, pack };
  }, [picked, months]);

  const card: React.CSSProperties = {
    borderRadius: "10px",
    border: `1px solid ${LINE}`,
    background: CARD,
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      {/* ---------- выбор ---------- */}
      <div className="px-5 py-5" style={card}>
        <p className="doc-eyebrow">[ что включаем ]</p>

        <div className="mt-4 grid gap-2.5">
          {CHANNELS.map((c) => {
            const on = picked.includes(c.key);
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => toggle(c.key)}
                aria-pressed={on}
                className="flex w-full cursor-pointer items-start gap-3 rounded-[8px] px-4 py-3 text-left transition-colors"
                style={{
                  border: `1px solid ${on ? ACCENT : LINE}`,
                  background: on ? "rgba(128,56,232,0.06)" : "transparent",
                }}
              >
                <span
                  aria-hidden
                  className="mt-[3px] grid size-[18px] shrink-0 place-items-center rounded-[4px] text-[11px] font-bold"
                  style={{
                    border: `1.5px solid ${on ? ACCENT : LINE}`,
                    background: on ? ACCENT : "transparent",
                    color: "#fff",
                  }}
                >
                  {on ? "✓" : ""}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15.5px] font-semibold" style={{ color: INK }}>
                    {c.name}
                  </span>
                  <span className="mt-0.5 block text-[13px]" style={{ color: SOFT }}>
                    {usd(c.first)} первый месяц
                    {c.next !== c.first ? ` · ${usd(c.next)} далее` : " · далее столько же"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="doc-eyebrow mt-6">[ горизонт расчёта ]</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {MONTHS.map((n) => {
            const on = months === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setMonths(n)}
                aria-pressed={on}
                className="cursor-pointer rounded-[6px] px-4 py-2 text-[13.5px] transition-colors"
                style={
                  on
                    ? { background: ACCENT, color: "#fff", border: `1px solid ${ACCENT}` }
                    : { border: `1px solid ${LINE}`, color: SOFT }
                }
              >
                {n === 1 ? "1 месяц" : `${n} мес`}
              </button>
            );
          })}
        </div>

        {m.pack ? (
          <p className="mt-5 rounded-[8px] px-4 py-3 text-[13.5px] leading-relaxed" style={{ background: "rgba(74,122,16,0.08)", color: INK }}>
            Набор совпал с пакетом «{m.pack.label}» — {m.pack.save}: {usd(m.pack.first)} первый месяц
            и {usd(m.pack.next)} последующие вместо {usd(m.rawFirst)} и {usd(m.rawNext)}.
          </p>
        ) : picked.length > 1 ? (
          <p className="mt-5 text-[13.5px] leading-relaxed" style={{ color: SOFT }}>
            Это отдельные каналы по своим ценам. Пакетная скидка включается на наборах
            «таргет + Google Ads» и «все три канала».
          </p>
        ) : null}
      </div>

      {/* ---------- результат ---------- */}
      <div className="flex min-w-0 flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="px-4 py-4" style={card}>
            <p className="doc-eyebrow">первый месяц</p>
            <p className="font-display mt-1.5 text-[1.6rem] leading-none" style={{ color: INK }}>
              {picked.length ? usd(m.first) : "—"}
            </p>
            <p className="mt-1.5 text-[12.5px]" style={{ color: SOFT }}>
              исследование, настройка, запуск
            </p>
          </div>
          <div className="px-4 py-4" style={card}>
            <p className="doc-eyebrow">каждый следующий</p>
            <p className="font-display mt-1.5 text-[1.6rem] leading-none" style={{ color: INK }}>
              {picked.length ? usd(m.next) : "—"}
            </p>
            <p className="mt-1.5 text-[12.5px]" style={{ color: SOFT }}>
              ведение, креативы, отчёты
            </p>
          </div>
        </div>

        <div className="px-5 py-5" style={card}>
          <p className="text-[0.95rem] font-semibold" style={{ color: INK }}>
            За {months === 1 ? "первый месяц" : `${months} месяцев`}
          </p>
          <p className="font-display mt-2 text-[2rem] leading-none" style={{ color: INK }}>
            {picked.length ? usd(m.total) : "—"}
          </p>
          {m.save > 0 ? (
            <p className="mt-2.5 text-[14px] leading-relaxed" style={{ color: GOOD }}>
              Экономия {usd(m.save)} ({m.savePct}%) против тех же каналов по отдельности —
              {" "}{usd(m.rawTotal)}.
            </p>
          ) : (
            <p className="mt-2.5 text-[13.5px] leading-relaxed" style={{ color: SOFT }}>
              {picked.length ? "Пакетная скидка не применяется на этом наборе." : "Отметьте хотя бы один канал."}
            </p>
          )}

          {/* полоса: из чего складывается сумма */}
          {picked.length ? (
            <div className="mt-5">
              <div className="flex h-9 gap-[2px] overflow-hidden rounded-[6px]">
                {m.list.map((c, i) => {
                  const part = c.first + c.next * Math.max(0, months - 1);
                  const w = (part / Math.max(1, m.rawTotal)) * 100;
                  const shades = ["rgba(128,56,232,0.22)", "rgba(30,138,122,0.2)", "rgba(180,69,15,0.18)"];
                  const edges = [ACCENT, "#1e8a7a", "#b4450f"];
                  return (
                    <div
                      key={c.key}
                      title={`${c.name}: ${usd(part)} за ${months} мес`}
                      className="flex min-w-0 items-center justify-center"
                      style={{ width: `${w}%`, background: shades[i % 3], boxShadow: `inset 0 0 0 1.2px ${edges[i % 3]}` }}
                    >
                      {w >= 12 && (
                        <span className="font-display text-[11px]" style={{ color: INK }}>
                          {Math.round(w)}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px]" style={{ color: SOFT }}>
                {m.list.map((c, i) => {
                  const edges = [ACCENT, "#1e8a7a", "#b4450f"];
                  return (
                    <span key={c.key} className="inline-flex items-center gap-1.5">
                      <i aria-hidden className="inline-block size-2.5 rounded-[2px]" style={{ background: edges[i % 3] }} />
                      {c.name}
                    </span>
                  );
                })}
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: SOFT }}>
                Доли показаны от стоимости каналов по отдельности — пакетная скидка распределяется на все.
              </p>
            </div>
          ) : null}
        </div>

        <div className="px-5 py-4" style={card}>
          <p className="text-[13.5px] leading-relaxed" style={{ color: SOFT }}>
            Сверх этой суммы — рекламные бюджеты площадок (платите напрямую) и закупка ссылок
            в SEO, 10–15 тыс. ₽ в месяц. Процента с оборота нет.
          </p>
        </div>
      </div>
    </div>
  );
}
