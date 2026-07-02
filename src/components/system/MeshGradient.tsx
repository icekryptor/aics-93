"use client";

import { useEffect, useRef } from "react";

/**
 * MeshGradient — fluid mesh-gradient layer BEHIND the modular grid.
 *
 * mono (default): soft drifting grey/lavender-grey blobs — barely-there depth.
 * colour mode («добавить яркости»): animated fluid gradient in the brand
 * spectrum — violet / голубой / pink / orange / lime.
 *
 * Cheap technique: blobs are drawn as radial gradients on a tiny offscreen
 * canvas (~160px wide) and upscaled with bilinear smoothing → soft fluid field
 * with no per-frame blur cost. Pauses on hidden tab; static under
 * prefers-reduced-motion.
 */

const MONO_COLORS = ["#e4e1ee", "#d6d2e6", "#efedf8", "#cdc9de", "#e9e6f4"];
const VIVID_COLORS = ["#9747ff", "#5ab8ff", "#ff6ec7", "#ff9a4d", "#c5ff44"];

type Blob = {
  bx: number; // base x (0..1)
  by: number; // base y (0..1)
  r: number; // radius as fraction of min(smallW, smallH)
  ax: number; // drift amplitude x
  ay: number; // drift amplitude y
  sx: number; // drift speed x
  sy: number; // drift speed y
  ph: number; // phase
};

const SMALL_W = 160;

export default function MeshGradient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const off = document.createElement("canvas");
    const octx = off.getContext("2d");
    if (!octx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isColor = () => document.documentElement.classList.contains("color-mode");

    let width = 0;
    let height = 0;
    let smallH = 90;
    let raf = 0;
    let running = false;
    let t = 0;
    let last = 0;

    // deterministic-feeling blob field (fixed seeds)
    const blobs: Blob[] = [
      { bx: 0.18, by: 0.22, r: 0.85, ax: 0.1, ay: 0.08, sx: 0.05, sy: 0.041, ph: 0.4 },
      { bx: 0.78, by: 0.16, r: 0.75, ax: 0.09, ay: 0.1, sx: 0.043, sy: 0.056, ph: 1.7 },
      { bx: 0.55, by: 0.62, r: 0.95, ax: 0.12, ay: 0.09, sx: 0.036, sy: 0.049, ph: 3.1 },
      { bx: 0.12, by: 0.8, r: 0.7, ax: 0.08, ay: 0.11, sx: 0.058, sy: 0.038, ph: 4.6 },
      { bx: 0.88, by: 0.78, r: 0.8, ax: 0.1, ay: 0.08, sx: 0.047, sy: 0.052, ph: 5.9 },
    ];

    const resize = () => {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      smallH = Math.max(60, Math.round((SMALL_W * height) / width));
      off.width = SMALL_W;
      off.height = smallH;
      drawFrame();
    };

    const hexToRgb = (h: string): [number, number, number] => [
      parseInt(h.slice(1, 3), 16),
      parseInt(h.slice(3, 5), 16),
      parseInt(h.slice(5, 7), 16),
    ];

    const drawFrame = () => {
      const color = isColor();
      const palette = color ? VIVID_COLORS : MONO_COLORS;
      const alpha = color ? 0.5 : 0.55;

      octx.clearRect(0, 0, SMALL_W, smallH);
      const minDim = Math.min(SMALL_W, smallH);
      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        const x = (b.bx + Math.sin(t * b.sx * 6 + b.ph) * b.ax) * SMALL_W;
        const y = (b.by + Math.cos(t * b.sy * 6 + b.ph * 1.3) * b.ay) * smallH;
        const r = b.r * minDim;
        const [cr, cg, cb] = hexToRgb(palette[i % palette.length]);
        const g = octx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        octx.fillStyle = g;
        octx.beginPath();
        octx.arc(x, y, r, 0, Math.PI * 2);
        octx.fill();
      }

      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.globalAlpha = color ? 0.5 : 0.6;
      ctx.drawImage(off, 0, 0, SMALL_W, smallH, 0, 0, width, height);
      ctx.globalAlpha = 1;
    };

    const step = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      t += dt;
      drawFrame();
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const onVis = () => (document.hidden ? stop() : start());

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    if (reduce) drawFrame();
    else start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -12 }}
    />
  );
}
