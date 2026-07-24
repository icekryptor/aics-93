/* RouteMap — сквозной визуальный мотив КП/сайта MARTOX: путь товара
   завод → экспортный брокер → порт → растаможка → 3PL → покупатель.
   Референсная зона — финтех/логистика (Mercury, Stripe Atlas, Flexport):
   схема вместо стокового фото. Горизонтальный граф, на узких экранах —
   горизонтальный скролл (графовость важнее переносов). */

const STOPS = [
  "завод",
  "экспортный брокер",
  "порт",
  "импортная растаможка",
  "3PL-склад",
  "покупатель",
];

export default function RouteMap({ caption }: { caption?: string }) {
  return (
    <div
      className="overflow-hidden rounded-2xl px-5 py-6 sm:px-7"
      style={{ border: "1px solid var(--color-runtime-line)", background: "rgba(23,16,41,0.4)" }}
    >
      <p className="tech-label text-[0.68rem]" style={{ color: "var(--color-signal-2)" }}>
        [ путь товара · сквозной мотив сайта ]
      </p>
      <div className="mt-5 overflow-x-auto pb-2">
        <div className="flex min-w-[720px] items-center">
          {STOPS.map((s, i) => (
            <div key={s} className={`flex items-center ${i < STOPS.length - 1 ? "flex-1" : ""}`}>
              <div className="flex shrink-0 flex-col items-center gap-2.5">
                <span
                  className="relative grid size-3.5 place-items-center rounded-full"
                  style={{
                    background: i === STOPS.length - 1 ? "var(--color-signal-cool)" : "var(--color-signal)",
                    boxShadow: `0 0 10px ${i === STOPS.length - 1 ? "rgba(95,217,245,0.6)" : "rgba(151,71,255,0.6)"}`,
                  }}
                >
                  <span className="absolute size-1.5 rounded-full bg-white/80" />
                </span>
                <span className="tech-label whitespace-nowrap text-[10.5px] text-runtime-ink-soft">{s}</span>
              </div>
              {i < STOPS.length - 1 && (
                <div className="relative mx-2 mb-6 h-px flex-1 self-center overflow-visible">
                  <div
                    className="h-px w-full"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(151,71,255,0.7), rgba(95,217,245,0.55))",
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute -right-0.5 -top-[3px] text-[9px]"
                    style={{ color: "var(--color-signal-cool)" }}
                  >
                    ▸
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {caption && <p className="mt-3 text-[12.5px] leading-relaxed text-runtime-ink-soft">{caption}</p>}
    </div>
  );
}
