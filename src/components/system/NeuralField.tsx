"use client";

import { useEffect, useRef } from "react";

/**
 * NeuralField
 * A fixed, full-viewport canvas-2D "circuitry / neural field" background layer.
 * Draws a faint violet PCB / neuron field over the light page, sends idle signal
 * pulses along edges, and reacts to fine-pointer cursor movement.
 *
 * SSR-safe: all window/document access is inside effects. Decorative + aria-hidden.
 */

type NodeT = {
  x: number; // base position (css px)
  y: number;
  ox: number; // current offset (repel), decays toward 0
  oy: number;
  bright: number; // 0..1 transient brightness (decays)
  accent: boolean; // brighter accent node
};

type EdgeT = {
  a: number; // node index
  b: number; // node index
  elbow: boolean; // right-angle PCB elbow vs straight
  hx: number; // elbow corner (in base coords)
  hy: number;
};

type PulseT = {
  chain: number[]; // sequence of node indices
  seg: number; // current segment index (chain[seg] -> chain[seg+1])
  t: number; // 0..1 progress along current segment
  speed: number; // segments per second-ish
  life: number; // remaining segments budget
};

const SIGNAL = "139,103,255"; // --color-signal rgb
const SIGNAL2 = "200,86,255"; // --color-signal-2 rgb
const MONO = "92,88,110"; // graphite ambient when colour-mode is OFF
const MONO2 = "120,114,140";
// ambient node/trace colour follows the mono↔colour toggle
const cSig = (colorMode: boolean) => (colorMode ? SIGNAL : MONO);
const cSig2 = (colorMode: boolean) => (colorMode ? SIGNAL2 : MONO2);

