"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CursorPro — an upgraded custom cursor acting as a "probe / electrode".
 *
 * - Fine-pointer devices only (renders null on coarse pointers).
 * - Crosshair reticle with eased follow + live X/Y instrument readout.
 * - Magnetic lock-on to interactive elements (corner brackets snap to bounds).
 * - Short decaying "signal" trail drawn on a canvas.
 * - Hides the native cursor via `html.cursor-none *{cursor:none}` (existing CSS).
 * - Respects prefers-reduced-motion: no trail, no easing (snap), reticle kept.
 */

type Target = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
};

const MAGNETIC_SELECTOR = '[data-magnetic], a[href], button, [role="button"]';
const TRAIL_MAX = 14;

export default function CursorPro() {
  const [enabled, setEnabled] = useState(false);

  // Detect fine pointer once mounted (SSR-safe).
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const coarse = window.matchMedia("(pointer: coarse)");
    const apply = () => setEnabled(!coarse.matches);
    apply();
    if (coarse.addEventListener) {
      coarse.addEventListener("change", apply);
      return () => coarse.removeEventListener("change", apply);
    }
    // Legacy Safari fallback.
    coarse.addListener(apply);
    return () => coarse.removeListener(apply);
  }, []);

  if (!enabled) return null;
  return <CursorProInner />;
}

