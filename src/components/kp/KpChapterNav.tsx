"use client";

import { useEffect, useState } from "react";

/* KpChapterNav — липкая навигация по разделам КП (по мотиву ChapterNav
   кейсов). Слева сверху, только desktop. Подписи видны всегда (фидбек
   Василия 13.09.2026: полоса одних номеров — «непонятно что и зачем»);
   чтобы колонка не наезжала на контент на ноутбучных ширинах, шеллы
   КП-страниц отдают ей левое поле (xl:pl-[220px] до ~1600px).

   Активный раздел считается по геометрии, а не через IntersectionObserver:
   разделы КП высокие, в полосу наблюдения попадают сразу несколько, и в
   IO-колбэке побеждал произвольный из них. Здесь берём последний раздел,
   чей верх прошёл линию чтения, — результат детерминированный. У самого
   низа принудительно подсвечиваем последний раздел: он короткий, и иначе
   до него не доскроллить. */

export default function KpChapterNav({
  items,
}: {
  items: { id: string; num: string; label: string }[];
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
      className="pointer-events-none fixed left-4 top-24 z-30 hidden xl:block 2xl:left-10"
    >
      {/* подложка: без неё подписи ложатся прямо на контент страницы.
          Стекло по §5 канона — специальный блик обязателен; backdrop здесь
          безопасен: контейнер не анимируется трансформом. */}
      <div className="pointer-events-auto flex flex-col gap-0.5 rounded-[14px] border border-runtime-line bg-white/[0.06] p-1.5 shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset] backdrop-blur-[20px] backdrop-saturate-[180%]">
        {items.map((it) => {
          const on = active === it.id;
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              aria-current={on ? "true" : undefined}
              className="flex items-center gap-2.5 rounded-[3px] py-1 pl-1 pr-2 transition-colors hover:bg-white/[0.05]"
            >
              {/* тик: длиннее и ярче у активного — читается и в свёрнутом виде */}
              <span
                className="h-[2px] shrink-0 rounded-full transition-all duration-300"
                style={{
                  width: on ? 20 : 10,
                  background: on ? "var(--color-signal)" : "var(--color-runtime-line)",
                }}
                aria-hidden
              />
              <span
                className="hud shrink-0 text-[10px] transition-colors"
                style={{ color: on ? "var(--color-signal-2)" : "var(--color-runtime-ink-soft)" }}
              >
                {it.num}
              </span>
              <span
                className={`whitespace-nowrap text-[11.5px] leading-snug transition-colors ${
                  on ? "text-runtime-ink" : "text-runtime-ink-soft"
                }`}
              >
                {it.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
