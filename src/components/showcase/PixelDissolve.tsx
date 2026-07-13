"use client";

import { useEffect, useRef } from "react";

// PixelDissolve — «pixel disintegration»: сетка квадратов, которые плавно
// появляются/исчезают с разной непрозрачностью. Плотность падает слева
// направо (плотный край → рассыпание, как в рефах). Canvas-2D, seeded PRNG,
// пауза вне вьюпорта/при скрытой вкладке, reduced-motion → статичный кадр.

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// easeInOut для фейдов клеток
const smooth = (x: number) => x * x * (3 - 2 * x);

type Cell = {
  p: number; // вероятность «включённости» (плотность по x)
  from: number;
  to: number;
  start: number; // сек
  dur: number; // сек
};

export default function PixelDissolve({
  className,
  cols = 24,
  rows = 6,
  seed = 0x9331,
  color = "255,255,255",
}: {
  className?: string;
  cols?: number;
  rows?: number;
  seed?: number;
  color?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rng = mulberry32(seed);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 1;
    let H = 1;
    let raf = 0;
    let running = false;
    let intersecting = true;
    let last = 0;
    let t = 0;

    // клетки: плотный левый край → редкий правый + шум
    const cells: Cell[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const p = Math.min(1, Math.max(0.04, 1.2 - (c / cols) * 1.5 + (rng() - 0.5) * 0.55));
        const on = rng() < p;
        cells.push({
          p,
          from: 0,
          to: on ? 0.2 + rng() * 0.8 : 0,
          start: -rng() * 2, // рассинхронизировать старт
          dur: 0.6 + rng() * 1.8,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      const cw = W / cols;
      const ch = H / rows;
      const side = Math.min(cw, ch) * 0.74; // квадрат + «зазор» сетки
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = cells[r * cols + c];
          const prog = Math.min(1, Math.max(0, (t - cell.start) / cell.dur));
          const a = cell.from + (cell.to - cell.from) * smooth(prog);
          if (a < 0.02) continue;
          ctx!.fillStyle = `rgba(${color},${a.toFixed(3)})`;
          ctx!.fillRect(c * cw + (cw - side) / 2, r * ch + (ch - side) / 2, side, side);
        }
      }
    }

    function step(dt: number) {
      t += dt;
      for (const cell of cells) {
        if (t - cell.start >= cell.dur) {
          // новый цикл: цель по плотности, у «включённых» — случайная альфа
          cell.from = cell.to;
          cell.to = rng() < cell.p ? 0.18 + rng() * 0.82 : 0;
          cell.start = t;
          cell.dur = 0.5 + rng() * 2.0;
        }
      }
    }

    function frame(now: number) {
      if (last === 0) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    }
    function sync() {
      if (intersecting && !document.hidden && !reduced) start();
      else stop();
    }

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = wrap!.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // статичный кадр для reduced-motion и до первого rAF
      t = 1;
      draw();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(
      (es) => {
        intersecting = es[0]?.isIntersecting ?? true;
        sync();
      },
      { threshold: 0.05 }
    );
    io.observe(wrap);
    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);

    resize();
    sync();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [cols, rows, seed, color]);

  return (
    <div ref={wrapRef} className={className} aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