export default function NeuralField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseMQ = window.matchMedia("(pointer: coarse)");

    let dpr = Math.min(2, window.devicePixelRatio || 1);
    let width = 0; // css px
    let height = 0;

    let nodes: NodeT[] = [];
    let edges: EdgeT[] = [];
    // adjacency for pulse routing
    let adj: number[][] = [];

    let pulses: PulseT[] = [];

    // pointer state (css px), fine pointers only
    const pointer = { x: -9999, y: -9999, active: false };
    let pendingPointer: { x: number; y: number } | null = null;
    let pointerRaf = 0;

    let rafId = 0;
    let lastTs = 0;
    let pulseTimer = 0;
    let running = false;
    let roPrimed = false; // guard first ResizeObserver callback (avoid double build)

    // deterministic-ish PRNG seeded per mount (fine to call during effect, not render)
    let seed = 0x9e3779b9;
    const rand = () => {
      // xorshift32
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      // to [0,1)
      return ((seed >>> 0) % 100000) / 100000;
    };

    const isColorMode = () =>
      document.documentElement.classList.contains("color-mode");

    function buildField() {
      nodes = [];
      edges = [];
      adj = [];
      pulses = [];

      // scale node count to viewport area, capped 60..90
      const area = width * height;
      const target = Math.round(area / 21000);
      const count = Math.max(60, Math.min(90, target));

      // loose grid with jitter
      const cols = Math.max(
        4,
        Math.round(Math.sqrt(count * (width / Math.max(1, height))))
      );
      const rows = Math.max(4, Math.ceil(count / cols));
      const cellW = width / cols;
      const cellH = height / rows;

      const grid: number[][] = []; // [nodeIndexOrMinus1, r, c] per (r*cols+c)
      let idx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (idx >= count) {
            grid.push([-1, r, c]);
            continue;
          }
          const jitterX = (rand() - 0.5) * cellW * 0.7;
          const jitterY = (rand() - 0.5) * cellH * 0.7;
          const x = c * cellW + cellW * 0.5 + jitterX;
          const y = r * cellH + cellH * 0.5 + jitterY;
          nodes.push({
            x,
            y,
            ox: 0,
            oy: 0,
            bright: 0,
            accent: rand() < 0.12,
          });
          grid.push([idx, r, c]);
          idx++;
        }
      }

      adj = nodes.map(() => []);

      const nodeAt = (r: number, c: number): number => {
        if (r < 0 || c < 0 || r >= rows || c >= cols) return -1;
        return grid[r * cols + c][0];
      };

      const addEdge = (a: number, b: number) => {
        if (a < 0 || b < 0 || a === b) return;
        // avoid dupes
        for (const e of edges) {
          if ((e.a === a && e.b === b) || (e.a === b && e.b === a)) return;
        }
        const na = nodes[a];
        const nb = nodes[b];
        const elbow = rand() < 0.5;
        // elbow corner: L-shape via one axis then the other
        const hx = rand() < 0.5 ? na.x : nb.x;
        const hy = hx === na.x ? nb.y : na.y;
        edges.push({ a, b, elbow, hx, hy });
        adj[a].push(b);
        adj[b].push(a);
      };

      // connect near neighbours (right, down, and some diagonals)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const self = nodeAt(r, c);
          if (self < 0) continue;
          const right = nodeAt(r, c + 1);
          const down = nodeAt(r + 1, c);
          const diag = nodeAt(r + 1, c + 1);
          if (right >= 0 && rand() < 0.85) addEdge(self, right);
          if (down >= 0 && rand() < 0.85) addEdge(self, down);
          if (diag >= 0 && rand() < 0.25) addEdge(self, diag);
        }
      }

      // ensure no fully isolated node: link to nearest neighbour if orphaned
      for (let i = 0; i < nodes.length; i++) {
        if (adj[i].length === 0) {
          let best = -1;
          let bestD = Infinity;
          for (let j = 0; j < nodes.length; j++) {
            if (j === i) continue;
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const d = dx * dx + dy * dy;
            if (d < bestD) {
              bestD = d;
              best = j;
            }
          }
          if (best >= 0) addEdge(i, best);
        }
      }
    }

    function spawnPulse() {
      if (nodes.length === 0) return;
      if (pulses.length >= 4) return;
      // pick a start node with neighbours
      let start = -1;
      for (let tries = 0; tries < 8; tries++) {
        const cand = Math.floor(rand() * nodes.length);
        if (adj[cand] && adj[cand].length > 0) {
          start = cand;
          break;
        }
      }
      if (start < 0) return;

      const len = 4 + Math.floor(rand() * 6); // 4..9 hops
      const chain: number[] = [start];
      let prev = -1;
      let cur = start;
      for (let i = 0; i < len; i++) {
        const nbrs = adj[cur];
        if (!nbrs || nbrs.length === 0) break;
        // avoid immediately going back when possible
        let next = nbrs[Math.floor(rand() * nbrs.length)];
        if (nbrs.length > 1 && next === prev) {
          next = nbrs[Math.floor(rand() * nbrs.length)];
        }
        chain.push(next);
        prev = cur;
        cur = next;
      }
      if (chain.length < 2) return;
      pulses.push({
        chain,
        seg: 0,
        t: 0,
        speed: 1.6 + rand() * 1.4,
        life: chain.length - 1,
      });
    }

    function nodePos(n: NodeT): [number, number] {
      return [n.x + n.ox, n.y + n.oy];
    }

    function drawEdge(e: EdgeT, alpha: number, colorMode: boolean) {
      const na = nodes[e.a];
      const nb = nodes[e.b];
      const [ax, ay] = nodePos(na);
      const [bx, by] = nodePos(nb);
      ctx!.beginPath();
      ctx!.moveTo(ax, ay);
      if (e.elbow) {
        // use base elbow but shift by average offset for stability
        const cx = e.hx + (na.ox + nb.ox) * 0.5;
        const cy = e.hy + (na.oy + nb.oy) * 0.5;
        ctx!.lineTo(cx, ay);
        ctx!.lineTo(cx, cy);
        ctx!.lineTo(bx, cy);
        ctx!.lineTo(bx, by);
      } else {
        ctx!.lineTo(bx, by);
      }
      ctx!.strokeStyle = `rgba(${cSig(colorMode)},${alpha * (colorMode ? 1.35 : 1)})`;
      ctx!.stroke();
    }

    function drawNode(n: NodeT, colorMode: boolean) {
      const [x, y] = nodePos(n);
      const base = n.accent ? 0.34 : 0.18;
      const a = Math.min(0.95, (base + n.bright * 0.75) * (colorMode ? 1.3 : 1));
      const r = (n.accent ? 2.4 : 1.7) + n.bright * 2.2;
      const sig = cSig(colorMode);
      const sig2 = cSig2(colorMode);
      // glow for bright/accent nodes
      if (n.bright > 0.05 || n.accent) {
        const g = ctx!.createRadialGradient(x, y, 0, x, y, r * 3.5);
        g.addColorStop(0, `rgba(${n.accent ? sig2 : sig},${a * 0.6})`);
        g.addColorStop(1, `rgba(${sig},0)`);
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(x, y, r * 3.5, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.beginPath();
      ctx!.arc(x, y, r, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${n.accent ? sig2 : sig},${a})`;
      ctx!.fill();
    }

    function pointToSeg(
      chain: number[],
      seg: number,
      t: number
    ): [number, number] {
      const a = nodes[chain[seg]];
      const b = nodes[chain[seg + 1]];
      const [ax, ay] = nodePos(a);
      const [bx, by] = nodePos(b);
      return [ax + (bx - ax) * t, ay + (by - ay) * t];
    }

    function drawStatic(colorMode: boolean) {
      ctx!.clearRect(0, 0, width, height);
      ctx!.lineWidth = 1;
      for (const e of edges) drawEdge(e, 0.1, colorMode);
      for (const n of nodes) drawNode(n, colorMode);
    }

    function step(ts: number) {
      if (!running) return;
      const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0);
      lastTs = ts;
      const colorMode = isColorMode();

      ctx!.clearRect(0, 0, width, height);
      ctx!.lineWidth = 1;

      // decay offsets & brightness
      const fine = !coarseMQ.matches;
      const pr = 130; // pointer influence radius
      for (const n of nodes) {
        // repel from pointer (fine only)
        if (fine && pointer.active) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < pr && dist > 0.001) {
            const force = (1 - dist / pr) * 10;
            n.ox += (dx / dist) * force * dt * 6;
            n.oy += (dy / dist) * force * dt * 6;
            n.bright = Math.min(1, n.bright + (1 - dist / pr) * 0.06);
          }
        }
        // decay offset toward 0
        n.ox += (0 - n.ox) * Math.min(1, dt * 4);
        n.oy += (0 - n.oy) * Math.min(1, dt * 4);
        // decay brightness
        n.bright *= Math.max(0, 1 - dt * 2.2);
      }

      // draw base edges
      for (const e of edges) drawEdge(e, 0.1, colorMode);

      // cursor traces: connect pointer to nearby nodes (fine only)
      if (fine && pointer.active) {
        for (const n of nodes) {
          const [nx, ny] = nodePos(n);
          const d = Math.hypot(nx - pointer.x, ny - pointer.y);
          if (d < pr) {
            const a = (1 - d / pr) * 0.35;
            ctx!.beginPath();
            ctx!.moveTo(pointer.x, pointer.y);
            ctx!.lineTo(nx, ny);
            ctx!.strokeStyle = `rgba(${cSig2(colorMode)},${a})`;
            ctx!.stroke();
          }
        }
      }

      // advance pulses
      pulseTimer -= dt;
      if (pulseTimer <= 0) {
        spawnPulse();
        pulseTimer = 0.8 + rand() * 1.8;
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed * dt;
        while (p.t >= 1) {
          p.t -= 1;
          // light up node we arrived at
          const arrived = p.chain[p.seg + 1];
          if (arrived != null && nodes[arrived]) nodes[arrived].bright = 1;
          p.seg++;
          p.life--;
          if (p.seg >= p.chain.length - 1) break;
        }
        if (p.seg >= p.chain.length - 1) {
          pulses.splice(i, 1);
          continue;
        }
        const [px, py] = pointToSeg(p.chain, p.seg, p.t);
        // dash trail
        const g = ctx!.createRadialGradient(px, py, 0, px, py, 8);
        g.addColorStop(0, `rgba(${cSig2(colorMode)},${colorMode ? 0.95 : 0.85})`);
        g.addColorStop(1, `rgba(${cSig2(colorMode)},0)`);
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(px, py, 8, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.beginPath();
        ctx!.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,0.9)`;
        ctx!.fill();
      }

      // draw nodes on top
      for (const n of nodes) drawNode(n, colorMode);

      rafId = requestAnimationFrame(step);
    }

    function start() {
      if (reduceMQ.matches) {
        // static fallback — draw once, no loop
        stop();
        drawStatic(isColorMode());
        return;
      }
      if (running) return;
      running = true;
      lastTs = performance.now();
      pulseTimer = 0.4;
      rafId = requestAnimationFrame(step);
    }

    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === 0 || h === 0) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = w;
      height = h;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildField();
      if (reduceMQ.matches) {
        drawStatic(isColorMode());
      }
    }

    // pointer handling — throttle with rAF
    const applyPointer = () => {
      pointerRaf = 0;
      if (pendingPointer) {
        pointer.x = pendingPointer.x;
        pointer.y = pendingPointer.y;
        pointer.active = true;
        pendingPointer = null;
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (coarseMQ.matches || reduceMQ.matches) return;
      pendingPointer = { x: e.clientX, y: e.clientY };
      if (!pointerRaf) pointerRaf = requestAnimationFrame(applyPointer);
    };
    const deactivatePointer = () => {
      pointer.active = false;
      pendingPointer = null;
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    // IntersectionObserver: pause when offscreen (canvas is fixed full-viewport,
    // so this mainly guards against being display:none / detached)
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          const vis = entries.some((en) => en.isIntersecting);
          if (!vis) stop();
          else if (!document.hidden) start();
        },
        { threshold: 0 }
      );
      io.observe(canvas);
    }

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        // skip the initial synchronous callback (we call resize() manually below)
        if (!roPrimed) {
          roPrimed = true;
          return;
        }
        resize();
      });
      ro.observe(document.documentElement);
    } else {
      window.addEventListener("resize", resize);
    }

    // color-mode toggle: in reduced-motion static path, redraw so brightness
    // intensifies live (animated path already reads isColorMode() each frame).
    const classObserver = new MutationObserver(() => {
      if (reduceMQ.matches && width > 0 && height > 0) {
        drawStatic(isColorMode());
      }
    });
    classObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // reduced-motion change handling
    const onReduceChange = () => {
      stop();
      resize();
      if (!reduceMQ.matches && !document.hidden) start();
    };
    const addMQListener = (mq: MediaQueryList, fn: () => void) => {
      if (mq.addEventListener) mq.addEventListener("change", fn);
      else if (mq.addListener) mq.addListener(fn);
    };
    const removeMQListener = (mq: MediaQueryList, fn: () => void) => {
      if (mq.removeEventListener) mq.removeEventListener("change", fn);
      else if (mq.removeListener) mq.removeListener(fn);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", deactivatePointer, { passive: true });
    window.addEventListener("blur", deactivatePointer);
    document.addEventListener("visibilitychange", onVisibility);
    addMQListener(reduceMQ, onReduceChange);

    // init
    resize();
    if (!reduceMQ.matches && !document.hidden) start();

    return () => {
      stop();
      if (pointerRaf) cancelAnimationFrame(pointerRaf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", deactivatePointer);
      window.removeEventListener("blur", deactivatePointer);
      document.removeEventListener("visibilitychange", onVisibility);
      removeMQListener(reduceMQ, onReduceChange);
      classObserver.disconnect();
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", resize);
      if (io) io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -10, background: "transparent" }}
    />
  );
}
