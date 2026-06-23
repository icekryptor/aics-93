"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { nav, assets, legal } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-2.5 transition-all duration-300 ${
            scrolled
              ? "border-line bg-bg/80 shadow-[0_8px_40px_-12px_rgba(22,18,29,0.18)] backdrop-blur-md"
              : "border-transparent bg-transparent"
          }`}
        >
          <a href="#top" className="flex items-center gap-2.5 shrink-0" aria-label="AICS-93">
            <span className="grid size-9 place-items-center rounded-full border border-ink/15">
              <Image src={assets.gear} alt="" width={22} height={22} className="size-5" />
            </span>
            <Image src={assets.wordmark} alt="AICS-93" width={70} height={18} className="h-[14px] w-auto" />
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="tech-label text-[13px] text-ink-soft transition-colors hover:text-ink"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={legal.telegram}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full border border-ink/15 px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-ink hover:text-bg sm:block"
            >
              TG
            </a>
            <a
              href="#upgrade"
              className="rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.03]"
            >
              Получить КП
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-full border border-ink/15 md:hidden"
              aria-label="Меню"
              aria-expanded={open}
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute inset-x-0 top-0 h-0.5 bg-ink transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-ink transition-transform ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>

        {open && (
          <nav className="mt-2 flex flex-col gap-1 rounded-2xl border border-line bg-bg/95 p-2 backdrop-blur-md md:hidden">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-bg-soft hover:text-ink"
              >
                {n.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
