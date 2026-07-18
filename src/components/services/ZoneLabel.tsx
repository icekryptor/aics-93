"use client";

import { usePathname } from "next/navigation";

// Подпись зоны в топ-баре runtime-шапки: «/ услуги» на /services*,
// «/ решения» на /solutions*. Крошечный клиентский островок — сам
// layout остаётся серверным.
export default function ZoneLabel() {
  const pathname = usePathname();
  const label = pathname?.startsWith("/solutions") ? "/ решения" : "/ услуги";
  return (
    <span className="tech-label ml-1 hidden text-[10px] text-runtime-ink-soft sm:inline">
      {label}
    </span>
  );
}
