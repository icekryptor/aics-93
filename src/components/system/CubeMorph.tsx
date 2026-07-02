"use client";

import { useEffect, useRef } from "react";

// CubeMorph — 3×3×3 Rubik-style cube that explodes into a data network on click.
// Canvas-2D software renderer, designed for the dark .runtime contact panel.

type Vec3 = { x: number; y: number; z: number };
type RGB = readonly [number, number, number];

const FOV = Math.PI / 3;
const CAM_Z = 6.4;
const HALF = 0.5;
const GRID_STEP = 1.04;

function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
}

const C_VIOLET = hexToRgb("#9747ff");
const C_LIME = hexToRgb("#c5ff44");
const C_CORAL = hexToRgb("#ff7050");
const C_CYAN = hexToRgb("#5ab8ff");
const C_MILD = hexToRgb("#ccbbee");
const C_WHITE = hexToRgb("#efeaff");
const C_ACCENT2 = hexToRgb("#b57bff");
const C_INNER = hexToRgb("#231a3a");

const PULSE_COLS: RGB[] = [C_VIOLET, C_LIME, C_CORAL];

// Directional light in view space, normalized.
const LIGHT: Vec3 = (() => {
  const v = { x: -0.42, y: -0.66, z: -0.62 };
  const l = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  return { x: v.x / l, y: v.y / l, z: v.z / l };
})();

// 8 cubelet corner offsets: bit0 → x, bit1 → y, bit2 → z.
const CORNERS: Vec3[] = Array.from({ length: 8 }, (_, i) => ({
  x: i & 1 ? HALF : -HALF,
  y: i & 2 ? HALF : -HALF,
  z: i & 4 ? HALF : -HALF,
}));

// 6 faces: perimeter corner indices + outward normal.
const FACES: { idx: [number, number, number, number]; n: Vec3 }[] = [
  { idx: [1, 5, 7, 3], n: { x: 1, y: 0, z: 0 } },
  { idx: [0, 2, 6, 4], n: { x: -1, y: 0, z: 0 } },
  { idx: [2, 3, 7, 6], n: { x: 0, y: 1, z: 0 } },
  { idx: [0, 4, 5, 1], n: { x: 0, y: -1, z: 0 } },
  { idx: [4, 6, 7, 5], n: { x: 0, y: 0, z: 1 } },
  { idx: [0, 1, 3, 2], n: { x: 0, y: 0, z: -1 } },
];

// Deterministic PRNG — network layout must be identical on every mount (no Math.random at build/render).
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Cubelet = { cube: Vec3; net: Vec3; faceCols: RGB[]; nodeCol: RGB };

function buildCubelets(): Cubelet[] {
  const rng = mulberry32(0x93cafe);
  const out: Cubelet[] = [];
  for (let gx = -1; gx <= 1; gx++) {
    for (let gy = -1; gy <= 1; gy++) {
      for (let gz = -1; gz <= 1; gz++) {
        // Seeded scattered cloud (slightly flattened sphere shell).
        const u = rng() * 2 - 1;
        const th = rng() * Math.PI * 2;
        const rad = 1.5 + rng() * 1.1;
        const q = Math.sqrt(Math.max(0, 1 - u * u));
        const net: Vec3 = {
          x: Math.cos(th) * q * rad,
          y: Math.sin(th) * q * rad * 0.85,
          z: u * rad,
        };
        // Branded Rubik palette: colour only the faces on the cube surface.
        const faceCols: RGB[] = [
          gx === 1 ? C_LIME : C_INNER,
          gx === -1 ? C_CORAL : C_INNER,
          gy === 1 ? C_CYAN : C_INNER,
          gy === -1 ? C_VIOLET : C_INNER,
          gz === 1 ? C_MILD : C_INNER,
          gz === -1 ? C_WHITE : C_INNER,
        ];
        const outer = faceCols.filter((c) => c !== C_INNER);
        const nodeCol = outer.length > 0 ? outer[Math.floor(rng() * outer.length) % outer.length] : C_ACCENT2;
        out.push({
          cube: { x: gx * GRID_STEP, y: gy * GRID_STEP, z: gz * GRID_STEP },
          net,
          faceCols,
          nodeCol,
        });
      }
    }
  }
  return out;
}

