"use client";

import { useState } from "react";

/* KpCopyLink — копирует абсолютную ссылку на КП, чтобы отправлять клиенту
   из индекса, а не собирать домен руками. Абсолютный адрес берём из
   location в момент клика: на превью-деплое ссылка должна быть его же. */

export default function KpCopyLink({ href }: { href: string }) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");

  const copy = async () => {
    const url = `${window.location.origin}${href}`;
    try {
      await navigator.clipboard.writeText(url);
      setState("done");
    } catch {
      setState("fail");
    }
    setTimeout(() => setState("idle"), 1800);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="tech-label inline-flex items-center gap-2 rounded-full border border-runtime-line px-3.5 py-2 text-[10.5px] text-runtime-ink-soft transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_60%,transparent)] hover:text-runtime-ink"
    >
      {state === "done" ? "ссылка скопирована" : state === "fail" ? "не вышло — скопируй руками" : "скопировать ссылку"}
    </button>
  );
}
