"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import GearSolid from "@/components/GearSolid";
import { assets, legal } from "@/lib/content";
import { reachGoal } from "@/lib/metrika";

/* Тексты шапки вынесены в словарь: RU-дефолты ниже, EN-страницы передают свой
   словарь (src/lib/en/system.ts). Якоря и href'ы от языка не зависят. */
export type SystemNavDict = {
  links: { label: string; href: string }[];
  logoAria: string;
  navAria: string;
  services: string;
  solutions: string;
  blog: string;
  kp: string;
  menuOpen: string;
  menuClose: string;
  /** href'ы роут-ссылок; пустая строка скрывает пункт (у EN нет решений/журнала) */
  servicesHref: string;
  solutionsHref: string;
  blogHref: string;
};

const RU_DICT: SystemNavDict = {
  links: [
    { label: "разум", href: "#how" },
    { label: "процессы", href: "#ai" },
    { label: "работы", href: "#prtf" },
    { label: "оператор", href: "#exp" },
    { label: "контакт", href: "#upgrade" },
  ],
  logoAria: "AICS-93 — наверх",
  navAria: "Навигация",
  services: "услуги",
  solutions: "решения",
  blog: "журнал",
  kp: "КП",
  menuOpen: "Открыть меню",
  menuClose: "Закрыть меню",
  servicesHref: "/services",
  solutionsHref: "/solutions",
  blogHref: "/blog",
};

