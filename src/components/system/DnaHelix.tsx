"use client";

import { useEffect, useRef } from "react";

interface DnaHelixProps {
  className?: string;
}

interface Rung {
  /** normalized position along helix [0..1] */
  t: number;
  label?: string;
}

const LABELS: readonly string[] = [
  "НЕЙМИНГ",
  "ЛОГОТИП",
  "СТРАТЕГИЯ",
  "TONE OF VOICE",
  "UX/UI",
  "КОНТЕНТ",
  "АЙДЕНТИКА",
];

const RUNG_COUNT = 34;

/** Distribute labels evenly across the rungs. */
function buildRungs(): Rung[] {
  const rungs: Rung[] = [];
  const labelStep = Math.max(1, Math.floor(RUNG_COUNT / (LABELS.length + 1)));
  let labelIdx = 0;
  for (let i = 0; i < RUNG_COUNT; i++) {
    const t = RUNG_COUNT > 1 ? i / (RUNG_COUNT - 1) : 0.5;
    let label: string | undefined;
    if (
      labelIdx < LABELS.length &&
      i > 0 &&
      i % labelStep === 0 &&
      i < RUNG_COUNT - 1
    ) {
      label = LABELS[labelIdx];
      labelIdx += 1;
    }
    rungs.push({ t, label });
  }
  return rungs;
}

const COL = {
  signal: "151, 71, 255", // #9747ff
  signal2: "181, 123, 255", // #b57bff
  cool: "201, 182, 255", // #c9b6ff
  ink: "48, 32, 85", // #302055
  inkSoft: "85, 68, 136", // #554488
  line: "222, 214, 240",
  coral: "255, 112, 80", // brand coral — second strand // #ded6f0
};

/**
 * Canvas 2D ctx.font does NOT resolve CSS custom properties (var(--...)).
 * Read the actual computed value of --font-display from the element and
 * fall back to a safe stack so labels always render.
 */
function resolveDisplayFont(el: HTMLElement): string {
  let family = "";
  try {
    const styles = getComputedStyle(el);
    family = styles.getPropertyValue("--font-display").trim();
  } catch {
    family = "";
  }
  if (!family) {
    family = '"Unbounded", system-ui, sans-serif';
  }
  return family;
}

