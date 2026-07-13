"use client";

import Link from "next/link";
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
      className={`sys-nav-wrap pointer-events-none fixed inset-x-0 top-2.5 z-50 px-4 transition-all duration-500 sm:px-6 lg:px-8 ${
        shown ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
      }`}
    >
      {/* тёмная «гантель»: круг-лого + капсула ссылок + капсулы-кнопки */}
      <header className="pointer-events-auto mx-auto w-fit max-w-full rounded-full bg-[#17121f] p-1.5 shadow-[0_14px_44px_-14px_rgba(15,8,32,0.7)]">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* left: круг-лого */}
          <a
            href="#top"
            aria-label="AICS-93 — наверх"
            data-magnetic
            className="signal-grad grid size-11 shrink-0 place-items-center rounded-full text-[15px] font-bold text-white"
          >
            A
          </a>

          {/* center: капсула ссылок с разделителями (desktop) */}
          <nav
            aria-label="Навигация"
            className="hidden items-center rounded-full border border-white/10 bg-white/[0.04] px-2 lg:flex"
          >
            {LINKS.map((l, i) => {
              const on = active === l.href;
              return (
                <span key={l.href} className="flex items-center">
                  {i > 0 && <span aria-hidden className="h-4 w-px bg-white/15" />}
                  <a
                    href={l.href}
                    className={`tech-label relative px-3.5 py-2.5 text-[15px] transition-colors xl:px-4 ${
                      on ? "text-white" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </a>
                </span>
              );
            })}
            <span aria-hidden className="h-4 w-px bg-white/15" />
            <Link
              href="/services"
              className="tech-label px-3.5 py-2.5 text-[15px] text-white/60 transition-colors hover:text-white xl:px-4"
            >
              услуги
            </Link>
            <span aria-hidden className="h-4 w-px bg-white/15" />
            <Link
              href="/blog"
              className="tech-label px-3.5 py-2.5 text-[15px] text-white/60 transition-colors hover:text-white xl:px-4"
            >
              журнал
            </Link>
          </nav>

          {/* right: капсулы-действия */}
          <div className="flex items-center gap-1.5">
            <a
              href="#upgrade"
              data-magnetic
              data-cursor="route signal"
              className="grid h-11 place-items-center rounded-full border border-white/12 bg-white/[0.07] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-white/[0.14]"
            >
              КП
            </a>
            <a
              href={legal.telegram}
              target="_blank"
              rel="noreferrer"
              data-magnetic
              aria-label="Telegram"
              className="grid h-11 place-items-center rounded-full border border-white/12 bg-white/[0.07] px-4 text-[14px] font-semibold text-white transition-colors hover:bg-white/[0.14]"
            >
              TG
            </a>
            {/* hamburger (mobile) */}
            <button
              type="button"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid size-11 place-items-center rounded-full border border-white/12 text-white lg:hidden"
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
          <nav aria-label="Навигация" className="min-h-0 min-w-[250px]">
            <ul className="flex flex-col gap-1 border-t border-white/10 px-3 py-2">
              {LINKS.map((l) => {
                const on = active === l.href;
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`tech-label flex items-center gap-2 rounded-full px-4 py-3 text-[15px] transition-colors ${
                        on ? "bg-white/[0.09] text-white" : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/services"
                  onClick={() => setOpen(false)}
                  className="tech-label flex items-center gap-2 rounded-full px-4 py-3 text-[15px] text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  услуги
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  onClick={() => setOpen(false)}
                  className="tech-label flex items-center gap-2 rounded-full px-4 py-3 text-[15px] text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  журнал
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}
