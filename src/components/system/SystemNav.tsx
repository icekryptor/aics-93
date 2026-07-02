"use client";

import { useEffect, useState } from "react";
import { legal } from "@/lib/content";

const LINKS = [
  { label: "разум", href: "#how" },
  { label: "процессы", href: "#ai" },
  { label: "работы", href: "#prtf" },
  { label: "оператор", href: "#exp" },
  { label: "контакт", href: "#upgrade" },
];

// Floating console card — a 12-col-wide instrument bar (~52px) offset 10px from
// the top, glass over the light sections. Fades in after the hero. On mobile a
// hamburger opens a sheet with the section links (desktop shows them inline).
export default function SystemNav() {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const force = new URLSearchParams(window.location.search).get("nav") === "1";
    const onScroll = () => setShown(force || window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive("#" + e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // close the mobile sheet on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-2.5 z-50 px-4 transition-all duration-500 sm:px-6 lg:px-8 ${
        shown ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
      }`}
    >
      <header className="pointer-events-auto mx-auto w-full max-w-[1640px] rounded-2xl border border-line/80 bg-bg/70 shadow-[0_10px_40px_-16px_rgba(48,32,85,0.5)] backdrop-blur-xl">
        <div className="flex h-[52px] items-center justify-between gap-4 pl-3 pr-2 sm:pl-4">
          {/* left: mark + live dot */}
          <a href="#top" aria-label="AICS-93 — наверх" className="flex items-center gap-2.5" data-magnetic>
            <span className="signal-grad grid size-7 place-items-center rounded-[8px] text-[11px] font-bold text-white">
              A
            </span>
            <span className="hidden font-display text-[14px] tracking-tight text-ink sm:inline">
              AICS<span className="signal-text">-93</span>
            </span>
            <span className="ml-1 hidden items-center gap-1.5 lg:flex">
              <span className="hud-dot" />
              <span className="hud text-[9px] text-ink-soft">online</span>
            </span>
          </a>

          {/* center: nav (desktop) */}
          <nav aria-label="Навигация" className="hidden items-center gap-5 md:flex lg:gap-7">
            {LINKS.map((l, i) => {
              const on = active === l.href;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={`tech-label group relative text-[11px] transition-colors ${
                    on ? "text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <span className="mr-1 opacity-40">{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                  <span
                    className={`signal-grad absolute -bottom-1.5 left-0 h-px transition-all duration-300 ${
                      on ? "w-full" : "w-0"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* right: actions */}
          <div className="flex items-center gap-3 md:gap-2">
            <a
              href="#upgrade"
              data-magnetic
              data-cursor="route signal"
              className="signal-grad grid h-11 place-items-center rounded-xl px-4 text-[12px] font-semibold text-white transition-transform hover:scale-105 md:h-9"
            >
              КП
            </a>
            <a
              href={legal.telegram}
              target="_blank"
              rel="noreferrer"
              data-magnetic
              aria-label="Telegram"
              className="grid h-11 place-items-center rounded-xl border border-line px-3 text-[12px] font-semibold text-ink transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_60%,transparent)] md:h-9"
            >
              TG
            </a>
            {/* hamburger (mobile) */}
            <button
              type="button"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid size-11 place-items-center rounded-xl border border-line text-ink md:hidden"
            >
              <span className="relative block h-3 w-4" aria-hidden>
                <span
                  className={`absolute left-0 block h-[2px] w-full rounded bg-current transition-all duration-300 ${
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 block h-[2px] w-full -translate-y-1/2 rounded bg-current transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[2px] w-full rounded bg-current transition-all duration-300 ${
                    open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* mobile sheet */}
        <div
          className={`grid overflow-hidden transition-all duration-300 md:hidden ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <nav aria-label="Навигация" className="min-h-0">
            <ul className="flex flex-col gap-1 border-t border-line/70 px-2 py-2">
              {LINKS.map((l, i) => {
                const on = active === l.href;
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`tech-label flex items-center gap-2 rounded-xl px-3 py-3 text-[13px] transition-colors ${
                        on ? "bg-ink/[0.06] text-ink" : "text-ink-soft hover:bg-ink/[0.04]"
                      }`}
                    >
                      <span className="opacity-40">{String(i + 1).padStart(2, "0")}</span>
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}
