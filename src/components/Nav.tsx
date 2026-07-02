"use client";

import { useEffect, useState } from "react";
import { nav, legal } from "@/lib/content";

// Matches the original: no top bar. A left vertical menu + right stacked
// circular buttons (КП / TG) that fade in once the user scrolls past the hero.
export default function Nav() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 220);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Left vertical menu */}
      <nav
        aria-label="Главное меню"
        className={`fixed left-4 top-5 z-50 hidden flex-col gap-1.5 transition-all duration-500 md:flex lg:left-6 ${
          shown ? "opacity-100 translate-x-0" : "pointer-events-none -translate-x-3 opacity-0"
        }`}
      >
        {nav.map((n) => (
          <a
            key={n.href}
            href={n.href}
            className="w-fit text-[13px] tracking-tight text-ink-soft transition-colors hover:text-ink"
          >
            {n.label}
          </a>
        ))}
      </nav>

      {/* Right stacked circular buttons */}
      <div
        className={`fixed right-4 top-5 z-50 flex flex-col items-center gap-2.5 transition-all duration-500 lg:right-6 ${
          shown ? "opacity-100 translate-x-0" : "pointer-events-none translate-x-3 opacity-0"
        }`}
      >
        <a
          href="#upgrade"
          className="grid size-11 place-items-center rounded-full bg-gradient-accent text-[12px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(151,71,255,0.7)] transition-transform hover:scale-105"
        >
          КП
        </a>
        <a
          href={legal.telegram}
          target="_blank"
          rel="noreferrer"
          className="grid size-11 place-items-center rounded-full bg-ink text-[12px] font-semibold text-bg transition-transform hover:scale-105"
        >
          TG
        </a>
      </div>
    </>
  );
}