function dist3(a: Vec3, b: Vec3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function buildEdges(cs: Cubelet[]): [number, number][] {
  const edges: [number, number][] = [];
  const deg = new Array<number>(cs.length).fill(0);
  for (let i = 0; i < cs.length; i++) {
    for (let j = i + 1; j < cs.length; j++) {
      if (dist3(cs[i].net, cs[j].net) < 1.45) {
        edges.push([i, j]);
        deg[i] += 1;
        deg[j] += 1;
      }
    }
  }
  // Every node gets at least one link.
  for (let i = 0; i < cs.length; i++) {
    if (deg[i] === 0) {
      let best = -1;
      let bd = Infinity;
      for (let j = 0; j < cs.length; j++) {
        if (j === i) continue;
        const d = dist3(cs[i].net, cs[j].net);
        if (d < bd) {
          bd = d;
          best = j;
        }
      }
      if (best >= 0) {
        edges.push([Math.min(i, best), Math.max(i, best)]);
        deg[i] += 1;
        deg[best] += 1;
      }
    }
  }
  return edges;
}

const CUBELETS = buildCubelets();
const EDGES = buildEdges(CUBELETS);

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function rotYX(p: Vec3, cx: number, sx: number, cy: number, sy: number): Vec3 {
  // Rotate around Y, then X.
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;
  const y2 = p.y * cx - z1 * sx;
  const z2 = p.y * sx + z1 * cx;
  return { x: x1, y: y2, z: z2 };
}

type Pulse = { edge: number; t: number; speed: number; col: RGB };

export default function CubeMorph({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 1;
    let H = 1;
    let raf = 0;
    let running = false;
    let last = 0;
    let t = 0;
    let m = 0; // 0 = cube, 1 = network
    let target = 0;
    let kick = 0; // click scale pulse
    let userRotY = 0;
    let intersecting = true;
    let dragging = false;
    let moved = false;
    let dragLastX = 0;
    let dragAccum = 0;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = mq.matches;

    const pulses: Pulse[] =
      EDGES.length > 0
        ? Array.from({ length: 3 }, (_, i) => ({
            edge: (i * 7) % EDGES.length,
            t: i * 0.33,
            speed: 0.45 + i * 0.14,
            col: PULSE_COLS[i % PULSE_COLS.length],
          }))
        : [];

    function project(p: Vec3): { x: number; y: number; f: number; z: number } {
      const z = Math.max(0.1, p.z + CAM_Z);
      const s = Math.min(W, H);
      const f = s / (z * 2 * Math.tan(FOV / 2));
      return { x: W / 2 + p.x * f, y: H / 2 + p.y * f, f, z };
    }

    function drawScene() {
      ctx!.clearRect(0, 0, W, H);
      const em = easeInOutCubic(Math.min(1, Math.max(0, m)));
      const sysScale = 1 + 0.1 * kick;
      const rotY = (reduced ? 0.62 : t * 0.25 + 0.62) + userRotY;
      const rotX = reduced ? 0.5 : 0.48 + Math.sin(t * 0.5) * 0.05;
      const bob = reduced ? 0 : Math.sin(t * 0.9) * 0.06;
      const cx = Math.cos(rotX);
      const sx = Math.sin(rotX);
      const cy = Math.cos(rotY);
      const sy = Math.sin(rotY);
      const rot = (p: Vec3) => rotYX(p, cx, sx, cy, sy);

      const n = CUBELETS.length;
      const centers: Vec3[] = new Array(n);
      const scr: { x: number; y: number; f: number; z: number }[] = new Array(n);
      for (let i = 0; i < n; i++) {
        const c = CUBELETS[i];
        const p = rot({
          x: (c.cube.x + (c.net.x - c.cube.x) * em) * sysScale,
          y: (c.cube.y + (c.net.y - c.cube.y) * em) * sysScale,
          z: (c.cube.z + (c.net.z - c.cube.z) * em) * sysScale,
        });
        p.y += bob;
        centers[i] = p;
        scr[i] = project(p);
      }

      // --- cube quads (crossfade out as em → 1) ---
      const quadScale = 1 - em;
      if (quadScale > 0.02) {
        const k = quadScale * sysScale;
        const rc = CORNERS.map((o) => rot({ x: o.x * k, y: o.y * k, z: o.z * k }));
        const rn = FACES.map((f) => rot(f.n));
        const quads: { d: number; pts: { x: number; y: number }[]; fill: string }[] = [];
        for (let i = 0; i < n; i++) {
          const c = centers[i];
          for (let fi = 0; fi < 6; fi++) {
            const nrm = rn[fi];
            // Backface cull: face centre in camera space, camera at origin.
            const fcx = c.x + nrm.x * HALF * k;
            const fcy = c.y + nrm.y * HALF * k;
            const fcz = c.z + nrm.z * HALF * k + CAM_Z;
            if (nrm.x * fcx + nrm.y * fcy + nrm.z * fcz >= 0) continue;
            const idx = FACES[fi].idx;
            let depth = 0;
            const pts: { x: number; y: number }[] = [];
            for (let v = 0; v < 4; v++) {
              const o = rc[idx[v]];
              const pr = project({ x: c.x + o.x, y: c.y + o.y, z: c.z + o.z });
              depth += pr.z;
              pts.push({ x: pr.x, y: pr.y });
            }
            const rgb = CUBELETS[i].faceCols[fi];
            const lam = Math.max(0, nrm.x * LIGHT.x + nrm.y * LIGHT.y + nrm.z * LIGHT.z);
            const lk = 0.6 + 0.55 * lam;
            quads.push({
              d: depth / 4,
              pts,
              fill: `rgb(${Math.min(255, rgb[0] * lk) | 0},${Math.min(255, rgb[1] * lk) | 0},${Math.min(255, rgb[2] * lk) | 0})`,
            });
          }
        }
        quads.sort((a, b) => b.d - a.d); // painter: far → near
        ctx!.lineJoin = "round";
        ctx!.strokeStyle = "#0e0a1b";
        ctx!.lineWidth = Math.max(1, Math.min(W, H) / 340);
        for (const q of quads) {
          ctx!.fillStyle = q.fill;
          ctx!.beginPath();
          ctx!.moveTo(q.pts[0].x, q.pts[0].y);
          ctx!.lineTo(q.pts[1].x, q.pts[1].y);
          ctx!.lineTo(q.pts[2].x, q.pts[2].y);
          ctx!.lineTo(q.pts[3].x, q.pts[3].y);
          ctx!.closePath();
          ctx!.fill();
          ctx!.stroke();
        }
      }

      // --- network edges ---
      if (em > 0.04) {
        ctx!.lineWidth = 1;
        ctx!.strokeStyle = `rgba(181,123,255,${(0.42 * em).toFixed(3)})`;
        ctx!.beginPath();
        for (const [a, b] of EDGES) {
          ctx!.moveTo(scr[a].x, scr[a].y);
          ctx!.lineTo(scr[b].x, scr[b].y);
        }
        ctx!.stroke();
      }

      // --- glowing nodes (crossfade in) ---
      if (em > 0.02) {
        const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => scr[b].z - scr[a].z);
        for (const i of order) {
          const p = scr[i];
          const col = CUBELETS[i].nodeCol;
          const r = (0.13 + 0.09 * em) * p.f;
          const glowR = r * 2.8;
          const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
          g.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${(0.85 * em).toFixed(3)})`);
          g.addColorStop(0.4, `rgba(${col[0]},${col[1]},${col[2]},${(0.35 * em).toFixed(3)})`);
          g.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
          ctx!.fillStyle = g;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, glowR, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.fillStyle = `rgba(${Math.min(255, col[0] * 1.25) | 0},${Math.min(255, col[1] * 1.25) | 0},${Math.min(255, col[2] * 1.25) | 0},${em.toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      // --- data pulses travelling along edges ---
      if (!reduced && em > 0.6 && EDGES.length > 0) {
        const pa = (em - 0.6) / 0.4;
        for (const pu of pulses) {
          const [a, b] = EDGES[pu.edge];
          const A = scr[a];
          const B = scr[b];
          const x = A.x + (B.x - A.x) * pu.t;
          const y = A.y + (B.y - A.y) * pu.t;
          const col = pu.col;
          const g = ctx!.createRadialGradient(x, y, 0, x, y, 8);
          g.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${pa.toFixed(3)})`);
          g.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
          ctx!.fillStyle = g;
          ctx!.beginPath();
          ctx!.arc(x, y, 8, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.fillStyle = `rgba(255,255,255,${(0.9 * pa).toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    function frame(now: number) {
      if (last === 0) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      m += (target - m) * 0.08;
      kick *= 0.9;
      if (m > 0.5 && EDGES.length > 0) {
        for (const p of pulses) {
          p.t += p.speed * dt;
          if (p.t >= 1) {
            p.t = 0;
            p.edge = Math.floor(Math.random() * EDGES.length);
            p.speed = 0.35 + Math.random() * 0.5;
            p.col = PULSE_COLS[Math.floor(Math.random() * PULSE_COLS.length)];
          }
        }
      }
      drawScene();
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
      const active = intersecting && !document.hidden && !reduced;
      if (active) {
        start();
      } else {
        stop();
        if (reduced) {
          m = target;
          kick = 0;
          drawScene();
        }
      }
    }

    function toggle() {
      target = target === 0 ? 1 : 0;
      kick = 1;
      if (reduced || !running) {
        // Static fallback: jump between the two static frames.
        m = target;
        kick = 0;
        drawScene();
      }
    }

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = wrap!.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) drawScene();
    }

    // --- component-local interaction (no window listeners) ---
    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      moved = false;
      dragAccum = 0;
      dragLastX = e.clientX;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // pointer capture unavailable — drag still works via move events
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragLastX;
      dragLastX = e.clientX;
      dragAccum += Math.abs(dx);
      if (dragAccum > 6) moved = true;
      userRotY += dx * 0.006;
      if (!running) drawScene();
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // already released
      }
    };
    const onClick = () => {
      if (moved) {
        moved = false;
        return;
      }
      toggle();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        toggle();
      }
    };
    const onVis = () => sync();
    const onMq = () => {
      reduced = mq.matches;
      sync();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVis);
    mq.addEventListener("change", onMq);

    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);

    const io = new IntersectionObserver(
      (entries) => {
        intersecting = entries[0]?.isIntersecting ?? true;
        sync();
      },
      { threshold: 0.05 }
    );
    io.observe(wrap);

    resize();
    sync();
    if (reduced) drawScene();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVis);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative h-full w-full ${className ?? ""}`}>
      <canvas
        ref={canvasRef}
        role="button"
        tabIndex={0}
        aria-label="переключить куб/сеть"
        title="клик — переключить"
        className="block h-full w-full min-h-[44px] min-w-[44px] cursor-pointer touch-none select-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#9747ff]"
      />
    </div>
  );
}
