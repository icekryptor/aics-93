"use client";

import { useEffect, useRef, useState } from "react";
import { frameworks } from "@/lib/content";

const N = frameworks.length;

function Corners() {
  const base = "absolute size-3 border-ink/40";
  return (
    <>
      <span className={`${base} left-2 top-2 border-l border-t`} />
      <span className={`${base} right-2 top-2 border-r border-t`} />
      <span className={`${base} left-2 bottom-2 border-l border-b`} />
      <span className={`${base} right-2 bottom-2 border-r border-b`} />
    </>
  );
}

function Scale() {
  // lab-tech measurement ruler along the bottom of a card
  return (
    <div className="mt-6 flex h-5 items-end gap-[3px]" aria-hidden>
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className="w-px bg-ink/35"
          style={{ height: i % 5 === 0 ? "100%" : "45%" }}
        />
      ))}
    </div>
  );
}

export default function FrameworkCarousel({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(0);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState(380);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const start = useRef<{ x: number; id: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const w = wrapRef.current?.clientWidth ?? 800;
      // card width + gap, clamped; adjacent cards peek
      setStep(Math.max(240, Math.min(420, w * 0.42)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const clamp = (i: number) => Math.max(0, Math.min(N - 1, i));
  const go = (dir: number) => setActive((a) => clamp(a + dir));

  const onDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, id: e.pointerId };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    setDx(e.clientX - start.current.x);
  };
  const onUp = () => {
    if (!start.current) return;
    const moved = dx;
    start.current = null;
    setDragging(false);
    setDx(0);
    if (Math.abs(moved) > step * 0.18) go(moved < 0 ? 1 : -1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={className}>
      {/* header: index + controls */}
      <div className="mb-5 flex items-center justify-between">
        <span className="tech-label text-xs text-ink-soft">
          [ {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")} ]
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => go(-1)}
            disabled={active === 0}
            aria-label="Назад"
            className="grid size-10 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
          >
            ‹
          </button>
          <button
            onClick={() => go(1)}
            disabled={active === N - 1}
            aria-label="Вперёд"
            className="grid size-10 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
          >
            ›
          </button>
        </div>
      </div>

      {/* stage */}
      <div
        ref={wrapRef}
        className="relative h-[320px] cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={onUp}
      >
        {frameworks.map((f, i) => {
          const offset = (i - active) * step + dx;
          const dist = Math.abs(offset) / step;
          const hidden = dist > 2.2;
          const isActive = i === active && Math.abs(dx) < step * 0.4;
          return (
            <article
              key={f.code}
              className={`absolute left-1/2 top-1/2 w-[clamp(250px,80vw,360px)] ${
                dragging ? "" : "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              }`}
              style={{
                transform: `translate(-50%, -50%) translateX(${offset}px) scale(${
                  isActive ? 1 : 0.86
                })`,
                opacity: hidden ? 0 : isActive ? 1 : 0.4,
                zIndex: 100 - Math.round(dist * 10),
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <div className="relative rounded-[22px] border border-line bg-bg px-7 pb-6 pt-8">
                <Corners />
                <div className="flex items-baseline justify-between">
                  <span className="tech-label text-xs text-ink-soft">[ {f.n} ]</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                    method
                  </span>
                </div>
                <p className="mt-4 font-display text-[2.6rem] font-normal leading-none text-accent">
                  {f.code}
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-ink-soft">
                  {f.full}
                </p>
                <p className="mt-4 min-h-[66px] text-sm leading-relaxed text-ink-soft">{f.text}</p>
                <Scale />
              </div>
            </article>
          );
        })}
      </div>

      {/* bottom ruler / position indicator */}
      <div className="mt-6 flex items-center gap-3">
        <span className="font-mono text-[10px] text-ink-soft">00</span>
        <div className="relative h-6 flex-1">
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between">
            {frameworks.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Метод ${i + 1}`}
                className="group flex h-6 w-4 items-center justify-center"
              >
                <span
                  className={`w-px transition-all ${
                    i === active ? "h-6 bg-accent" : "h-3 bg-ink/30 group-hover:h-4 group-hover:bg-ink/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <span className="font-mono text-[10px] text-ink-soft">{N}</span>
      </div>
    </div>
  );
}
