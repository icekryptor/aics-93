"use client";

import { useEffect, useRef } from "react";

/**
 * GenerativeCover — deterministic algorithmic art for blog covers.
 *
 * A seeded flow-field of fine strokes over an accent-tinted dark base. The same
 * `seed` always yields the same image (no flicker); the palette is driven by the
 * post's `accent` colour + the DS spectrum. Drawn once (static), DPR-aware.
 */

type Props = { seed: string; accent: string; className?: string; density?: number };

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function mulberry32(a: number): () => number {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export default function GenerativeCover({ seed, accent, className, density = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const base = hashStr(seed);
    const [ar, ag, ab] = hexToRgb(accent);
    // DS spectrum companions
    const palette: [number, number, number][] = [
      [ar, ag, ab],
      [181, 123, 255], // b57bff
      [201, 182, 255], // c9b6ff
      [239, 234, 255], // near-white sparks
    ];

    // seeded value noise
    const vhash = (ix: number, iy: number) => {
      let h = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263)) ^ base;
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      return ((h >>> 0) % 100000) / 100000;
    };
    const vnoise = (x: number, y: number) => {
      const ix = Math.floor(x),
        iy = Math.floor(y);
      const fx = x - ix,
        fy = y - iy;
      const u = fx * fx * (3 - 2 * fx),
        v = fy * fy * (3 - 2 * fy);
      const a = vhash(ix, iy),
        b = vhash(ix + 1, iy),
        c = vhash(ix, iy + 1),
        d = vhash(ix + 1, iy + 1);
      return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
    };

    let w = 0,
      h = 0;

    const draw = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // base: accent-tinted dark gradient (keeps overlaid chips readable)
      const g = ctx.createRadialGradient(w * 0.78, h * 0.1, 0, w * 0.78, h * 0.1, Math.hypot(w, h));
      g.addColorStop(0, `rgba(${ar},${ag},${ab},1)`);
      g.addColorStop(0.5, `rgb(${Math.round(ar * 0.32 + 24)},${Math.round(ag * 0.26 + 16)},${Math.round(ab * 0.4 + 30)})`);
      g.addColorStop(1, "#171029");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // flow field of fine strokes
      const rng = mulberry32(base ^ 0x51ed);
      const scale = 0.008 + (w > 500 ? 0.001 : 0.003);
      const count = Math.round((w / 3) * density);
      const steps = 26;
      const stepLen = Math.max(2.2, w / 240);
      ctx.lineCap = "round";
      for (let p = 0; p < count; p++) {
        let x = rng() * w;
        let y = rng() * h;
        const ci = rng();
        const col =
          ci > 0.965 ? palette[3] : ci > 0.86 ? palette[1] : ci > 0.7 ? palette[2] : palette[0];
        const bright = ci > 0.965 ? 0.5 : 0.06 + rng() * 0.09;
        ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${bright})`;
        ctx.lineWidth = ci > 0.965 ? 1.4 : 0.8 + rng() * 0.7;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (let s = 0; s < steps; s++) {
          const ang = vnoise(x * scale, y * scale) * Math.PI * 4;
          x += Math.cos(ang) * stepLen;
          y += Math.sin(ang) * stepLen;
          if (x < -20 || x > w + 20 || y < -20 || y > h + 20) break;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // a few bright signal nodes
      const nodeRng = mulberry32(base ^ 0x9a21);
      const nodes = Math.max(3, Math.round(w / 140));
      for (let i = 0; i < nodes; i++) {
        const nx = nodeRng() * w;
        const ny = nodeRng() * h;
        const col = nodeRng() > 0.5 ? palette[0] : palette[1];
        const r = 5 + nodeRng() * 8;
        const rg = ctx.createRadialGradient(nx, ny, 0, nx, ny, r);
        rg.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},0.85)`);
        rg.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    draw();
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => draw());
      ro.observe(wrap);
    }
    return () => ro?.disconnect();
  }, [seed, accent, density]);

  return (
    <div ref={wrapRef} className={className} aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