function CursorProInner() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reticleRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLDivElement | null>(null);
  const readoutXRef = useRef<HTMLSpanElement | null>(null);
  const readoutYRef = useRef<HTMLSpanElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const reticle = reticleRef.current;
    const readout = readoutRef.current;
    const readoutX = readoutXRef.current;
    const readoutY = readoutYRef.current;
    const labelEl = labelRef.current;
    const canvas = canvasRef.current;
    if (!root || !reticle || !readout || !readoutX || !readoutY || !labelEl || !canvas) {
      return;
    }

    const doc = document.documentElement;
    doc.classList.add("cursor-none");

    const ctx = canvas.getContext("2d");
    const reduceMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduce = reduceMedia.matches;

    // Pointer + eased state.
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let ex = px;
    let ey = py;
    let hasMoved = false;
    let visible = false;

    // Last position captured into the trail (to avoid stationary spam).
    let lastTrailX = px;
    let lastTrailY = py;

    // Magnetic target state (eased).
    let target: Target | null = null;
    // Rendered bracket box (eased toward target or collapsed to reticle size).
    const box = { x: px - 9, y: py - 9, w: 18, h: 18 };

    // Signal trail.
    type TrailPt = { x: number; y: number; life: number };
    const trail: TrailPt[] = [];

    let dpr = Math.min(2, window.devicePixelRatio || 1);

    const sizeCanvas = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeCanvas();

    // --- Magnetic detection ---------------------------------------------------
    const closestMagnetic = (el: Element | null): HTMLElement | null => {
      if (!el) return null;
      const match = el.closest(MAGNETIC_SELECTOR);
      return match instanceof HTMLElement ? match : null;
    };

    const readTarget = (el: HTMLElement): Target => {
      const r = el.getBoundingClientRect();
      const pad = 6;
      const label =
        el.getAttribute("data-cursor") || el.getAttribute("aria-label") || "";
      return {
        x: r.left - pad,
        y: r.top - pad,
        w: r.width + pad * 2,
        h: r.height + pad * 2,
        label,
      };
    };

    const refreshTarget = () => {
      if (!target) return;
      const el = document.elementFromPoint(px, py);
      const m = closestMagnetic(el);
      target = m ? readTarget(m) : null;
    };

    const onPointerOver = (e: PointerEvent) => {
      const el = closestMagnetic(e.target as Element | null);
      if (el) target = readTarget(el);
    };

    const onPointerOut = (e: PointerEvent) => {
      const related = e.relatedTarget as Element | null;
      if (!closestMagnetic(related)) target = null;
    };

    // --- Pointer move ---------------------------------------------------------
    const onPointerMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        // Seed eased position from the real pointer so the reticle never
        // flashes at the viewport centre on first move.
        ex = px;
        ey = py;
        lastTrailX = px;
        lastTrailY = py;
      }
      if (!visible) {
        visible = true;
        root.style.opacity = "1";
      }
    };

    const onPointerDown = () => {
      reticle.classList.add("cp-down");
    };
    const onPointerUp = () => {
      reticle.classList.remove("cp-down");
    };

    const onLeaveWindow = () => {
      visible = false;
      root.style.opacity = "0";
    };
    const onEnterWindow = () => {
      if (hasMoved) {
        visible = true;
        root.style.opacity = "1";
      }
    };

    // --- Animation loop -------------------------------------------------------
    let raf = 0;
    let running = true;
    let lastLabel = "";

    const setLabel = (text: string) => {
      if (text === lastLabel) return;
      lastLabel = text;
      labelEl.textContent = text;
      labelEl.style.opacity = text ? "1" : "0";
    };

    const render = () => {
      if (!running) return;

      const ease = reduce ? 1 : 0.22;
      ex += (px - ex) * ease;
      ey += (py - ey) * ease;

      const locked = target !== null;

      // Ease the bracket box toward target bounds, or collapse around reticle.
      const targetBox: Target | { x: number; y: number; w: number; h: number } =
        locked ? (target as Target) : { x: ex - 9, y: ey - 9, w: 18, h: 18 };
      const bEase = reduce ? 1 : 0.28;
      box.x += (targetBox.x - box.x) * bEase;
      box.y += (targetBox.y - box.y) * bEase;
      box.w += (targetBox.w - box.w) * bEase;
      box.h += (targetBox.h - box.h) * bEase;

      // Position the reticle group at the eased pointer.
      reticle.style.transform = `translate3d(${ex}px, ${ey}px, 0)`;
      reticle.classList.toggle("cp-locked", locked);

      // Position bracket box (relative to the reticle origin via CSS vars).
      reticle.style.setProperty("--bx", `${box.x - ex}px`);
      reticle.style.setProperty("--by", `${box.y - ey}px`);
      reticle.style.setProperty("--bw", `${box.w}px`);
      reticle.style.setProperty("--bh", `${box.h}px`);

      // Readout position + text.
      readout.style.transform = `translate3d(${ex + 16}px, ${ey + 16}px, 0)`;
      readoutX.textContent = String(Math.round(px)).padStart(4, "0");
      readoutY.textContent = String(Math.round(py)).padStart(4, "0");

      // Label (below-left of the locked target).
      if (locked && (target as Target).label) {
        labelEl.style.transform = `translate3d(${box.x}px, ${
          box.y + box.h + 6
        }px, 0)`;
        setLabel((target as Target).label);
      } else {
        setLabel("");
      }

      // --- Trail ---
      if (ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (!reduce && visible) {
          const dx = px - lastTrailX;
          const dy = py - lastTrailY;
          if (dx * dx + dy * dy > 1) {
            trail.push({ x: px, y: py, life: 1 });
            lastTrailX = px;
            lastTrailY = py;
            if (trail.length > TRAIL_MAX) trail.shift();
          }
          for (let i = 0; i < trail.length; i++) {
            const p = trail[i];
            p.life *= 0.86;
            if (p.life < 0.04) continue;
            const t = i / trail.length;
            const rad = 1.2 + t * 2.2;
            ctx.beginPath();
            ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 103, 255, ${p.life * 0.5 * t})`;
            ctx.fill();
          }
        }
      }

      raf = requestAnimationFrame(render);
    };

    const start = () => {
      if (raf) cancelAnimationFrame(raf);
      running = true;
      raf = requestAnimationFrame(render);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // --- Reduced-motion + visibility handling --------------------------------
    const onReduceChange = () => {
      reduce = reduceMedia.matches;
      if (reduce) {
        trail.length = 0;
        if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ex = px;
        ey = py;
      }
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onResize = () => {
      sizeCanvas();
      refreshTarget();
    };

    const onScroll = () => {
      refreshTarget();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("blur", onLeaveWindow);
    window.addEventListener("focus", onEnterWindow);
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    document.addEventListener("visibilitychange", onVisibility);
    if (reduceMedia.addEventListener) {
      reduceMedia.addEventListener("change", onReduceChange);
    } else {
      reduceMedia.addListener(onReduceChange);
    }

    start();

    return () => {
      stop();
      doc.classList.remove("cursor-none");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("blur", onLeaveWindow);
      window.removeEventListener("focus", onEnterWindow);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      window.removeEventListener("resize", onResize);
      window.removeEventListener(
        "scroll",
        onScroll,
        { capture: true } as EventListenerOptions,
      );
      document.removeEventListener("visibilitychange", onVisibility);
      if (reduceMedia.removeEventListener) {
        reduceMedia.removeEventListener("change", onReduceChange);
      } else {
        reduceMedia.removeListener(onReduceChange);
      }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 180ms ease",
        contain: "layout style",
      }}
    >
      {/* Signal trail canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
      />

      {/* Reticle group (translated to eased pointer position) */}
      <div
        ref={reticleRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          willChange: "transform",
        }}
      >
        {/* Crosshair lines */}
        <span
          className="cp-line cp-line-h"
          style={{
            position: "absolute",
            left: "-11px",
            top: "-0.5px",
            width: "22px",
            height: "1px",
            background: "var(--color-signal, #8b67ff)",
            opacity: 0.9,
          }}
        />
        <span
          className="cp-line cp-line-v"
          style={{
            position: "absolute",
            left: "-0.5px",
            top: "-11px",
            width: "1px",
            height: "22px",
            background: "var(--color-signal, #8b67ff)",
            opacity: 0.9,
          }}
        />
        {/* Center ring */}
        <span
          className="cp-ring"
          style={{
            position: "absolute",
            left: "-4px",
            top: "-4px",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            border: "1px solid var(--color-signal, #8b67ff)",
            boxShadow: "0 0 8px 0 rgba(139,103,255,0.65)",
          }}
        />

        {/* Corner brackets — positioned/sized via CSS vars set each frame */}
        <div
          className="cp-brackets"
          style={{
            position: "absolute",
            left: "var(--bx, -9px)",
            top: "var(--by, -9px)",
            width: "var(--bw, 18px)",
            height: "var(--bh, 18px)",
            pointerEvents: "none",
          }}
        >
          <span className="cp-corner cp-tl" />
          <span className="cp-corner cp-tr" />
          <span className="cp-corner cp-bl" />
          <span className="cp-corner cp-br" />
        </div>
      </div>

      {/* X/Y instrument readout */}
      <div
        ref={readoutRef}
        className="hud"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          fontFamily: "var(--font-display, ui-monospace, monospace)",
          fontSize: "9px",
          letterSpacing: "0.12em",
          lineHeight: 1.35,
          color: "var(--color-signal-2, #c856ff)",
          textShadow: "0 0 6px rgba(200,86,255,0.35)",
          whiteSpace: "nowrap",
          willChange: "transform",
        }}
      >
        <span style={{ color: "var(--color-runtime-ink-soft, #8b84a6)" }}>X</span>
        &nbsp;
        <span ref={readoutXRef}>0000</span>
        &nbsp;&nbsp;
        <span style={{ color: "var(--color-runtime-ink-soft, #8b84a6)" }}>Y</span>
        &nbsp;
        <span ref={readoutYRef}>0000</span>
      </div>

      {/* Lock-on label */}
      <div
        ref={labelRef}
        className="hud tech-label"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          fontFamily: "var(--font-display, ui-monospace, monospace)",
          fontSize: "9px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--color-signal, #8b67ff)",
          textShadow: "0 0 8px rgba(139,103,255,0.5)",
          whiteSpace: "nowrap",
          opacity: 0,
          transition: "opacity 140ms ease",
          willChange: "transform, opacity",
        }}
      />

      {/* Scoped styles for reticle sub-elements */}
      <style>{`
        .cp-brackets .cp-corner {
          position: absolute;
          width: 8px;
          height: 8px;
          border: 1px solid var(--color-signal, #8b67ff);
          box-shadow: 0 0 6px 0 rgba(139,103,255,0.55);
          opacity: 0;
          transition: opacity 160ms ease;
        }
        .cp-brackets .cp-tl { left: -1px; top: -1px; border-right: 0; border-bottom: 0; }
        .cp-brackets .cp-tr { right: -1px; top: -1px; border-left: 0; border-bottom: 0; }
        .cp-brackets .cp-bl { left: -1px; bottom: -1px; border-right: 0; border-top: 0; }
        .cp-brackets .cp-br { right: -1px; bottom: -1px; border-left: 0; border-top: 0; }

        .cp-locked .cp-brackets .cp-corner { opacity: 1; }
        .cp-locked .cp-line,
        .cp-locked .cp-ring { opacity: 0; }
        .cp-line { transition: opacity 140ms ease; }
        .cp-ring { transition: opacity 140ms ease, transform 120ms ease; }
        .cp-down .cp-ring { transform: scale(0.6); }

        html.color-mode .cp-line,
        html.color-mode .cp-brackets .cp-corner { box-shadow: 0 0 10px 0 rgba(200,86,255,0.7); }
        html.color-mode .cp-ring { box-shadow: 0 0 12px 0 rgba(200,86,255,0.8); }
      `}</style>
    </div>
  );
}
