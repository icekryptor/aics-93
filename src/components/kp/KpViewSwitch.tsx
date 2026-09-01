import Link from "next/link";

/* KpViewSwitch — переключатель вариантов отображения КП.
   Одно и то же предложение живёт в двух видах: студийный (тёмная сцена,
   канон ДС) и документный (светлый лист, сериф — для вдумчивого чтения
   и печати). Клиент выбирает, как ему удобнее. */

export default function KpViewSwitch({
  base,
  active,
  tone = "dark",
}: {
  /** Корень КП, например /kp/gagarin */
  base: string;
  active: "studio" | "doc";
  tone?: "dark" | "paper";
}) {
  const items = [
    { id: "studio" as const, href: base, label: "студийный вид" },
    { id: "doc" as const, href: `${base}/doc`, label: "документ · сериф" },
  ];

  const wrap =
    tone === "paper"
      ? "border-[color:var(--paper-line)] bg-[color:var(--paper-card)]"
      : "border-runtime-line bg-black/30";

  return (
    <div className={`inline-flex items-center gap-1 rounded-full border p-1 ${wrap}`}>
      {items.map((it) => {
        const on = it.id === active;
        const cls = on
          ? tone === "paper"
            ? "bg-[color:var(--paper-accent)] text-white"
            : "bg-[var(--color-signal)] text-white"
          : tone === "paper"
            ? "text-[color:var(--paper-ink-soft)] hover:text-[color:var(--paper-ink)]"
            : "text-runtime-ink-soft hover:text-runtime-ink";
        return (
          <Link
            key={it.id}
            href={it.href}
            aria-current={on ? "page" : undefined}
            className={`tech-label rounded-full px-3.5 py-1.5 text-[11px] transition-colors ${cls}`}
          >
            {it.label}
          </Link>
        );
      })}
    </div>
  );
}
