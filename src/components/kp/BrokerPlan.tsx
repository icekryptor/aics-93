/* BrokerPlan — план работ КП брокера двумя дорожками: трек клиента (юрлицо,
   банк, наём) и трек студии (майлстоуны). Смысл схемы в том, что критический
   путь — верхняя дорожка, а не разработка, поэтому оба трека видны сразу и
   переключателя между ними нет. Бары — div'ы по сетке месяцев, вертикали —
   гейты между майлстоунами. */

import { PLAN_MONTHS, PLAN_TRACKS, PLAN_GATES, PLAN_CAPTION } from "@/lib/kp/broker";

export default function BrokerPlan({ tone = "dark" }: { tone?: "dark" | "paper" }) {
  const paper = tone === "paper";
  const line = paper ? "var(--paper-line)" : "var(--color-runtime-line)";
  const soft = paper ? "var(--paper-ink-soft)" : "var(--color-runtime-ink-soft)";
  const ink = paper ? "var(--paper-ink)" : "var(--color-runtime-ink)";
  const client = paper
    ? { bg: "rgba(168,102,11,0.12)", bd: "#a8660b" }
    : { bg: "rgba(255,112,80,0.16)", bd: "#ff7050" };
  const studio = paper
    ? { bg: "rgba(128,56,232,0.09)", bd: "var(--paper-accent)" }
    : { bg: "rgba(151,71,255,0.16)", bd: "var(--color-signal)" };

  const shell: React.CSSProperties = paper
    ? { borderRadius: "10px", border: `1px solid ${line}`, background: "var(--paper-card)" }
    : { borderRadius: "25px 55px 55px 5px", border: `1px solid ${line}`, background: "rgba(23,16,41,0.45)" };

  const pct = (v: number) => `${(v / PLAN_MONTHS) * 100}%`;

  return (
    <figure className="m-0 overflow-hidden px-5 py-6 sm:px-7" style={shell}>
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[720px]">
          {/* шкала месяцев */}
          <div className="relative mb-3 h-5 border-b" style={{ borderColor: line }}>
            {Array.from({ length: PLAN_MONTHS }, (_, i) => (
              <span
                key={i}
                className="tech-label absolute top-0 text-[10.5px]"
                style={{ left: pct(i), color: soft }}
              >
                {i === 0 ? "мес. 1" : i + 1}
              </span>
            ))}
          </div>

          <div className="relative">
            {/* вертикали гейтов */}
            {PLAN_GATES.map((g) => (
              <span
                key={g.at}
                aria-hidden
                className="pointer-events-none absolute top-0 bottom-0 border-l"
                style={{ left: pct(g.at), borderColor: studio.bd, opacity: 0.5, borderStyle: "dashed" }}
              />
            ))}

            {PLAN_TRACKS.map((track) => {
              const c = track.kind === "client" ? client : studio;
              return (
                <div key={track.name} className="relative mb-5 last:mb-0">
                  <p className="tech-label mb-2 text-[11px]" style={{ color: soft }}>
                    {track.name}
                  </p>
                  {track.bars.map((b) => (
                    <div key={b.label} className="relative mb-1.5 h-7 last:mb-0">
                      <div
                        className="absolute inset-y-0 flex items-center overflow-hidden rounded-[4px] px-3"
                        style={{
                          left: pct(b.start),
                          width: pct(b.len),
                          background: c.bg,
                          border: `1px solid ${c.bd}`,
                        }}
                      >
                        <span className="truncate text-[11.5px]" style={{ color: ink }}>
                          {b.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* подписи гейтов */}
          <ul className="mt-5 space-y-1.5 border-t pt-4" style={{ borderColor: line }}>
            {PLAN_GATES.map((g) => (
              <li key={g.at} className="flex items-start gap-2.5 text-[11.5px]" style={{ color: soft }}>
                <span
                  aria-hidden
                  className="mt-[7px] h-0 w-4 shrink-0 border-t border-dashed"
                  style={{ borderColor: studio.bd }}
                />
                <span>
                  <span className="font-display" style={{ color: ink }}>
                    {`мес. ${g.at.toFixed(2).replace(/\.?0+$/, "")}`}
                  </span>{" "}
                  — {g.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="mt-4 border-t pt-3 text-[0.9rem]" style={{ borderColor: line, color: soft }}>
        {PLAN_CAPTION}
      </figcaption>
    </figure>
  );
}
