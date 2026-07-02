"use client";

import { useEffect, useRef } from "react";

type BrainCanvasProps = {
  className?: string;
};

type NodeState = {
  // Three target position sets (normalized 0..1 space, aspect-independent layout box)
  bx: number;
  by: number; // biology
  hx: number;
  hy: number; // hybrid
  mx: number;
  my: number; // machine
  // Live drawing position (canvas px)
  px: number;
  py: number;
  // Idle/organic wobble seeds
  seed: number;
  pulsePhase: number;
  size: number;
  isMachineNode: boolean; // right-half node that becomes circuitry
};

type Edge = {
  a: number;
  b: number;
  rightAngle: boolean; // draw as L-shaped trace vs straight
};

type Signal = {
  edge: number;
  t: number; // 0..1 progress along edge
  speed: number;
};

const N = 168;

// Deterministic hash -> [0,1). No Math.random anywhere.
function hash01(i: number, salt: number): number {
  let x = (i * 374761393 + salt * 668265263) >>> 0;
  x = ((x ^ (x >>> 13)) * 1274126177) >>> 0;
  x = (x ^ (x >>> 16)) >>> 0;
  return x / 4294967296;
}

// Point inside a rough brain silhouette (two lobes + a central seam) in [0,1]^2.
function insideBrain(nx: number, ny: number): boolean {
  // Center the coordinate system
  const x = (nx - 0.5) * 2; // -1..1
  const y = (ny - 0.5) * 2;
  // Overall rounded brain body: wider than tall, slightly flat bottom
  const body = (x * x) / (0.92 * 0.92) + (y * y) / (0.72 * 0.72);
  if (body > 1) return false;
  // Flatten the bottom a touch (brain stem area cut)
  if (y > 0.55 && Math.abs(x) < 0.18) return false;
  // Central fissure: thin gap down the middle for the two-lobe read
  const fissure = Math.abs(x) < 0.045 && y > -0.62 && y < 0.5;
  if (fissure) return false;
  return true;
}

// Smoothstep easing.
function smoothstep(k: number): number {
  const c = k < 0 ? 0 : k > 1 ? 1 : k;
  return c * c * (3 - 2 * c);
}

