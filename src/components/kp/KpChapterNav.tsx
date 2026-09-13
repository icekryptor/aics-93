"use client";

import { useEffect, useState } from "react";

/* KpChapterNav — липкая навигация по разделам КП слева сверху, только desktop.
   Чистый текст без номеров, тиков и рамок (фидбек Василия 13.09.2026:
   «убираем лишние элементы — только текст»); активный раздел — цветом.
   `visibleFrom` — готовые tailwind-классы видимости от вызывающей страницы:
   колонка показывается только там, где влезает в поле рядом с контентом.

   Активный раздел считается по геометрии, а не через IntersectionObserver:
   разделы КП высокие, в полосу наблюдения попадают сразу несколько, и в
   IO-колбэке побеждал произвольный из них. Здесь берём последний раздел,
   чей верх прошёл линию чтения, — результат детерминированный. У самого
   низа принудительно подсвечиваем последний раздел: он короткий, и иначе
   до него не доскроллить. */

export default function KpChapterNav({
  items,
  visibleFrom = "hidden xl:block",
}: {
  items: { id: string; num: string; label: string }[];
  visibleFrom?: string;
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    let raf = 0;

    const compute = () => {
      raf = 0;
      const line = window.innerHeight * 0.3; // линия чтения
      const de = document.documentElement;
      const bottomLeft = de.scrollHeight - (window.scrollY + window.innerHeight);

      if (bottomLeft < 260) {
        const last = items[items.length - 1]?.id;
        if (last) setActive(last);
        return;
      }

      let current = items[0]?.id ?? "";
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  return (
    <nav
      aria-label="Разделы предложения"
      className={`fixed left-5 top-24 z-30 ${visibleFrom} 2xl:left-10`}
    >
      <ul className="flex flex-col gap-1.5">
        {items.map((it) => {
          const on = active === it.id;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={on ? "true" : undefined}
                className="block whitespace-nowrap text-[12.5px] leading-snug transition-colors"
                style={{
                  color: on ? "var(--color-signal-2)" : "var(--color-runtime-ink-soft)",
                  fontWeight: on ? 600 : 400,
                }}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
