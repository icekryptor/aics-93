/* RevenueBar — общий бар месячного дохода с сегментами-объяснениями.
   Дефолтный визуал доходной части в КП: один столбец = сумма в месяц,
   каждый сегмент подписан снизу — что это за деньги и откуда берутся.
   Цвета — из токенов ДС (сигнал/циан/лайм/фиолет-cool), без новых значений. */

export type RevenueSegment = {
  label: string;
  amount: number;
  /** Токен-цвет сегмента. */
  color: string;
  /** Текст цифры на тёмном/светлом сегменте. */
  ink: string;
  note: string;
};

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

export default function RevenueBar({
  segments,
  caption,
  tone = "dark",
}: {
  segments: RevenueSegment[];
  caption?: string;
  /** dark — тёмная сцена (студийный вид), paper — светлый лист документа. */
  tone?: "dark" | "paper";
}) {
  const total = segments.reduce((s, x) => s + x.amount, 0);
  const paper = tone === "paper";

  const shell: React.CSSProperties = paper
    ? {
        borderRadius: "10px",
        border: "1px solid var(--paper-line)",
        background: "var(--paper-card)",
      }
    : {
        borderRadius: "25px 55px 55px 5px",
        border: "1px solid var(--color-runtime-line)",
        background: "rgba(23,16,41,0.45)",
      };
  const inkStrong = paper ? "text-[color:var(--paper-ink)]" : "text-runtime-ink";
  const inkSoft = paper ? "text-[color:var(--paper-ink-soft)]" : "text-runtime-ink-soft";
  const lineCls = paper ? "border-[color:var(--paper-line)]" : "border-runtime-line";

  return (
    <div className="overflow-hidden p-6 sm:p-8" style={shell}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        {paper ? (
          <p className="doc-eyebrow">Пример · доход платформы в месяц</p>
        ) : (
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ пример · доход платформы в месяц ]
          </p>
        )}
        <p
          className={`font-display text-[clamp(1.6rem,4vw,2.4rem)] font-semibold leading-none ${
            paper ? "doc-money" : "text-runtime-ink"
          }`}
        >
          {fmt(total)} ₽
        </p>
      </div>

      {/* общий бар */}
      <div
        className="mt-6 flex h-[62px] overflow-hidden rounded-[8px]"
        role="img"
        aria-label={`Доход ${fmt(total)} рублей в месяц: ${segments
          .map((s) => `${s.label} — ${fmt(s.amount)}`)
          .join("; ")}`}
      >
        {segments.map((s) => (
          <div
            key={s.label}
            className="flex min-w-0 items-center justify-center"
            style={{ width: `${(s.amount / total) * 100}%`, background: s.color }}
          >
            <span
              className="font-display truncate px-2 text-[13px] font-semibold"
              style={{ color: s.ink }}
            >
              {fmt(s.amount)} ₽
            </span>
          </div>
        ))}
      </div>

      {/* объяснение каждого сегмента */}
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {segments.map((s) => (
          <div key={s.label} className="grid grid-cols-[14px_1fr] items-start gap-3">
            <span
              className="mt-[6px] size-[14px] shrink-0 rounded-[4px]"
              style={{ background: s.color }}
              aria-hidden
            />
            <div>
              <p className={`font-semibold leading-snug ${paper ? "text-[17px]" : "text-[15px]"} ${inkStrong}`}>
                {s.label} —{" "}
                <span className="font-display whitespace-nowrap">{fmt(s.amount)} ₽</span>
              </p>
              <p className={`mt-1.5 leading-relaxed ${paper ? "text-[16px]" : "text-[14.5px]"} ${inkSoft}`}>
                {s.note}
              </p>
            </div>
          </div>
        ))}
      </div>

      {caption ? (
        <p
          className={`mt-7 border-t pt-5 leading-relaxed ${lineCls} ${
            paper ? "text-[16px]" : "text-[14.5px]"
          } ${inkSoft}`}
        >
          {caption}
        </p>
      ) : null}
    </div>
  );
}