export default function DnaHelix({ className }: DnaHelixProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mutable animation/interaction state (avoids re-renders).
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef<boolean>(false);
  const visibleRef = useRef<boolean>(false);
  const hiddenRef = useRef<boolean>(false);
  const reducedRef = useRef<boolean>(false);
  const coarseRef = useRef<boolean>(false);

  const dimsRef = useRef<{ w: number; h: number; dpr: number }>({
    w: 0,
    h: 0,
    dpr: 1,
  });

  const fontRef = useRef<string>('"Unbounded", system-ui, sans-serif');

  // pointer in element-local pixels (CSS px), and inside flag
  const pointerRef = useRef<{ x: number; y: number; inside: boolean }>({
    x: 0,
    y: 0,
    inside: false,
  });
  const pointerRawRef = useRef<{ x: number; y: number } | null>(null);
  const pointerRafRef = useRef<number | null>(null);

  // scroll-assemble progress [0..1]
  const assembleRef = useRef<number>(0);
  const revealSmoothRef = useRef<number>(0);
  // smoothed twist speed multiplier (leans toward pointer)
  const leanRef = useRef<number>(0);
  // read-head glow x (normalized), smoothed
  const readHeadRef = useRef<number>(0.5);

  const rungsRef = useRef<Rung[]>(buildRungs());
  // origin timestamp for the twist clock (set once, in effect)
  const startRef = useRef<number>(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canRun2d: CanvasRenderingContext2D = ctx;

    reducedRef.current =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    coarseRef.current =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;

    fontRef.current = resolveDisplayFont(wrap);

    // seed the twist clock so the very first static frame is well-defined
    startRef.current = performance.now();

    // ---- sizing ----
    const applySize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      dimsRef.current = { w, h, dpr };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
    };

    applySize();

    // ---- assemble progress based on element scroll over viewport ----
    const computeAssemble = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress from element top entering bottom of viewport to element
      // center reaching upper third — smooth writing motion.
      const startY = vh * 0.92;
      const endY = vh * 0.32;
      const p = (startY - rect.top) / (startY - endY);
      // one-shot: assembles as it enters, never disassembles on scroll-back
      assembleRef.current = Math.max(assembleRef.current, Math.max(0, Math.min(1, p)));
    };
    computeAssemble();

    // ---- helix draw ----
    const draw = (now: number) => {
      const { w, h, dpr } = dimsRef.current;
      const rungs = rungsRef.current;

      canRun2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      canRun2d.clearRect(0, 0, w, h);

      const midY = h * 0.5;
      const amp = h * 0.34; // amplitude ~34% of height
      const marginX = Math.max(28, w * 0.04);
      const spanX = Math.max(1, w - marginX * 2);
      // number of full twists across the width scales with width
      const twists = Math.max(1.6, w / 360);
      const k = twists * Math.PI * 2; // total phase across span

      // time-driven phase (twist)
      const reduced = reducedRef.current;
      const elapsed = reduced ? 0 : Math.max(0, (now - startRef.current) / 1000);
      const baseSpeed = coarseRef.current ? 0.55 : 0.7;
      const speed = baseSpeed * (1 + leanRef.current * 0.6);
      const phase = reduced ? Math.PI * 0.25 : elapsed * speed;

      // ease the reveal toward the scroll target — no jumpy reaction
      const assemble = reduced ? 1 : assembleRef.current;
      revealSmoothRef.current += (assemble - revealSmoothRef.current) * 0.045;
      const revealT = Math.max(0.06, reduced ? 1 : revealSmoothRef.current);

      const pointer = pointerRef.current;
      const fine = !coarseRef.current;

      // strand point at normalized position t (0..1) for a given strand offset
      const strandY = (t: number, offset: number) => {
        const ang = t * k + phase + offset;
        return midY + Math.sin(ang) * amp;
      };
      const depthAt = (t: number, offset: number) => {
        const ang = t * k + phase + offset;
        // cos gives z-depth: +1 front, -1 back
        return Math.cos(ang);
      };
      const xAt = (t: number) => marginX + t * spanX;

      // ---- draw the two backbone strands (behind rungs) ----
      const drawBackbone = (offset: number) => {
        const steps = Math.max(48, Math.round(w / 6));
        // draw in short segments so depth-based alpha reads as 3D twist
        for (let i = 0; i < steps; i++) {
          const t0 = i / steps;
          const t1 = (i + 1) / steps;
          if (t0 > revealT) break;
          const x0 = xAt(t0);
          const x1 = xAt(t1);
          const y0 = strandY(t0, offset);
          const y1 = strandY(t1, offset);
          const z = depthAt((t0 + t1) / 2, offset); // -1..1
          const front = (z + 1) / 2; // 0..1
          const alpha = 0.14 + front * 0.5;
          const lw = 1.1 + front * 2.2;
          // violet strand for offset 0, ink strand for the other
          const isViolet = offset === 0;
          const color = isViolet
            ? `rgba(${COL.signal}, ${alpha})`
            : `rgba(${COL.coral}, ${alpha * 0.85})`;
          canRun2d.beginPath();
          canRun2d.moveTo(x0, y0);
          canRun2d.lineTo(x1, y1);
          canRun2d.strokeStyle = color;
          canRun2d.lineWidth = lw;
          canRun2d.lineCap = "round";
          canRun2d.stroke();
        }
      };

      // ---- build rung render list with depth for back-to-front sorting ----
      type RungRender = {
        x: number;
        yA: number;
        yB: number;
        z: number; // depth of strand A at this rung
        front: number;
        label?: string;
        labelFront: number;
      };
      const list: RungRender[] = [];
      for (let i = 0; i < rungs.length; i++) {
        const r = rungs[i];
        if (r.t > revealT + 0.001) continue;
        const x = xAt(r.t);
        const yA = strandY(r.t, 0);
        const yB = strandY(r.t, Math.PI);
        const zA = depthAt(r.t, 0);
        const z = zA; // strand A depth defines pair orientation
        const front = (z + 1) / 2;
        list.push({
          x,
          yA,
          yB,
          z,
          front,
          label: r.label,
          labelFront: front,
        });
      }
      // sort back-to-front (smaller z first => drawn first => behind)
      list.sort((a, b) => a.z - b.z);

      // backbones under rungs
      drawBackbone(0);
      drawBackbone(Math.PI);

      // ---- read-head glow (fine pointers) ----
      if (fine && pointer.inside && !reduced) {
        const hx = readHeadRef.current;
        const gx = xAt(Math.max(0, Math.min(revealT, hx)));
        const grad = canRun2d.createRadialGradient(
          gx,
          midY,
          0,
          gx,
          midY,
          amp * 1.4
        );
        grad.addColorStop(0, `rgba(${COL.signal2}, 0.20)`);
        grad.addColorStop(1, `rgba(${COL.signal2}, 0)`);
        canRun2d.fillStyle = grad;
        canRun2d.fillRect(gx - amp * 1.5, 0, amp * 3, h);
      }

      // ---- draw rungs + nodes back-to-front ----
      for (let i = 0; i < list.length; i++) {
        const r = list[i];
        const alpha = 0.1 + r.front * 0.6;
        const lw = 0.8 + r.front * 2.4;
        // rung connector reads as a base pair
        canRun2d.beginPath();
        canRun2d.moveTo(r.x, r.yA);
        canRun2d.lineTo(r.x, r.yB);
        canRun2d.strokeStyle = `rgba(${COL.ink}, ${alpha * 0.5})`;
        canRun2d.lineWidth = lw;
        canRun2d.lineCap = "round";
        canRun2d.stroke();

        // nodes (nucleotides) at each strand endpoint
        const rad = 1.6 + r.front * 4.2;
        // node A (violet strand, front-biased)
        canRun2d.beginPath();
        canRun2d.arc(r.x, r.yA, rad, 0, Math.PI * 2);
        canRun2d.fillStyle = `rgba(${COL.signal}, ${0.25 + r.front * 0.7})`;
        canRun2d.fill();
        if (r.front > 0.65) {
          canRun2d.beginPath();
          canRun2d.arc(r.x, r.yA, rad + 2.4, 0, Math.PI * 2);
          canRun2d.strokeStyle = `rgba(${COL.signal2}, ${
            (r.front - 0.65) * 0.9
          })`;
          canRun2d.lineWidth = 1;
          canRun2d.stroke();
        }
        // node B (ink strand)
        const radB = 1.4 + (1 - r.front) * 0.6 + r.front * 3.4;
        canRun2d.beginPath();
        canRun2d.arc(r.x, r.yB, radB, 0, Math.PI * 2);
        canRun2d.fillStyle = `rgba(${COL.coral}, ${0.22 + r.front * 0.5})`;
        canRun2d.fill();
      }

      // ---- labels (drawn on canvas, fade by depth) ----
      canRun2d.textAlign = "center";
      canRun2d.textBaseline = "middle";
      for (let i = 0; i < list.length; i++) {
        const r = list[i];
        if (!r.label) continue;
        const lf = r.labelFront;
        if (lf < 0.34) continue; // hide when rotated to back
        const op = Math.min(1, (lf - 0.34) / 0.5);
        // place label above whichever node is higher (smaller y) for legibility
        const topY = Math.min(r.yA, r.yB);
        const ly = topY - 14 - lf * 6;
        const fontPx = 9 + lf * 2.5;
        // NOTE: canvas font must use a resolved family, not a CSS var.
        canRun2d.font = `600 ${fontPx.toFixed(1)}px ${fontRef.current}`;
        // subtle connector tick from node to label
        canRun2d.beginPath();
        canRun2d.moveTo(r.x, topY - 4);
        canRun2d.lineTo(r.x, ly + fontPx * 0.6);
        canRun2d.strokeStyle = `rgba(${COL.line}, ${op * 0.8})`;
        canRun2d.lineWidth = 1;
        canRun2d.stroke();
        canRun2d.fillStyle = `rgba(${COL.ink}, ${op * 0.92})`;
        canRun2d.fillText(r.label, r.x, ly);
      }

      // ---- occasional signal pulse traveling a backbone ----
      if (!reduced && list.length > 0) {
        const period = 4.2; // seconds per pulse traversal
        const cyc = (elapsed % period) / period; // 0..1
        const pt = cyc * revealT;
        if (pt <= revealT) {
          const offset = Math.floor(elapsed / period) % 2 === 0 ? 0 : Math.PI;
          const px = xAt(pt);
          const py = strandY(pt, offset);
          const pz = depthAt(pt, offset);
          const pfront = (pz + 1) / 2;
          const pr = 3 + pfront * 4;
          const g = canRun2d.createRadialGradient(px, py, 0, px, py, pr * 3);
          g.addColorStop(0, `rgba(${COL.signal2}, ${0.5 + pfront * 0.45})`);
          g.addColorStop(1, `rgba(${COL.signal2}, 0)`);
          canRun2d.fillStyle = g;
          canRun2d.beginPath();
          canRun2d.arc(px, py, pr * 3, 0, Math.PI * 2);
          canRun2d.fill();
          canRun2d.beginPath();
          canRun2d.arc(px, py, pr, 0, Math.PI * 2);
          canRun2d.fillStyle = `rgba(255, 255, 255, ${0.6 + pfront * 0.3})`;
          canRun2d.fill();
        }
      }
    };

    // ---- animation loop ----
    const tick = (now: number) => {
      // smooth lean + read-head toward pointer
      const pointer = pointerRef.current;
      const { w } = dimsRef.current;
      const targetLean =
        !coarseRef.current && pointer.inside && w > 0
          ? Math.min(1, Math.abs(pointer.x / w - 0.5) * 2)
          : 0;
      leanRef.current += (targetLean - leanRef.current) * 0.06;

      if (!coarseRef.current && pointer.inside && w > 0) {
        const targetHead = Math.max(0, Math.min(1, pointer.x / w));
        readHeadRef.current += (targetHead - readHeadRef.current) * 0.12;
      }

      draw(now);

      if (runningRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const shouldRun = () =>
      visibleRef.current && !hiddenRef.current && !reducedRef.current;

    const start = () => {
      if (runningRef.current) return;
      if (!shouldRun()) return;
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    };
    const stop = () => {
      runningRef.current = false;
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    const renderOnce = () => {
      // single static frame (reduced motion or paused-but-visible)
      draw(performance.now());
    };

    // ---- observers & listeners ----
    const ro = new ResizeObserver(() => {
      applySize();
      computeAssemble();
      if (!shouldRun()) renderOnce();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visibleRef.current = e.isIntersecting;
        }
        if (shouldRun()) start();
        else {
          stop();
          if (visibleRef.current) renderOnce();
        }
      },
      { threshold: [0, 0.01, 0.2] }
    );
    io.observe(wrap);

    const onVisibility = () => {
      hiddenRef.current = document.hidden;
      if (shouldRun()) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onScroll = () => {
      computeAssemble();
      if (!shouldRun()) renderOnce();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // throttled pointer via rAF
    const flushPointer = () => {
      pointerRafRef.current = null;
      const raw = pointerRawRef.current;
      if (!raw) return;
      const rect = wrap.getBoundingClientRect();
      const x = raw.x - rect.left;
      const y = raw.y - rect.top;
      const inside =
        x >= -40 && x <= rect.width + 40 && y >= -40 && y <= rect.height + 40;
      pointerRef.current = { x, y, inside };
    };
    const onPointerMove = (ev: PointerEvent) => {
      if (coarseRef.current) return;
      pointerRawRef.current = { x: ev.clientX, y: ev.clientY };
      if (pointerRafRef.current == null) {
        pointerRafRef.current = requestAnimationFrame(flushPointer);
      }
    };
    if (!coarseRef.current) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    // initial paint (draw one static frame; loop starts when IO reports visible)
    renderOnce();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      if (!coarseRef.current) {
        window.removeEventListener("pointermove", onPointerMove);
      }
      if (pointerRafRef.current != null) {
        cancelAnimationFrame(pointerRafRef.current);
        pointerRafRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className}
      aria-hidden="true"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
