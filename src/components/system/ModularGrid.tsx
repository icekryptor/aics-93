"use client";

import { useEffect, useRef } from "react";

/**
 * ModularGrid — pseudo-3D isometric grid (60° between axes) with light signal
 * transmission: occasional glowing pulses travel along the grid lines, and a
 * few iso-diamond cells slowly breathe.
 *
 * mono (default): graphite; colour mode: DS palette accents.
 * Sits above the MeshGradient layer, below the page.
 */

const CELL = 56; // iso cell size, px
const ANG = Math.PI / 6; // 30° from horizontal → 60° between the two axes
const MAJOR = 5;

const DS_COLORS: [number, number, number][] = [
  [151, 71, 255], // violet
  [90, 184, 255], // голубой
  [255, 110, 199], // pink
  [255, 154, 77], // orange
  [197, 255, 68], // lime
];
const MONO_RGB: [number, number, number] = [48, 32, 85];

type Pulse = {
  axis: 0 | 1; // 0 = u-line, 1 = v-line
  k: number; // line index
  t: number; // 0..1 along the visible span
  speed: number;
  color: [number, number, number];
};

type Cell = {
  u: number;
  v: number;
  t: number;
  dur: number;
  peak: number;
  color: [number, number, number];
};

export default function ModularGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isColor = () => document.documentElement.classList.contains("color-mode");

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let last = 0;
    let pulses: Pulse[] = [];
    let cells: Cell[] = [];
    let pulseTimer = 0.6;
    let cellTimer = 0;
    // grid extents (recomputed on resize)
    let uMin = 0, uMax = 0, vMin = 0, vMax = 0;

    const C = Math.cos(ANG) * CELL;
    const S = Math.sin(ANG) * CELL;

    // iso projection: grid (u,v) → screen
    const px = (u: number, v: number) => width / 2 + (u - v) * C;
    const py = (u: number, v: number) => height / 2 + (u + v) * S;

    const computeExtents = () => {
      // enough lines to cover the viewport from the centre
      const spanU = Math.ceil(width / (2 * C)) + Math.ceil(height / (2 * S));
      uMin = -spanU;
      uMax = spanU;
      vMin = -spanU;
      vMax = spanU;
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      computeExtents();
      drawStatic();
    };

    const drawGrid = () => {
      ctx.lineWidth = 1;
      // u-lines (const u, varying v) and v-lines (const v, varying u)
      for (let u = uMin; u <= uMax; u++) {
        const major = ((u % MAJOR) + MAJOR) % MAJOR === 0;
        ctx.strokeStyle = `rgba(${MONO_RGB[0]}, ${MONO_RGB[1]}, ${MONO_RGB[2]}, ${major ? 0.065 : 0.032})`;
        ctx.beginPath();
        ctx.moveTo(px(u, vMin), py(u, vMin));
        ctx.lineTo(px(u, vMax), py(u, vMax));
        ctx.stroke();
      }
      for (let v = vMin; v <= vMax; v++) {
        const major = ((v % MAJOR) + MAJOR) % MAJOR === 0;
        ctx.strokeStyle = `rgba(${MONO_RGB[0]}, ${MONO_RGB[1]}, ${MONO_RGB[2]}, ${major ? 0.065 : 0.032})`;
        ctx.beginPath();
        ctx.moveTo(px(uMin, v), py(uMin, v));
        ctx.lineTo(px(uMax, v), py(uMax, v));
        ctx.stroke();
      }
      // node ticks on major intersections
      ctx.fillStyle = `rgba(${MONO_RGB[0]}, ${MONO_RGB[1]}, ${MONO_RGB[2]}, 0.14)`;
      for (let u = uMin; u <= uMax; u += MAJOR) {
        for (let v = vMin; v <= vMax; v += MAJOR) {
          const x = px(u, v);
          const y = py(u, v);
          if (x < -8 || x > width + 8 || y < -8 || y > height + 8) continue;
          ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        }
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
    };

    const palette = (): [number, number, number][] => (isColor() ? DS_COLORS : [MONO_RGB]);

    const spawnPulse = () => {
      const pal = palette();
      pulses.push({
        axis: Math.random() < 0.5 ? 0 : 1,
        k: Math.round(uMin + Math.random() * (uMax - uMin)),
        t: 0,
        speed: 0.06 + Math.random() * 0.08,
        color: pal[Math.floor(Math.random() * pal.length)],
      });
    };

    const spawnCell = () => {
      const pal = palette();
      cells.push({
        u: Math.round(uMin / 2 + Math.random() * (uMax - uMin) * 0.5),
        v: Math.round(vMin / 2 + Math.random() * (vMax - vMin) * 0.5),
        t: 0,
        dur: 5 + Math.random() * 3,
        peak: isColor() ? 0.16 + Math.random() * 0.1 : 0.05 + Math.random() * 0.04,
        color: pal[Math.floor(Math.random() * pal.length)],
      });
    };

    const step = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;

      pulseTimer -= dt;
      if (pulses.length < 3 && pulseTimer <= 0) {
        spawnPulse();
        pulseTimer = 1.6 + Math.random() * 2.2;
      }
      cellTimer -= dt;
      if (cells.length < 4 && cellTimer <= 0) {
        spawnCell();
        cellTimer = 1.2 + Math.random() * 1.6;
      }

      ctx.clearRect(0, 0, width, height);
      drawGrid();

      // breathing iso-diamond cells
      for (let i = cells.length - 1; i >= 0; i--) {
        const c = cells[i];
        c.t += dt / c.dur;
        if (c.t >= 1) {
          cells.splice(i, 1);
          continue;
        }
        const a = Math.sin(c.t * Math.PI) * c.peak;
        const [r, g, b] = c.color;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.beginPath();
        ctx.moveTo(px(c.u, c.v), py(c.u, c.v));
        ctx.lineTo(px(c.u + 1, c.v), py(c.u + 1, c.v));
        ctx.lineTo(px(c.u + 1, c.v + 1), py(c.u + 1, c.v + 1));
        ctx.lineTo(px(c.u, c.v + 1), py(c.u, c.v + 1));
        ctx.closePath();
        ctx.fill();
      }

      // signal pulses gliding along grid lines
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed * dt * 4;
        if (p.t >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const [r, g, b] = p.color;
        let x: number, y: number, x2: number, y2: number;
        if (p.axis === 0) {
          const v = vMin + (vMax - vMin) * p.t;
          x = px(p.k, v);
          y = py(p.k, v);
          x2 = px(p.k, v - 0.9);
          y2 = py(p.k, v - 0.9);
        } else {
          const u = uMin + (uMax - uMin) * p.t;
          x = px(u, p.k);
          y = py(u, p.k);
          x2 = px(u - 0.9, p.k);
          y2 = py(u - 0.9, p.k);
        }
        if (x < -30 || x > width + 30 || y < -30 || y > height + 30) continue;
        const fade = Math.sin(p.t * Math.PI); // ease in/out at span ends
        // trail
        const grad = ctx.createLinearGradient(x2, y2, x, y);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${0.5 * fade})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x, y);
        ctx.stroke();
        // head
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 7);
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.85 * fade})`);
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
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
