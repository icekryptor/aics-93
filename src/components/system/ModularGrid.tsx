"use client";

import { useEffect, useRef } from "react";

/**
 * ModularGrid — the ambient background of the experience.
 *
 * A calm modular grid (minor/major lines + "+" crosses at major intersections)
 * with sparse, slowly breathing cell highlights. Deliberately quiet: the grid
 * is static; only a handful of cells fade in/out at any moment.
 *
 * - mono (default): graphite highlights
 * - colour mode (.color-mode on <html>): DS palette highlights
 *   (#9747ff violet / #ccbbee mild / #c5ff44 lime / #ff7050 coral)
 *
 * Canvas 2D, DPR-capped, pauses on hidden tab, static under reduced-motion.
 */

const CELL = 48; // minor cell, px
const MAJOR = 5; // every 5th line is a major line

// [r,g,b] palettes for the breathing cells
const MONO_COLORS: [number, number, number][] = [[48, 32, 85]];
const DS_COLORS: [number, number, number][] = [
  [151, 71, 255], // violet
  [204, 187, 238], // mild
  [197, 255, 68], // lime (constructive)
  [255, 112, 80], // coral (destructive)
];

type Cell = {
  cx: number; // cell col
  cy: number; // cell row
  t: number; // 0..1 life
  dur: number; // seconds for a full in-out cycle
  color: [number, number, number];
  peak: number; // max alpha
};

export default function ModularGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let last = 0;
    let cells: Cell[] = [];
    let spawnTimer = 0;

    const isColor = () => document.documentElement.classList.contains("color-mode");

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawStatic();
    };

    // static layer: grid lines + crosses (redrawn every frame under the cells —
    // cheap: ~60 lines + ~40 crosses)
    const drawGrid = () => {
      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      ctx.lineWidth = 1;
      for (let i = 0; i <= cols; i++) {
        const x = i * CELL + 0.5;
        const major = i % MAJOR === 0;
        ctx.strokeStyle = `rgba(48, 32, 85, ${major ? 0.07 : 0.035})`;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let j = 0; j <= rows; j++) {
        const y = j * CELL + 0.5;
        const major = j % MAJOR === 0;
        ctx.strokeStyle = `rgba(48, 32, 85, ${major ? 0.07 : 0.035})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      // "+" crosses at major intersections
      ctx.strokeStyle = "rgba(48, 32, 85, 0.16)";
      const arm = 4;
      for (let i = 0; i <= cols; i += MAJOR) {
        for (let j = 0; j <= rows; j += MAJOR) {
          const x = i * CELL + 0.5;
          const y = j * CELL + 0.5;
          ctx.beginPath();
          ctx.moveTo(x - arm, y);
          ctx.lineTo(x + arm, y);
          ctx.moveTo(x, y - arm);
          ctx.lineTo(x, y + arm);
          ctx.stroke();
        }
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
    };

    const spawnCell = () => {
      const cols = Math.floor(width / CELL);
      const rows = Math.floor(height / CELL);
      const palette = isColor() ? DS_COLORS : MONO_COLORS;
      cells.push({
        cx: Math.floor(Math.random() * cols),
        cy: Math.floor(Math.random() * rows),
        t: 0,
        dur: 4.5 + Math.random() * 3.5,
        color: palette[Math.floor(Math.random() * palette.length)],
        peak: isColor() ? 0.18 + Math.random() * 0.12 : 0.06 + Math.random() * 0.04,
      });
    };

    const step = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;

      // keep 4-6 cells alive with slow turnover
      spawnTimer -= dt;
      if (cells.length < 6 && spawnTimer <= 0) {
        spawnCell();
        spawnTimer = 0.9 + Math.random() * 1.4;
      }

      ctx.clearRect(0, 0, width, height);
      drawGrid();

      for (let i = cells.length - 1; i >= 0; i--) {
        const c = cells[i];
        c.t += dt / c.dur;
        if (c.t >= 1) {
          cells.splice(i, 1);
          continue;
        }
        // smooth in-out envelope
        const a = Math.sin(c.t * Math.PI) * c.peak;
        const [r, g, b] = c.color;
        const x = c.cx * CELL;
        const y = c.cy * CELL;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
        // subtle border on the lit cell
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a * 1.6})`;
        ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
      }

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
    if (reduce) drawStatic();
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
      style={{ zIndex: -10 }}
    />
  );
}