// Floating console card — a 12-col-wide instrument bar (~52px) offset 10px from
// the top, glass over the light sections. Fades in after the hero. On mobile a
// hamburger opens a sheet with the section links (desktop shows them inline).
export default function SystemNav({ dict }: { dict?: Partial<SystemNavDict> } = {}) {
  const D: SystemNavDict = { ...RU_DICT, ...dict };
  const LINKS = D.links;
  const hrefKey = LINKS.map((l) => l.href).join("|");
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
    const ids = hrefKey.split("|").map((h) => h.slice(1));
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
  }, [hrefKey]);

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
      {/* «гантель»: залитые блобы (круг-лого · капсула ссылок · капсула действий),
          соединённые перемычками того же цвета; без обводок. Единая тень —
          drop-shadow на контейнере повторяет объединённый силуэт. */}
      <header className="pointer-events-auto mx-auto w-fit max-w-full [filter:drop-shadow(0_14px_40px_rgba(15,8,32,0.55))]">
        <div className="flex items-center">
          {/* блоб 1: круг-лого (крупнее капсул — выпуклость гантели) */}
          <a
            href="#top"
            aria-label={D.logoAria}
            data-magnetic
            className="z-[1] grid size-14 shrink-0 place-items-center rounded-full bg-[#17121f]"
          >
            {/* сплошная шестерёнка + тёмная X-монограмма, фикс-размер по центру */}
            <span className="relative grid size-10 place-items-center">
              <GearSolid hole={false} className="size-10 text-white" />
              <span className="absolute inset-0 grid place-items-center">
                <Image
                  src={assets.monogramV}
                  alt=""
                  width={14}
                  height={10}
                  className="w-[14px] brightness-0 [grid-area:1/1]"
                />
                <Image
                  src={assets.monogramA}
                  alt=""
                  width={14}
                  height={10}
                  className="w-[14px] brightness-0 [grid-area:1/1]"
                />
              </span>
            </span>
          </a>

          {/* перемычка */}
          <span aria-hidden className="-mx-1.5 h-6 w-6 shrink-0 bg-[#17121f]" />

          {/* блоб 2: капсула ссылок (desktop) */}
          <nav
            aria-label={D.navAria}
            className="z-[1] hidden h-12 items-center rounded-full bg-[#17121f] px-3 lg:flex"
          >
            {LINKS.map((l, i) => {
              const on = active === l.href;
              return (
                <span key={l.href} className="flex items-center">
                  {i > 0 && <span aria-hidden className="mx-0.5 h-4 w-px bg-white/12" />}
                  <a
                    href={l.href}
                    className={`tech-label rounded-[3px] px-3 py-1.5 text-[15px] transition-colors xl:px-3.5 ${
                      on ? "bg-[#2b2538] text-white" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </a>
                </span>
              );
            })}
            {D.servicesHref ? (
              <>
                <span aria-hidden className="mx-0.5 h-4 w-px bg-white/12" />
                <Link
                  href={D.servicesHref}
                  className="tech-label rounded-[3px] px-3 py-1.5 text-[15px] text-white/60 transition-colors hover:text-white xl:px-3.5"
                >
                  {D.services}
                </Link>
              </>
            ) : null}
            {D.solutionsHref ? (
              <>
                <span aria-hidden className="mx-0.5 h-4 w-px bg-white/12" />
                <Link
                  href={D.solutionsHref}
                  className="tech-label rounded-[3px] px-3 py-1.5 text-[15px] text-white/60 transition-colors hover:text-white xl:px-3.5"
                >
                  {D.solutions}
                </Link>
              </>
            ) : null}
            {D.blogHref ? (
              <>
                <span aria-hidden className="mx-0.5 h-4 w-px bg-white/12" />
                <Link
                  href={D.blogHref}
                  className="tech-label rounded-[3px] px-3 py-1.5 text-[15px] text-white/60 transition-colors hover:text-white xl:px-3.5"
                >
                  {D.blog}
                </Link>
              </>
            ) : null}
          </nav>

          {/* перемычка */}
          <span aria-hidden className="-mx-1.5 hidden h-6 w-6 shrink-0 bg-[#17121f] lg:block" />

          {/* блоб 3: капсула действий */}
          <div className="z-[1] flex h-12 items-center rounded-full bg-[#17121f] px-2.5">
            <a
              href="#upgrade"
              data-magnetic
              data-cursor="route signal"
              onClick={() => reachGoal("kp_click", { source: "nav" })}
              className="rounded-[3px] px-3.5 py-1.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#2b2538]"
            >
              {D.kp}
            </a>
            <span aria-hidden className="mx-0.5 h-4 w-px bg-white/12" />
            <a
              href={legal.telegram}
              target="_blank"
              rel="noreferrer"
              data-magnetic
              aria-label="Telegram"
              onClick={() => reachGoal("tg_click", { source: "nav" })}
              className="rounded-[3px] px-3.5 py-1.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#2b2538]"
            >
              TG
            </a>
            {/* hamburger (mobile) */}
            <button
              type="button"
              aria-label={open ? D.menuClose : D.menuOpen}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="ml-1 grid size-10 place-items-center rounded-full text-white lg:hidden"
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

        {/* mobile sheet — своя тёмная подложка (у гантели нет общего фона) */}
        <div
          inert={!open}
          aria-hidden={!open}
          className={`grid overflow-hidden transition-all duration-300 lg:hidden ${
            open ? "mt-2 grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <nav aria-label={D.navAria} className="min-h-0 min-w-[250px]">
            <ul
              className={`flex flex-col gap-1 rounded-[22px] bg-[#17121f] px-3 transition-[padding] ${
                open ? "py-3" : "py-0"
              }`}
            >
              {LINKS.map((l) => {
                const on = active === l.href;
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`tech-label flex items-center gap-2 rounded-[3px] px-4 py-3 text-[15px] transition-colors ${
                        on ? "bg-[#2b2538] text-white" : "text-white/60 hover:bg-[#221c2e] hover:text-white"
                      }`}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
              {D.servicesHref ? (
                <li>
                  <Link
                    href={D.servicesHref}
                    onClick={() => setOpen(false)}
                    className="tech-label flex items-center gap-2 rounded-[3px] px-4 py-3 text-[15px] text-white/60 transition-colors hover:bg-[#221c2e] hover:text-white"
                  >
                    {D.services}
                  </Link>
                </li>
              ) : null}
              {D.solutionsHref ? (
                <li>
                  <Link
                    href={D.solutionsHref}
                    onClick={() => setOpen(false)}
                    className="tech-label flex items-center gap-2 rounded-[3px] px-4 py-3 text-[15px] text-white/60 transition-colors hover:bg-[#221c2e] hover:text-white"
                  >
                    {D.solutions}
                  </Link>
                </li>
              ) : null}
              {D.blogHref ? (
                <li>
                  <Link
                    href={D.blogHref}
                    onClick={() => setOpen(false)}
                    className="tech-label flex items-center gap-2 rounded-[3px] px-4 py-3 text-[15px] text-white/60 transition-colors hover:bg-[#221c2e] hover:text-white"
                  >
                    {D.blog}
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}
