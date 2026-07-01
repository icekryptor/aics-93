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

// Console-style top bar for the immersive experience. Hidden over the hero,
// fades in as a thin instrument header once you enter the light sections.
export default function SystemNav() {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
      }`}
    >
      <div className="border-b border-line bg-bg/70 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-[1640px] items-center justify-between px-4 sm:px-6 lg:px-16">
          <a href="#top" className="flex items-center gap-2" data-magnetic>
            <span className="signal-grad grid size-5 place-items-center rounded-[5px] text-[9px] font-bold text-white">
              A
            </span>
            <span className="font-display text-[13px] tracking-tight text-ink">
              AICS<span className="signal-text">-93</span>
            </span>
          </a>

          <nav aria-label="Навигация" className="hidden items-center gap-6 md:flex">
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
                  <span className="mr-1 opacity-50">{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                  <span
                    className={`signal-grad absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                      on ? "w-full" : "w-0"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#upgrade"
              data-magnetic
              data-cursor="route signal"
              className="signal-grad grid h-8 place-items-center rounded-lg px-4 text-[12px] font-semibold text-white transition-transform hover:scale-105"
            >
              КП
            </a>
            <a
              href={legal.telegram}
              target="_blank"
              rel="noreferrer"
              data-magnetic
              className="grid h-8 place-items-center rounded-lg border border-line px-3 text-[12px] font-semibold text-ink transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_60%,transparent)]"
            >
              TG
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
