"use client";

import { useEffect, useRef } from "react";

/**
 * AlgoArt — a living algorithmic "signal constellation": a seeded node network
 * with edges and pulses of light propagating along them. Reads as neural /
 * circuitry — the AICS-93 signature. Decorative (aria-hidden).
 *
 * Performance: DPR-capped, rAF paused when offscreen or tab hidden, static
 * frame under prefers-reduced-motion. Rebuilds on resize.
 */

type Props = { className?: string; seed?: string; density?: number };

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

type Node = { x: number; y: number; phase: number; r: number; adj: number[] };
type Edge = [number, number];
type Pulse = { from: number; to: number; t: number; speed: number; col: number };

export default function AlgoArt({ className, seed = "aics", density = 1 }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rng = mulberry32(hashStr(seed));
    const palette: [number, number, number][] = [
      [151, 71, 255], // signal
      [181, 123, 255], // signal-2
      [201, 182, 255], // signal-cool
    ];

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let pulses: Pulse[] = [];

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // jittered grid → even coverage, organic feel. Node count clamped for perf.
      const target = Math.min(96, Math.max(18, Math.round(((w * h) / 15000) * density)));
      const cols = Math.max(3, Math.round(Math.sqrt(target * (w / Math.max(1, h)))));
      const rows = Math.max(3, Math.round(target / cols));
      nodes = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const gx = (c + 0.5) / cols;
          const gy = (r + 0.5) / rows;
          const jx = ((rng() - 0.5) * 0.95) / cols;
          const jy = ((rng() - 0.5) * 0.95) / rows;
          nodes.push({
            x: (gx + jx) * w,
            y: (gy + jy) * h,
            phase: rng() * Math.PI * 2,
            r: 1 + rng() * 1.6,
            adj: [],
          });
        }
      }

      // proximity edges → each node linked to its ~3 nearest within a radius
      edges = [];
      const maxD = Math.hypot(w / cols, h / rows) * 1.75;
      for (let i = 0; i < nodes.length; i++) {
        const near: [number, number][] = [];
        for (let j = 0; j < nodes.length; j++) {
          if (j === i) continue;
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < maxD) near.push([d, j]);
        }
        near.sort((a, b) => a[0] - b[0]);
        const k = Math.min(3, near.length);
        for (let n = 0; n < k; n++) {
          const j = near[n][1];
          if (i < j) {
            edges.push([i, j]);
          }
          if (!nodes[i].adj.includes(j)) nodes[i].adj.push(j);
          if (!nodes[j].adj.includes(i)) nodes[j].adj.push(i);
        }
      }
      pulses = [];
    };

    const spawnPulse = () => {
      if (!edges.length) return;
      const [a, b] = edges[(Math.random() * edges.length) | 0];
      const forward = Math.random() < 0.5;
      pulses.push({
        from: forward ? a : b,
        to: forward ? b : a,
        t: 0,
        speed: 0.5 + Math.random() * 0.7,
        col: (Math.random() * palette.length) | 0,
      });
    };

    let raf = 0;
    let running = false;
    let t0 = 0;
    let last = 0;
    let acc = 0;

    const draw = (time: number) => {
      if (!t0) t0 = time;
      const dt = Math.min(0.05, (time - last) / 1000 || 0);
      last = time;
      const elapsed = (time - t0) / 1000;

      ctx.clearRect(0, 0, w, h);

      // edges — faint violet lattice
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(151,71,255,0.10)";
      ctx.beginPath();
      for (const [a, b] of edges) {
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
      }
      ctx.stroke();

      // nodes — twinkling dots
      for (const n of nodes) {
        const tw = reduce ? 0.6 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(elapsed * 1.4 + n.phase));
        ctx.fillStyle = `rgba(181,123,255,${(0.28 * tw).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // pulses — light travelling along edges, occasionally propagating onward
      if (!reduce) {
        acc += dt;
        if (acc > 0.16 && pulses.length < Math.min(26, edges.length)) {
          acc = 0;
          spawnPulse();
        }
        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i];
          p.t += dt * p.speed;
          const na = nodes[p.from];
          const nb = nodes[p.to];
          const tt = Math.min(1, p.t);
          const x = na.x + (nb.x - na.x) * tt;
          const y = na.y + (nb.y - na.y) * tt;
          const [cr, cg, cb] = palette[p.col];
          const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
          g.addColorStop(0, `rgba(${cr},${cg},${cb},0.9)`);
          g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, 9, 0, Math.PI * 2);
          ctx.fill();

          if (p.t >= 1) {
            // propagate onward from the arrival node (prefer not to backtrack)
            const adj = nodes[p.to].adj;
            const onward = adj.filter((j) => j !== p.from);
            const pool = onward.length ? onward : adj;
            if (Math.random() < 0.6 && pool.length) {
              p.from = p.to;
              p.to = pool[(Math.random() * pool.length) | 0];
              p.t = 0;
              p.col = (Math.random() * palette.length) | 0;
            } else {
              pulses.splice(i, 1);
            }
          }
        }
      }

      if (running) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      // reset temporal baseline so resume after a pause doesn't jump the phase
      t0 = 0;
      last = 0;
      if (reduce) {
        // one static frame
        draw(performance.now());
        running = false;
        return;
      }
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    };

    // debounced rebuild — coalesces bursts of resize events (rotate, pinch,
    // soft-keyboard) and picks up devicePixelRatio changes when the window
    // moves between displays (which a ResizeObserver alone won't catch).
    let rebuildTimer = 0;
    const scheduleRebuild = () => {
      window.clearTimeout(rebuildTimer);
      rebuildTimer = window.setTimeout(() => {
        build();
        if (reduce) draw(performance.now());
      }, 140);
    };

    build();
    start();

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", scheduleRebuild);

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([e]) => (e.isIntersecting ? start() : stop()),
        { threshold: 0 },
      );
      io.observe(wrap);
    }

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(scheduleRebuild);
      ro.observe(wrap);
    }

    return () => {
      stop();
      window.clearTimeout(rebuildTimer);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", scheduleRebuild);
      io?.disconnect();
      ro?.disconnect();
    };
  }, [seed, density]);

  return (
    <div ref={wrapRef} className={className} aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
