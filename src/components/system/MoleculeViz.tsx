"use client";

import { useEffect, useRef } from "react";

/**
 * MoleculeViz
 * A canvas-2D "ball-and-stick" branching polymer standing in for
 * "brand & creativity" — an abstract 3D form over the LIGHT section bg.
 *
 * - Deterministic branching chain of ~26-40 atoms (seeded hash, no Math.random).
 * - Slow Y rotation, simple perspective projection, depth sort/scale/alpha.
 * - Polymerizes on scroll into view (own IntersectionObserver + scroll progress).
 * - Atoms lean toward cursor on fine pointers; occasional violet signal on a bond.
 * - DPR-aware, ResizeObserver, pause on hidden + offscreen, reduced-motion static.
 *
 * SSR-safe: all window/document access is inside effects. Decorative + aria-hidden.
 */

type Atom = {
  bx: number;
  by: number;
  bz: number;
  ox: number;
  oy: number;
  order: number;
  branch: boolean;
};

type Bond = {
  a: number;
  b: number;
  order: number;
};

const INK = "22,18,29";
const SIGNAL = "139,103,255";
const SIGNAL2 = "200,86,255";

// deterministic hash → [0,1). Pure, safe to call at effect time (not render).
function hash01(n: number): number {
  let h = (n | 0) ^ 0x9e3779b9;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h ^= h >>> 16;
  return ((h >>> 0) % 100000) / 100000;
}

