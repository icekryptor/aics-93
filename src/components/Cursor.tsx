"use client";

import { useEffect, useRef } from "react";

// Designer-style crosshair cursor: a small cross that follows the pointer,
// dashed guide lines reaching back to the top (X axis) and left (Y axis)
// edges, and a tiny X/Y coordinate readout next to it.
export default function Cursor() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const vRef = useRef<HTMLDivElement | null>(null);
  const hRef = useRef<HTMLDivElement | null>(null);
  const crossRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // only on devices with a precise pointer
    if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) return;

    const root = rootRef.current;
    const v = vRef.current;
    const h = hRef.current;
    const cross = crossRef.current;
    const label = labelRef.current;
    if (!root || !v || !h || !cross || !label) return;

    document.documentElement.classList.add("cursor-none");
    root.style.opacity = "0";

    let raf = 0;
    let x = -100;
    let y = -100;

    const render = () => {
      raf = 0;
      v.style.transform = `translateX(${x}px)`;
      v.style.height = `${y}px`;
      h.style.transform = `translateY(${y}px)`;
      h.style.width = `${x}px`;
      cross.style.transform = `translate(${x}px, ${y}px)`;
      // keep the label inside the viewport
      const lx = x + 14 > window.innerWidth - 70 ? x - 62 : x + 14;
      const ly = y + 14 > window.innerHeight - 24 ? y - 22 : y + 14;
      label.style.transform = `translate(${lx}px, ${ly}px)`;
      label.textContent = `X ${Math.round(x)}  Y ${Math.round(y)}`;
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      root.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(render);
    };
    const onLeave = () => {
      root.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200] hidden transition-opacity duration-200 [@media(pointer:fine)]:block"
    >
      {/* vertical dashed line from top edge to cursor */}
      <div
        ref={vRef}
        className="absolute left-0 top-0 w-px border-l border-dashed border-ink/35"
        style={{ height: 0 }}
      />
      {/* horizontal dashed line from left edge to cursor */}
      <div
        ref={hRef}
        className="absolute left-0 top-0 h-px border-t border-dashed border-ink/35"
        style={{ width: 0 }}
      />
      {/* crosshair */}
      <div ref={crossRef} className="absolute left-0 top-0">
        <div className="relative -left-[9px] -top-[9px] size-[18px]">
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink" />
          <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-ink" />
        </div>
      </div>
      {/* X / Y readout */}
      <div
        ref={labelRef}
        className="absolute left-0 top-0 font-display text-[10px] tracking-tight text-ink/70"
      />
    </div>
  );
}
