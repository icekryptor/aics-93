"use client";

import { useEffect, useRef, useState } from "react";
import { PROCESS_VIDEO } from "@/lib/media";

/* ------------------------------------------------------------------ *
 * AiProcess — dark "runtime" section dramatizing AI woven into a
 * company's processes. The centrepiece is a looping render of a
 * central processor-core routing signals out to peripheral nodes,
 * framed in a cut-corner HUD panel (poster image as fallback).
 * Self-contained client component. No external deps.
 * ------------------------------------------------------------------ */

// 4-corner chamfer matching the DS "chip" language.
const FRAME_CUT: React.CSSProperties = {
  clipPath:
    "polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)",
};

export default function AiProcess() {
  return (
    <section
      id="ai"
      className="runtime relative isolate overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 90% at 50% -10%, var(--color-runtime-2, #171029) 0%, var(--color-runtime, #0e0a1b) 62%)",
        color: "var(--color-runtime-ink, #efeaff)",
      }}
    >
      {/* top seam */}
      <div className="signal-seam" aria-hidden="true" />

      {/* grid overlay */}
      <div
        className="runtime-grid pointer-events-none absolute inset-0 opacity-[0.5]"
        aria-hidden="true"
        style={{
          maskImage: "radial-gradient(120% 80% at 50% 30%, #000 30%, transparent 92%)",
          WebkitMaskImage: "radial-gradient(120% 80% at 50% 30%, #000 30%, transparent 92%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-28 lg:py-36">
        {/* ---------- HEADER ---------- */}
        <header className="max-w-3xl">
          <span
            className="tech-label"
            style={{
              color: "var(--color-signal, #9747ff)",
              fontFamily: "var(--font-sans, inherit)",
              letterSpacing: "0.22em",
              fontSize: "0.72rem",
              textTransform: "uppercase",
            }}
          >
            [ ai в ваших процессах ]
          </span>

          <h2
            className="mt-6 text-balance text-3xl font-semibold leading-[1.08] sm:text-4xl lg:text-[3.35rem]"
            style={{ color: "var(--color-runtime-ink, #efeaff)" }}
          >
            ИИ — не инструмент.{" "}
            <span
              className="signal-text"
              style={{
                background:
                  "linear-gradient(92deg, var(--color-signal, #9747ff), var(--color-signal-2, #b57bff))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Это ядро
            </span>
            , которое приводит в движение все процессы.
          </h2>

          <p
            className="mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--color-runtime-ink-soft, #a99fce)" }}
          >
            Внедряю сеть нейроагентов в процессы компаний — от контента и
            аналитики до продаж и найма. Один связный контур: данные текут в
            ядро, решения возвращаются в каждый узел.
          </p>
        </header>

        {/* ---------- MEDIA: process router ---------- */}
        <div className="relative mt-14 sm:mt-16">
          <div
            className="tech-label mb-4 flex items-center gap-2"
            style={{
              color: "var(--color-runtime-ink-soft, #a99fce)",
              fontFamily: "var(--font-sans, inherit)",
              fontSize: "0.66rem",
              letterSpacing: "0.2em",
            }}
            aria-hidden="true"
          >
            <span
              className="hud-dot"
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "var(--color-signal, #9747ff)",
                boxShadow: "0 0 8px var(--color-signal, #9747ff)",
              }}
            />
            AICS-93 / PROCESS ROUTER
          </div>

          <ProcessMedia />

          <p className="sr-only">
            Анимация: центральный процессор-ядро, к которому по светящимся
            дорожкам сходятся периферийные узлы — маркетинг, контент, продажи,
            аналитика, поддержка и найм. Сигнал циркулирует между ядром и узлами.
          </p>
        </div>

        {/* ---------- БЫЛО / СТАЛО ---------- */}
        <div className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-2 sm:gap-5">
          {/* было */}
          <div
            className="rounded-2xl p-6 sm:p-7"
            style={{
              border: "1px solid var(--color-runtime-line, #2c2247)",
              background: "rgba(23, 16, 41,0.5)",
            }}
          >
            <div
              className="tech-label"
              style={{
                fontFamily: "var(--font-sans, inherit)",
                fontSize: "0.68rem",
                letterSpacing: "0.24em",
                color: "var(--color-runtime-ink-soft, #a99fce)",
              }}
            >
              БЫЛО
            </div>
            <ul
              className="mt-4 space-y-3 text-[0.95rem] leading-relaxed"
              style={{ color: "var(--color-runtime-ink-soft, #a99fce)" }}
            >
              {["ручные процессы", "разрозненные данные", "решения «на глаз»"].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.55em] inline-block h-px w-4 shrink-0"
                    style={{ background: "var(--color-runtime-line, #2c2247)" }}
                  />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* стало */}
          <div
            className="signal-glow relative overflow-hidden rounded-2xl p-6 sm:p-7"
            style={{
              border: "1px solid rgba(151, 71, 255,0.4)",
              background:
                "linear-gradient(180deg, rgba(151, 71, 255,0.1), rgba(181, 123, 255,0.04))",
            }}
          >
            <div
              className="tech-label"
              style={{
                fontFamily: "var(--font-sans, inherit)",
                fontSize: "0.68rem",
                letterSpacing: "0.24em",
                color: "var(--color-signal, #9747ff)",
              }}
            >
              СТАЛО
            </div>
            <ul
              className="mt-4 space-y-3 text-[0.95rem] leading-relaxed"
              style={{ color: "var(--color-runtime-ink, #efeaff)" }}
            >
              {["агенты в каждом узле", "единый поток данных", "решения на данных"].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.5em] inline-block h-[7px] w-[7px] shrink-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(92deg, var(--color-signal, #9747ff), var(--color-signal-2, #b57bff))",
                      boxShadow: "0 0 10px rgba(151, 71, 255,0.9)",
                    }}
                  />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- OUTCOME CHIPS ---------- */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-4 sm:gap-4">
          {(
            [
              { n: "−70%", l: "рутины" },
              { n: "×3", l: "скорость решений" },
              { n: "24/7", l: "агенты" },
              { n: "1", l: "источник правды" },
            ] as const
          ).map((m) => (
            <div
              key={m.l}
              className="rounded-xl px-4 py-5"
              style={{
                border: "1px solid var(--color-runtime-line, #2c2247)",
                background: "rgba(23, 16, 41,0.45)",
              }}
            >
              <div
                className="signal-text text-2xl font-semibold sm:text-3xl"
                style={{
                  fontFamily: "var(--font-display, inherit)",
                  fontVariantNumeric: "tabular-nums",
                  background:
                    "linear-gradient(92deg, var(--color-signal, #9747ff), var(--color-signal-2, #b57bff))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {m.n}
              </div>
              <div
                className="mt-1.5 text-[0.78rem] leading-snug"
                style={{ color: "var(--color-runtime-ink-soft, #a99fce)" }}
              >
                {m.l}
              </div>
            </div>
          ))}
        </div>

        <p
          className="mt-5 text-[0.72rem]"
          style={{ color: "var(--color-runtime-ink-soft, #a99fce)", opacity: 0.7 }}
        >
          * Показатели иллюстративны и зависят от процессов конкретной компании.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * ProcessMedia — the looping render in a cut-corner HUD frame.
 * Plays only while in view + honours prefers-reduced-motion (poster
 * only). Poster image doubles as the fallback before the video loads.
 * ------------------------------------------------------------------ */

function ProcessMedia() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reduced, setReduced] = useState(false);

  // reduced-motion → never autoplay; show the static poster instead.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // play only while on screen (perf + battery); pause offscreen.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    if (typeof IntersectionObserver === "undefined") {
      v.play().catch(() => {});
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div className="relative">
      {/* gradient hairline border via a chamfered wrapper */}
      <div
        className="relative p-px"
        style={{
          ...FRAME_CUT,
          background:
            "linear-gradient(150deg, color-mix(in srgb, var(--color-signal) 55%, transparent), color-mix(in srgb, var(--color-signal-2) 20%, transparent) 45%, var(--color-runtime-line, #2c2247))",
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{ ...FRAME_CUT, background: "var(--color-runtime, #0e0a1b)" }}
        >
          <div className="relative aspect-video w-full">
            {reduced ? (
              // static frame when motion is reduced
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={PROCESS_VIDEO.poster}
                alt="Схема процессов: ядро-процессор и периферийные узлы"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src={PROCESS_VIDEO.src}
                poster={PROCESS_VIDEO.poster}
                muted
                loop
                playsInline
                preload="metadata"
                autoPlay
                aria-hidden="true"
              />
            )}

            {/* subtle inner vignette so the frame reads as a screen */}
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(14,10,27,0.55) 100%)",
              }}
            />

            {/* corner brackets — HUD accent */}
            {(
              [
                { pos: "left-3 top-3", b: "border-l border-t" },
                { pos: "right-3 top-3", b: "border-r border-t" },
                { pos: "left-3 bottom-3", b: "border-l border-b" },
                { pos: "right-3 bottom-3", b: "border-r border-b" },
              ] as const
            ).map((c) => (
              <span
                key={c.pos}
                aria-hidden="true"
                className={`pointer-events-none absolute ${c.pos} ${c.b} h-4 w-4`}
                style={{ borderColor: "color-mix(in srgb, var(--color-signal) 55%, transparent)" }}
              />
            ))}

            {/* status label bottom-left */}
            <div
              className="tech-label pointer-events-none absolute bottom-3 left-6 flex items-center gap-2"
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-sans, inherit)",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                color: "var(--color-runtime-ink-soft, #a99fce)",
              }}
            >
              <span
                className="hud-dot"
                style={{
                  display: "inline-block",
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  background: "var(--color-signal, #9747ff)",
                  boxShadow: "0 0 8px var(--color-signal, #9747ff)",
                }}
              />
              CORE.00 · SIGNAL ROUTING
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