export default function BrainCanvas({ className }: BrainCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctxMaybe = canvas.getContext("2d", { alpha: true });
    if (!ctxMaybe) return;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    let dpr = Math.min(2, window.devicePixelRatio || 1);
    let cssW = wrap.clientWidth || 1;
    let cssH = wrap.clientHeight || 1;

    // ---- Build nodes (deterministic) ----
    const nodes: NodeState[] = [];
    {
      // Machine grid dims
      const cols = 14;
      const rows = Math.ceil(N / cols);
      let placed = 0;
      let attempts = 0;
      for (let i = 0; i < N; i++) {
        // Biology position -- deterministic reject sampling into brain shape
        let bx = 0.5;
        let by = 0.5;
        let ok = false;
        let a = attempts;
        while (!ok && a < attempts + 400) {
          const cx = hash01(i, 11 + a * 3);
          const cy = hash01(i, 29 + a * 3);
          if (insideBrain(cx, cy)) {
            bx = cx;
            by = cy;
            ok = true;
          }
          a++;
        }
        attempts = a;

        // Machine grid position (ordered lattice), some margin
        const gcol = placed % cols;
        const grow = Math.floor(placed / cols);
        const mx = 0.1 + (gcol / (cols - 1)) * 0.8;
        const my = 0.12 + (grow / Math.max(1, rows - 1)) * 0.76;
        placed++;

        // Right-half nodes convert to circuitry in hybrid/machine
        const isMachineNode = bx > 0.5;

        // Hybrid: left keeps brain, right snaps to a PCB grid
        let hx = bx;
        let hy = by;
        if (isMachineNode) {
          // Snap right-half brain point onto a coarse grid
          const gx = 0.52 + Math.round((bx - 0.52) / 0.07) * 0.07;
          const gy = 0.12 + Math.round((by - 0.12) / 0.075) * 0.075;
          hx = Math.min(0.94, Math.max(0.52, gx));
          hy = Math.min(0.9, Math.max(0.1, gy));
        }

        nodes.push({
          bx,
          by,
          hx,
          hy,
          mx,
          my,
          px: bx * cssW,
          py: by * cssH,
          seed: hash01(i, 101),
          pulsePhase: hash01(i, 211) * Math.PI * 2,
          size: 1.4 + hash01(i, 307) * 1.8,
          isMachineNode,
        });
      }
    }

    // ---- Build edges from biology proximity (stable topology) ----
    const edges: Edge[] = [];
    {
      const maxEdges = 300;
      const thresh = 0.13;
      for (let i = 0; i < N && edges.length < maxEdges; i++) {
        let localCount = 0;
        for (let j = i + 1; j < N && edges.length < maxEdges; j++) {
          const dx = nodes[i].bx - nodes[j].bx;
          const dy = nodes[i].by - nodes[j].by;
          const d = Math.hypot(dx, dy);
          if (d < thresh) {
            const rightAngle = nodes[i].isMachineNode && nodes[j].isMachineNode;
            edges.push({ a: i, b: j, rightAngle });
            localCount++;
            if (localCount > 4) break; // cap fan-out for legibility
          }
        }
      }
    }

    const signals: Signal[] = [];
    const maxSignals = 12;

    // ---- Mutable animation state (declared before any function that reads it) ----
    let t = 0; // 0..2
    let tEased = 0;
    let lastScrollT = 0;
    let idlePhase = 0;
    let lastInteract = 0;
    let elapsed = 0;
    let startTime = 0;
    let signalAccum = 0;
    let signalSeq = 0;
    let rafId = 0;
    let running = false;
    let visible = true;

    function perfNow(): number {
      return performance.now();
    }

    lastInteract = perfNow();

    // Pointer (canvas px space), fine pointers only
    let pointerActive = false;
    let pointerX = 0;
    let pointerY = 0;
    let pendingPointer: { x: number; y: number } | null = null;
    let pointerRaf = 0;

    const applyPointer = () => {
      pointerRaf = 0;
      if (!pendingPointer) return;
      const rect = canvas.getBoundingClientRect();
      pointerX = pendingPointer.x - rect.left;
      pointerY = pendingPointer.y - rect.top;
      pointerActive =
        pointerX >= 0 &&
        pointerY >= 0 &&
        pointerX <= rect.width &&
        pointerY <= rect.height;
      pendingPointer = null;
      lastInteract = perfNow();
      if (pointerActive) spawnCursorSignal();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (coarsePointer) return;
      pendingPointer = { x: e.clientX, y: e.clientY };
      if (!pointerRaf) pointerRaf = requestAnimationFrame(applyPointer);
    };

    const computeScrollT = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Progress as the element travels through the viewport.
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      let p = traveled / total;
      p = Math.max(0, Math.min(1, p));
      return p * 2; // map to 0..2
    };

    const onScroll = () => {
      lastScrollT = computeScrollT();
      lastInteract = perfNow();
    };

    // ---- Resize ----
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cssW = Math.max(1, wrap.clientWidth);
      cssH = Math.max(1, wrap.clientHeight);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Layout box: keep brain proportions, fit inside canvas with padding.
    const layout = (nx: number, ny: number): [number, number] => {
      const pad = 0.06;
      const boxW = cssW * (1 - pad * 2);
      const boxH = cssH * (1 - pad * 2);
      const targetAspect = 1.28;
      let w = boxW;
      let h = w / targetAspect;
      if (h > boxH) {
        h = boxH;
        w = h * targetAspect;
      }
      const ox = (cssW - w) / 2;
      const oy = (cssH - h) / 2;
      return [ox + nx * w, oy + ny * h];
    };

    const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

    // Get target position for a node at morph value tt in [0,2]
    const targetFor = (n: NodeState, tt: number): [number, number] => {
      let nx: number;
      let ny: number;
      if (tt <= 1) {
        nx = lerp(n.bx, n.hx, tt);
        ny = lerp(n.by, n.hy, tt);
      } else {
        const k = tt - 1;
        nx = lerp(n.hx, n.mx, k);
        ny = lerp(n.hy, n.my, k);
      }
      return layout(nx, ny);
    };

    function spawnSignal() {
      if (signals.length >= maxSignals || edges.length === 0) return;
      signalSeq++;
      // Spread pulses across the graph deterministically but varied.
      const idx =
        (Math.floor(idlePhase * 61 + tEased * 97) + signalSeq * 53) %
        edges.length;
      signals.push({
        edge: idx,
        t: 0,
        speed: 0.6 + hash01(signalSeq, 900 + (idx % 17)) * 0.9,
      });
    }

    // Fire an extra pulse from the node nearest the pointer.
    function spawnCursorSignal() {
      if (signals.length >= maxSignals || edges.length === 0) return;
      if (!pointerActive || coarsePointer) return;
      // Throttle: only occasionally emit on move.
      signalSeq++;
      if (signalSeq % 6 !== 0) return;
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < N; i++) {
        const d = Math.hypot(pointerX - nodes[i].px, pointerY - nodes[i].py);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best < 0) return;
      // Find an edge touching that node.
      for (let e = 0; e < edges.length; e++) {
        if (edges[e].a === best || edges[e].b === best) {
          signals.push({ edge: e, t: 0, speed: 1.1 });
          return;
        }
      }
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) drawStatic();
    });
    ro.observe(wrap);

    function drawFrame(now: number) {
      if (!running) return;
      if (!startTime) startTime = now;
      const dt = Math.max(0, Math.min(0.05, (now - startTime) / 1000 - elapsed));
      elapsed = (now - startTime) / 1000;

      // Idle auto-drift of t when user hasn't interacted recently.
      const sinceInteract = (now - lastInteract) / 1000;
      idlePhase += dt * 0.25;
      // Full-range sweep: remap sin(-1..1) -> 0..2 so idle shows biology & machine.
      const autoT = (Math.sin(idlePhase * 0.6) * 0.5 + 0.5) * 2;
      const idleBlend =
        sinceInteract > 1.2 ? Math.min(1, (sinceInteract - 1.2) / 2) : 0;
      const targetT = lerp(lastScrollT, autoT, idleBlend);
      t += (targetT - t) * Math.min(1, dt * 2.2);

      // Ease the fractional morph within each bracket for readable transitions.
      const seg = Math.floor(Math.min(1.999, Math.max(0, t)));
      const frac = Math.min(1, Math.max(0, t - seg));
      tEased = seg + smoothstep(frac);

      render(tEased, elapsed, dt, true);

      // Signals
      signalAccum += dt;
      if (signalAccum > 0.55) {
        signalAccum = 0;
        spawnSignal();
      }
      for (let s = signals.length - 1; s >= 0; s--) {
        signals[s].t += signals[s].speed * dt;
        if (signals[s].t >= 1) {
          signals.splice(s, 1);
        }
      }

      rafId = requestAnimationFrame(drawFrame);
    }

    function render(tt: number, time: number, dt: number, animate: boolean) {
      ctx.clearRect(0, 0, cssW, cssH);

      const bioWeight = Math.max(0, 1 - tt); // 1 at biology, 0 at hybrid+
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        const tgt = targetFor(n, tt);
        let txp = tgt[0];
        let typ = tgt[1];

        if (animate) {
          const wob = bioWeight * 4.5;
          txp += Math.sin(time * 0.8 + n.seed * 20) * wob;
          typ += Math.cos(time * 0.7 + n.seed * 16) * wob;
        }

        if (coarsePointer && animate) {
          txp += Math.sin(time * 0.5 + i) * 1.4;
          typ += Math.cos(time * 0.45 + i * 1.3) * 1.4;
        }

        if (pointerActive && !coarsePointer) {
          const dx = pointerX - n.px;
          const dy = pointerY - n.py;
          const d = Math.hypot(dx, dy);
          const R = 130;
          if (d < R && d > 0.001) {
            const pull = (1 - d / R) * 14;
            txp += (dx / d) * pull;
            typ += (dy / d) * pull;
          }
        }

        const k = animate ? Math.min(1, dt * 6) : 1;
        n.px = lerp(n.px, txp, k);
        n.py = lerp(n.py, typ, k);
      }

      // ---- Edges ----
      const machineWeight = Math.min(1, tt / 2); // 0 bio -> 1 machine
      ctx.lineWidth = 1;
      for (let e = 0; e < edges.length; e++) {
        const edge = edges[e];
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        const dist = Math.hypot(a.px - b.px, a.py - b.py);
        if (dist > 190) continue;
        const alpha = 0.1 + 0.18 * (1 - Math.min(1, dist / 190));
        const traceBias = edge.rightAngle ? machineWeight : machineWeight * 0.4;
        drawEdge(a.px, a.py, b.px, b.py, traceBias, alpha);
      }

      // ---- Signals along edges ----
      if (animate) {
        for (let s = 0; s < signals.length; s++) {
          const sig = signals[s];
          const edge = edges[sig.edge];
          if (!edge) continue;
          const a = nodes[edge.a];
          const b = nodes[edge.b];
          const traceBias = edge.rightAngle
            ? machineWeight
            : machineWeight * 0.4;
          const pt = pointOnEdge(a.px, a.py, b.px, b.py, traceBias, sig.t);
          const fade = Math.sin(sig.t * Math.PI);
          drawSignalDot(pt[0], pt[1], fade);
        }
      }

      // ---- Nodes ----
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        const pulse = animate
          ? 0.75 + 0.25 * Math.sin(time * 2 + n.pulsePhase)
          : 0.9;

        let bright = 1;
        if (pointerActive && !coarsePointer) {
          const d = Math.hypot(pointerX - n.px, pointerY - n.py);
          if (d < 130) bright = 1 + (1 - d / 130) * 1.3;
        }

        const violetAmt = Math.min(1, tt); // 0..1
        const coolAmt = Math.max(0, tt - 1); // 0..1 in machine phase
        drawNode(
          n.px,
          n.py,
          n.size * pulse,
          violetAmt,
          coolAmt,
          n.isMachineNode,
          bright
        );
      }
    }

    function drawEdge(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      traceBias: number,
      alpha: number
    ) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      if (traceBias > 0.5) {
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
      } else {
        ctx.lineTo(x2, y2);
      }
      ctx.strokeStyle = `rgba(151, 71, 255,${alpha.toFixed(3)})`;
      ctx.stroke();
    }

    function pointOnEdge(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      traceBias: number,
      p: number
    ): [number, number] {
      if (traceBias > 0.5) {
        if (p < 0.5) {
          const k = p / 0.5;
          return [lerp(x1, x2, k), y1];
        }
        const k = (p - 0.5) / 0.5;
        return [x2, lerp(y1, y2, k)];
      }
      return [lerp(x1, x2, p), lerp(y1, y2, p)];
    }

    function drawSignalDot(x: number, y: number, fade: number) {
      const r = 2.4 * fade + 0.6;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
      g.addColorStop(0, `rgba(200,134,255,${(0.9 * fade).toFixed(3)})`);
      g.addColorStop(0.4, `rgba(151, 71, 255,${(0.5 * fade).toFixed(3)})`);
      g.addColorStop(1, "rgba(151, 71, 255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawNode(
      x: number,
      y: number,
      r: number,
      violetAmt: number,
      coolAmt: number,
      isMachineNode: boolean,
      bright: number
    ) {
      const wR = 233;
      const wG = 230;
      const wB = 245;
      const vR = 139;
      const vG = 103;
      const vB = 255;
      const clR = 86;
      const clG = 184;
      const clB = 255;
      let cr = lerp(wR, vR, violetAmt);
      let cg = lerp(wG, vG, violetAmt);
      let cb = lerp(wB, vB, violetAmt);
      if (isMachineNode) {
        cr = lerp(cr, clR, coolAmt);
        cg = lerp(cg, clG, coolAmt);
        cb = lerp(cb, clB, coolAmt);
      }

      const glowR = r * 4.5;
      const aCore = Math.min(1, 0.9 * bright);
      const g = ctx.createRadialGradient(x, y, 0, x, y, glowR);
      g.addColorStop(
        0,
        `rgba(${cr | 0},${cg | 0},${cb | 0},${aCore.toFixed(3)})`
      );
      g.addColorStop(
        0.35,
        `rgba(${cr | 0},${cg | 0},${cb | 0},${(0.35 * bright).toFixed(3)})`
      );
      g.addColorStop(1, `rgba(${cr | 0},${cg | 0},${cb | 0},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, glowR, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.min(255, (cr + 30) | 0)},${Math.min(
        255,
        (cg + 30) | 0
      )},${Math.min(255, (cb + 20) | 0)},${Math.min(1, 0.95 * bright).toFixed(
        3
      )})`;
      ctx.fill();
    }

    // Static single HYBRID frame for reduced motion.
    function drawStatic() {
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        const pt = targetFor(n, 1);
        n.px = pt[0];
        n.py = pt[1];
      }
      render(1, 0, 0, false);
    }

    function start() {
      if (running || reduceMotion) return;
      running = true;
      startTime = 0;
      elapsed = 0;
      lastScrollT = computeScrollT();
      lastInteract = perfNow();
      rafId = requestAnimationFrame(drawFrame);
    }

    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }

    // ---- Visibility / offscreen gating ----
    const onVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) {
        stop();
      } else if (visible) {
        start();
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible = entry.isIntersecting;
        }
        if (reduceMotion) return;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0.01 }
    );
    io.observe(wrap);

    // ---- Listeners ----
    if (!reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
    }

    // Initial paint
    if (reduceMotion) {
      drawStatic();
    } else {
      lastScrollT = computeScrollT();
      render(lastScrollT, 0, 0.016, false);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      if (pointerRaf) cancelAnimationFrame(pointerRaf);
      if (!reduceMotion) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onVisibility);
      }
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={className}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
