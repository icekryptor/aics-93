"use client";

import { useMemo, useRef, useState } from "react";
import BrainGL from "@/components/system/BrainGL";
import {
  DEFAULT_BRAIN_CONFIG,
  BRAIN_CONFIG_EVENT,
  BRAIN_CONFIG_KEYS,
  BRAIN_CONFIG_LIMITS,
  clampBrainConfig,
  type BrainConfig,
} from "@/components/system/brain-config";

/* HeroStand — панель «параметры сцены» (паттерн evo brain-lab) для мозга
   хиро. Ползунки шлют BRAIN_CONFIG_EVENT (BrainGL пересобирает сцену,
   дебаунс 140мс), «запушить» отправляет конфиг в /api/brain-config —
   коммит в main и автодеплой. */

type PushState =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "ok"; url?: string }
  | { kind: "err"; message: string };

export default function HeroStand() {
  const [cfg, setCfg] = useState<BrainConfig>({ ...DEFAULT_BRAIN_CONFIG });
  const [push, setPush] = useState<PushState>({ kind: "idle" });
  const [pasteErr, setPasteErr] = useState(false);
  const debounceRef = useRef<number>(0);

  const groups = useMemo(() => {
    const g = new Map<string, (keyof BrainConfig)[]>();
    for (const k of BRAIN_CONFIG_KEYS) {
      const grp = BRAIN_CONFIG_LIMITS[k].group;
      const arr = g.get(grp) ?? [];
      arr.push(k);
      g.set(grp, arr);
    }
    return [...g.entries()];
  }, []);

  const broadcast = (next: BrainConfig) => {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent(BRAIN_CONFIG_EVENT, { detail: next }));
    }, 140);
  };

  const set = (k: keyof BrainConfig, v: number) => {
    setCfg((prev) => {
      const next = { ...prev, [k]: v };
      broadcast(next);
      return next;
    });
  };

  const applyAll = (next: BrainConfig) => {
    setCfg(next);
    window.clearTimeout(debounceRef.current);
    window.dispatchEvent(new CustomEvent(BRAIN_CONFIG_EVENT, { detail: next }));
  };

  const copy = () => navigator.clipboard?.writeText(JSON.stringify(cfg, null, 2)).catch(() => {});

  const paste = async () => {
    setPasteErr(false);
    try {
      const text = await navigator.clipboard.readText();
      applyAll(clampBrainConfig(JSON.parse(text)));
    } catch {
      setPasteErr(true);
    }
  };

  const doPush = async () => {
    if (push.kind === "busy") return;
    setPush({ kind: "busy" });
    try {
      const res = await fetch("/api/brain-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: cfg }),
      });
      const j = (await res.json().catch(() => null)) as
        | { ok?: boolean; commitUrl?: string; error?: string }
        | null;
      if (res.ok && j?.ok) setPush({ kind: "ok", url: j.commitUrl });
      else setPush({ kind: "err", message: j?.error ?? `HTTP ${res.status}` });
    } catch {
      setPush({ kind: "err", message: "сеть недоступна" });
    }
  };

  const btn =
    "tech-label cursor-pointer rounded-full border border-runtime-line px-4 py-2 text-[11px] text-runtime-ink-soft transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_60%,transparent)] hover:text-runtime-ink";

  return (
    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      {/* сцена */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ border: "1px solid var(--color-runtime-line)", background: "rgba(14,10,27,0.6)" }}
      >
        <div className="relative h-[420px] sm:h-[540px] lg:h-[620px]">
          <BrainGL className="absolute inset-0 h-full w-full" />
        </div>
        <p className="tech-label pointer-events-none absolute bottom-3 left-4 text-[9px] text-runtime-ink-soft/70">
          [ клик по мозгу — biology / hybrid / machine ]
        </p>
      </div>

      {/* параметры */}
      <aside
        className="rounded-2xl px-5 py-5"
        style={{ border: "1px solid var(--color-runtime-line)", background: "rgba(23,16,41,0.5)" }}
      >
        <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
          [ параметры сцены ]
        </p>

        {groups.map(([group, keys]) => (
          <div key={group} className="mt-5">
            <p className="tech-label text-[10px] text-runtime-ink-soft">{group}</p>
            <div className="mt-2.5 space-y-3">
              {keys.map((k) => {
                const L = BRAIN_CONFIG_LIMITS[k];
                return (
                  <label key={k} className="block">
                    <span className="flex items-baseline justify-between gap-3 text-[12.5px]">
                      <span className="text-runtime-ink-soft">{L.label}</span>
                      <span
                        className="hud shrink-0 text-[11px]"
                        style={{ color: "var(--color-signal-cool)", textTransform: "none" }}
                      >
                        {cfg[k]}
                      </span>
                    </span>
                    <input
                      type="range"
                      min={L.min}
                      max={L.max}
                      step={L.step}
                      value={cfg[k]}
                      onChange={(e) => set(k, Number(e.target.value))}
                      className="mt-1 w-full accent-[var(--color-signal)]"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-6 flex flex-wrap gap-2 border-t border-runtime-line/60 pt-4">
          <button type="button" className={btn} onClick={() => applyAll({ ...DEFAULT_BRAIN_CONFIG })}>
            сброс
          </button>
          <button type="button" className={btn} onClick={copy}>
            копировать
          </button>
          <button type="button" className={btn} onClick={paste}>
            вставить
          </button>
          <button
            type="button"
            onClick={doPush}
            disabled={push.kind === "busy"}
            className="btn-case ml-auto inline-flex h-9 cursor-pointer items-center px-5 text-[12px] font-semibold disabled:opacity-60"
          >
            {push.kind === "busy" ? "пушу…" : "запушить"} <span aria-hidden className="ml-1.5">→</span>
          </button>
        </div>

        {pasteErr ? (
          <p className="mt-3 text-[12px] text-[#ff8f73]">в буфере не JSON конфига</p>
        ) : null}
        {push.kind === "ok" ? (
          <p className="mt-3 text-[12px]" style={{ color: "var(--color-signal-cool)" }}>
            закоммичено — Vercel выкатит за ~2 мин
            {push.url ? (
              <>
                {" · "}
                <a href={push.url} target="_blank" rel="noreferrer" className="underline decoration-dotted underline-offset-4">
                  коммит
                </a>
              </>
            ) : null}
          </p>
        ) : null}
        {push.kind === "err" ? (
          <p className="mt-3 text-[12px] text-[#ff8f73]">не запушилось: {push.message}</p>
        ) : null}

        <p className="hud mt-4 text-[9px] text-runtime-ink-soft/60">
          // прод-версия: src/lib/brain-config.json · пуш = коммит в main
        </p>
      </aside>
    </div>
  );
}
