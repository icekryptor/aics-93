"use client";

import { useEffect, useState } from "react";

/* ChapterNav — липкая навигация по блокам лонгрида (desktop). Активная глава
   подсвечивается через IntersectionObserver; клики — обычные якоря. */

export default function ChapterNav({
  items,
}: {
  items: { id: string; num: string; title: string }[];
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="Главы кейса" className="hidden lg:block">
      <div className="sticky top-24 space-y-1">
        {items.map((it) => {
          const on = active === it.id;
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              className={`group flex items-baseline gap-2.5 rounded-[3px] px-2 py-1.5 transition-colors ${
                on ? "bg-[color-mix(in_srgb,var(--color-signal)_14%,transparent)]" : "hover:bg-white/[0.04]"
              }`}
            >
              <span
                className="hud shrink-0 text-[10px]"
                style={{ color: on ? "var(--color-signal-2)" : "var(--color-runtime-ink-soft)" }}
              >
                {it.num}
              </span>
              <span
                className={`text-[12px] leading-snug transition-colors ${
                  on ? "text-runtime-ink" : "text-runtime-ink-soft group-hover:text-runtime-ink"
                }`}
              >
                {it.title}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