export default function MoleculeViz({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Non-null local aliases (avoid `!` noise; both are guaranteed above).
    const cnv = canvas;
    const c = ctx;

    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseMQ = window.matchMedia("(pointer: coarse)");

    let dpr = Math.min(2, window.devicePixelRatio || 1);
    let width = 0;
    let height = 0;

    let atoms: Atom[] = [];
    let bonds: Bond[] = [];
    let radius = 1;

    let progress = 0;
    let visible = false;

    let signalBond = -1;
    let signalT = 0;
    let signalTimer = 2;

    const pointer = { x: 0, y: 0, active: false };
    let pendingPointer: { x: number; y: number } | null = null;
    let pointerRaf = 0;

    let rafId = 0;
    let lastTs = 0;
    let running = false;
    let t0 = 0;
    let moCache = 0;

    const isColorMode = () =>
      document.documentElement.classList.contains("color-mode");

    function buildMolecule() {
      atoms = [];
      bonds = [];

      const backboneLen = 20 + Math.floor(hash01(7) * 5); // 20..24
      let px = -(backboneLen - 1) * 0.5;
      let py = 0;
      let pz = 0;
      let ordCounter = 0;

      const backboneIdx: number[] = [];
      for (let i = 0; i < backboneLen; i++) {
        if (i > 0) {
          const a1 = (hash01(i * 3 + 1) - 0.5) * 0.9;
          const a2 = (hash01(i * 3 + 2) - 0.5) * 1.4;
          px += 1;
          py += Math.sin(i * 0.9) * 0.42 + a1 * 0.5;
          pz += Math.cos(i * 0.7) * 0.5 + a2 * 0.5;
        }
        const idx = atoms.length;
        atoms.push({
          bx: px,
          by: py,
          bz: pz,
          ox: 0,
          oy: 0,
          order: ordCounter++,
          branch: false,
        });
        backboneIdx.push(idx);
        if (i > 0) {
          bonds.push({
            a: backboneIdx[i - 1],
            b: idx,
            order: atoms[idx].order,
          });
        }
      }

      const branchCount = 8 + Math.floor(hash01(99) * 5); // 8..12
      for (let b = 0; b < branchCount; b++) {
        const host = 1 + Math.floor(hash01(b * 5 + 11) * (backboneLen - 2));
        const hostIdx = backboneIdx[host];
        const h = atoms[hostIdx];
        const dir = hash01(b * 5 + 12) < 0.5 ? 1 : -1;
        const ang = hash01(b * 5 + 13) * Math.PI * 2;
        const zang = (hash01(b * 5 + 14) - 0.5) * 1.6;
        const bx = h.bx + Math.cos(ang) * 0.35 * dir;
        const by = h.by + Math.sin(ang) * 1.05 * dir;
        const bz = h.bz + zang * 1.0;
        const idx = atoms.length;
        const ord = h.order + 0.5;
        atoms.push({ bx, by, bz, ox: 0, oy: 0, order: ord, branch: true });
        bonds.push({ a: hostIdx, b: idx, order: ord });
      }

      let maxR = 0.001;
      for (const a of atoms) {
        const r = Math.hypot(a.bx, a.by, a.bz);
        if (r > maxR) maxR = r;
      }
      radius = maxR;

      // cache max reveal order
      let m = 0;
      for (const a of atoms) if (a.order > m) m = a.order;
      moCache = m;

      signalBond = -1;
      signalT = 0;
      signalTimer = 1.2;
    }

    function project(
      wx: number,
      wy: number,
      wz: number,
      cx: number,
      cy: number,
      fit: number
    ): [number, number, number, number] {
      const camZ = radius * 3.2;
      const denom = camZ - wz;
      const persp = denom !== 0 ? camZ / denom : 1;
      const sx = cx + wx * fit * persp;
      const sy = cy + wy * fit * persp;
      const depthAlpha = 0.55 + 0.45 * ((wz / radius + 1) * 0.5);
      return [sx, sy, persp, Math.max(0.35, Math.min(1, depthAlpha))];
    }

    function rotate(a: Atom, cosY: number, sinY: number, tilt: number) {
      const rx = a.bx * cosY + a.bz * sinY;
      const rz = -a.bx * sinY + a.bz * cosY;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      const ry = a.by * ct - rz * st;
      const rz2 = a.by * st + rz * ct;
      return { x: rx, y: ry, z: rz2 };
    }

    function draw(dt: number) {
      const colorMode = isColorMode();
      c.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const fit = (Math.min(width, height) * 0.5) / (radius * 1.35 || 1);

      const angY = reduceMQ.matches ? 0.5 : t0 * 0.28;
      const cosY = Math.cos(angY);
      const sinY = Math.sin(angY);
      const tilt = -0.32;

      const mo = moCache;
      const revealUpTo = reduceMQ.matches
        ? mo + 1
        : (visible ? progress : 0) * (mo + 1);

      const fine = !coarseMQ.matches && !reduceMQ.matches;

      type P = {
        i: number;
        sx: number;
        sy: number;
        scale: number;
        alpha: number;
        z: number;
        shown: number;
      };
      const pts: P[] = [];
      for (let i = 0; i < atoms.length; i++) {
        const a = atoms[i];
        const r = rotate(a, cosY, sinY, tilt);
        let [sx, sy] = project(r.x, r.y, r.z, cx, cy, fit);
        const proj = project(r.x, r.y, r.z, cx, cy, fit);
        const scale = proj[2];
        const dAlpha = proj[3];

        if (fine) {
          if (pointer.active) {
            const dx = pointer.x - sx;
            const dy = pointer.y - sy;
            const dist = Math.hypot(dx, dy);
            const pr = Math.min(width, height) * 0.5;
            if (dist < pr && dist > 0.001) {
              const force = (1 - dist / pr) * 8;
              a.ox += (dx / dist) * force * dt;
              a.oy += (dy / dist) * force * dt;
            }
          }
          a.ox += (0 - a.ox) * Math.min(1, dt * 3);
          a.oy += (0 - a.oy) * Math.min(1, dt * 3);
          sx += a.ox;
          sy += a.oy;
        }

        let shown: number;
        if (a.order <= 0) shown = 1;
        else shown = Math.max(0, Math.min(1, revealUpTo - a.order));

        pts.push({ i, sx, sy, scale, alpha: dAlpha, z: r.z, shown });
      }

      const bondDraw = bonds
        .map((bo) => {
          const pa = pts[bo.a];
          const pb = pts[bo.b];
          const zAvg = (pa.z + pb.z) * 0.5;
          const revealAlpha = reduceMQ.matches
            ? 1
            : Math.max(0, Math.min(1, revealUpTo - bo.order));
          return { bo, pa, pb, zAvg, revealAlpha };
        })
        .filter((e) => e.revealAlpha > 0.02)
        .sort((a, b) => a.zAvg - b.zAvg);

      c.lineCap = "round";
      for (const e of bondDraw) {
        const { pa, pb, revealAlpha } = e;
        const dAlpha = (pa.alpha + pb.alpha) * 0.5;
        const lw = 1.4 * ((pa.scale + pb.scale) * 0.5);
        c.lineWidth = Math.max(0.8, lw);
        c.beginPath();
        c.moveTo(pa.sx, pa.sy);
        c.lineTo(pb.sx, pb.sy);
        c.strokeStyle = `rgba(${INK},${0.32 * dAlpha * revealAlpha})`;
        c.stroke();
        c.lineWidth = Math.max(0.5, lw * 0.5);
        c.strokeStyle = `rgba(${SIGNAL},${
          (colorMode ? 0.45 : 0.3) * dAlpha * revealAlpha
        })`;
        c.stroke();
      }

      if (!reduceMQ.matches && signalBond >= 0 && signalBond < bonds.length) {
        const bo = bonds[signalBond];
        const pa = pts[bo.a];
        const pb = pts[bo.b];
        const rev = Math.max(0, Math.min(1, revealUpTo - bo.order));
        if (rev > 0.5) {
          const gx = pa.sx + (pb.sx - pa.sx) * signalT;
          const gy = pa.sy + (pb.sy - pa.sy) * signalT;
          const glowR = Math.max(1, 9 * ((pa.scale + pb.scale) * 0.5));
          const g = c.createRadialGradient(gx, gy, 0, gx, gy, glowR);
          g.addColorStop(0, `rgba(${SIGNAL2},${colorMode ? 0.95 : 0.85})`);
          g.addColorStop(1, `rgba(${SIGNAL2},0)`);
          c.fillStyle = g;
          c.beginPath();
          c.arc(gx, gy, glowR, 0, Math.PI * 2);
          c.fill();
          c.beginPath();
          c.arc(gx, gy, Math.max(1.2, 2 * pa.scale), 0, Math.PI * 2);
          c.fillStyle = "rgba(255,255,255,0.95)";
          c.fill();
        }
      }

      const order = pts
        .filter((p) => p.shown > 0.02)
        .sort((a, b) => a.z - b.z);

      for (const p of order) {
        const a = atoms[p.i];
        const baseR = (a.branch ? 5.5 : 8) * p.scale;
        const rr = Math.max(1.5, baseR) * (0.6 + 0.4 * p.shown);
        const alpha = p.alpha * p.shown;
        const accent = a.order <= 0;

        const glow = c.createRadialGradient(
          p.sx,
          p.sy,
          rr * 0.2,
          p.sx,
          p.sy,
          rr * 2.1
        );
        glow.addColorStop(
          0,
          `rgba(${accent ? SIGNAL2 : SIGNAL},${
            (accent ? 0.4 : 0.22) * alpha * (colorMode ? 1.3 : 1)
          })`
        );
        glow.addColorStop(1, `rgba(${SIGNAL},0)`);
        c.fillStyle = glow;
        c.beginPath();
        c.arc(p.sx, p.sy, rr * 2.1, 0, Math.PI * 2);
        c.fill();

        const body = c.createRadialGradient(
          p.sx - rr * 0.35,
          p.sy - rr * 0.35,
          rr * 0.1,
          p.sx,
          p.sy,
          rr
        );
        body.addColorStop(0, `rgba(255,255,255,${0.95 * alpha})`);
        body.addColorStop(0.6, `rgba(240,238,246,${0.9 * alpha})`);
        body.addColorStop(1, `rgba(${INK},${0.14 * alpha})`);
        c.fillStyle = body;
        c.beginPath();
        c.arc(p.sx, p.sy, rr, 0, Math.PI * 2);
        c.fill();

        c.lineWidth = Math.max(0.6, 1.1 * p.scale);
        c.strokeStyle = `rgba(${accent ? SIGNAL2 : SIGNAL},${
          (accent ? 0.85 : 0.55) * alpha * (colorMode ? 1.2 : 1)
        })`;
        c.beginPath();
        c.arc(p.sx, p.sy, rr, 0, Math.PI * 2);
        c.stroke();

        c.beginPath();
        c.arc(p.sx - rr * 0.32, p.sy - rr * 0.32, rr * 0.22, 0, Math.PI * 2);
        c.fillStyle = `rgba(255,255,255,${0.8 * alpha})`;
        c.fill();
      }
    }

    function updateProgress() {
      const rect = cnv.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const start = vh * 0.95;
      const end = vh * 0.25;
      const span = start - end || 1;
      const raw = (start - rect.top) / span;
      progress = Math.max(0, Math.min(1, raw));
    }

    function step(ts: number) {
      if (!running) return;
      const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0);
      lastTs = ts;
      t0 += dt;

      if (!reduceMQ.matches) {
        signalTimer -= dt;
        if (signalBond < 0 && signalTimer <= 0) {
          const mo = moCache;
          const revealUpTo = (visible ? progress : 0) * (mo + 1);
          const candidates: number[] = [];
          for (let i = 0; i < bonds.length; i++) {
            if (revealUpTo - bonds[i].order > 0.6) candidates.push(i);
          }
          if (candidates.length > 0) {
            const pick =
              candidates[
                Math.floor(hash01(Math.floor(t0 * 1000)) * candidates.length) %
                  candidates.length
              ];
            signalBond = pick;
            signalT = 0;
          } else {
            signalTimer = 0.5;
          }
        } else if (signalBond >= 0) {
          signalT += dt * 1.6;
          if (signalT >= 1) {
            signalBond = -1;
            signalTimer = 1.5 + hash01(Math.floor(t0 * 97)) * 2.5;
          }
        }
      }

      draw(dt);
      rafId = requestAnimationFrame(step);
    }

    function start() {
      if (running) return;
      if (reduceMQ.matches) {
        progress = 1;
        visible = true;
        draw(0);
        return;
      }
      running = true;
      lastTs = performance.now();
      rafId = requestAnimationFrame(step);
    }

    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }

    function resize() {
      const rect = cnv.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = w;
      height = h;
      cnv.width = Math.round(w * dpr);
      cnv.height = Math.round(h * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduceMQ.matches) {
        progress = 1;
        visible = true;
        draw(0);
      } else if (!running) {
        updateProgress();
        draw(0);
      }
    }

    const applyPointer = () => {
      pointerRaf = 0;
      if (pendingPointer) {
        const rect = cnv.getBoundingClientRect();
        pointer.x = pendingPointer.x - rect.left;
        pointer.y = pendingPointer.y - rect.top;
        pointer.active = true;
        pendingPointer = null;
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (coarseMQ.matches || reduceMQ.matches) return;
      pendingPointer = { x: e.clientX, y: e.clientY };
      if (!pointerRaf) pointerRaf = requestAnimationFrame(applyPointer);
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onScroll = () => {
      updateProgress();
      if (!running && !reduceMQ.matches) draw(0);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible && !reduceMQ.matches) start();
    };

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          const vis = entries.some((en) => en.isIntersecting);
          visible = vis;
          if (!vis) {
            stop();
          } else if (!document.hidden) {
            updateProgress();
            start();
          }
        },
        { threshold: 0 }
      );
      io.observe(cnv);
    } else {
      visible = true;
    }

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => resize());
      ro.observe(cnv);
    } else {
      window.addEventListener("resize", resize);
    }

    const onReduceChange = () => {
      stop();
      buildMolecule();
      resize();
      if (reduceMQ.matches) {
        progress = 1;
        visible = true;
        draw(0);
      } else if (visible && !document.hidden) {
        start();
      }
    };
    const addMQListener = (mq: MediaQueryList, fn: () => void) => {
      if (mq.addEventListener) mq.addEventListener("change", fn);
      else mq.addListener(fn);
    };
    const removeMQListener = (mq: MediaQueryList, fn: () => void) => {
      if (mq.removeEventListener) mq.removeEventListener("change", fn);
      else mq.removeListener(fn);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    addMQListener(reduceMQ, onReduceChange);

    buildMolecule();
    resize();
    updateProgress();
    if (reduceMQ.matches) {
      progress = 1;
      visible = true;
      draw(0);
    }

    return () => {
      stop();
      if (pointerRaf) cancelAnimationFrame(pointerRaf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      removeMQListener(reduceMQ, onReduceChange);
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", resize);
      if (io) io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        background: "transparent",
      }}
    />
  );
}
