"use client";

import { useEffect, useRef, useState } from "react";

/* AICS-93 — global 404 · "signal lost"
   Severed neural connection: two node clusters, a broken trace that
   sparks and repeatedly tries (and fails) to re-route across the gap. */

type Node = { x: number; y: number; r: number };

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0;
    let H = 0;

    // Layout coordinates are computed in CSS pixels; scaled by dpr.
    let left: Node[] = [];
    let right: Node[] = [];
    let gapA = { x: 0, y: 0 };
    let gapB = { x: 0, y: 0 };

    const buildLayout = () => {
      const cx = W / 2;
      const cy = H / 2;
      const spread = Math.min(W, H) * 0.34;
      const clusterR = Math.max(26, Math.min(W, H) * 0.11);

      const mk = (bx: number, by: number): Node[] => {
        const nodes: Node[] = [];
        // deterministic ring of nodes — no Math.random during layout
        const count = 5;
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2 + (bx < cx ? 0.4 : -0.4);
          const rr = clusterR * (0.55 + 0.45 * ((i % 3) / 2));
          nodes.push({
            x: bx + Math.cos(a) * rr,
            y: by + Math.sin(a) * rr,
            r: 2 + (i % 3),
          });
        }
        nodes.push({ x: bx, y: by, r: 4 });
        return nodes;
      };

      left = mk(cx - spread, cy);
      right = mk(cx + spread, cy);
      // the severed endpoints face each other, with a gap in the middle
      gapA = { x: cx - spread * 0.36, y: cy };
      gapB = { x: cx + spread * 0.36, y: cy };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildLayout();
    };

    const SIGNAL = "#8b67ff";
    const SIGNAL2 = "#c856ff";

    const drawCluster = (nodes: Node[], pulse: number) => {
      // links to the cluster centre
      const c = nodes[nodes.length - 1];
      ctx.strokeStyle = "rgba(139,103,255,0.22)";
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(nodes[i].x, nodes[i].y);
        ctx.stroke();
      }
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const isCore = i === nodes.length - 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + (isCore ? pulse * 1.5 : 0), 0, Math.PI * 2);
        ctx.fillStyle = isCore ? SIGNAL : "rgba(233,230,245,0.65)";
        if (isCore) {
          ctx.shadowColor = SIGNAL;
          ctx.shadowBlur = 12 + pulse * 8;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const drawTrace = (
      from: { x: number; y: number },
      to: { x: number; y: number }
    ) => {
      // the intact severed stub, before the gap
      ctx.strokeStyle = "rgba(139,103,255,0.55)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      // frayed endpoint tick
      ctx.strokeStyle = "rgba(200,86,255,0.55)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(to.x, to.y - 5);
      ctx.lineTo(to.x, to.y + 5);
      ctx.stroke();
    };

    // deterministic spark offsets (seeded, no runtime randomness)
    const sparkSeeds = [0.13, 0.61, 0.29, 0.83, 0.47, 0.07, 0.71, 0.37];

    const renderStatic = () => {
      ctx.clearRect(0, 0, W, H);
      drawCluster(left, 0);
      drawCluster(right, 0);
      // stubs
      const lc = left[left.length - 1];
      const rc = right[right.length - 1];
      drawTrace(lc, gapA);
      drawTrace(rc, gapB);
      // static broken hint across the gap (dotted, faint)
      ctx.save();
      ctx.setLineDash([2, 6]);
      ctx.strokeStyle = "rgba(139,103,255,0.18)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(gapA.x, gapA.y);
      ctx.lineTo(gapB.x, gapB.y);
      ctx.stroke();
      ctx.restore();
      // gap endpoint ticks
      ctx.fillStyle = "rgba(139,132,166,0.5)";
      ctx.beginPath();
      ctx.arc(gapA.x, gapA.y, 2, 0, Math.PI * 2);
      ctx.arc(gapB.x, gapB.y, 2, 0, Math.PI * 2);
      ctx.fill();
    };

    let raf = 0;
    let running = false;
    let start = 0;

    const frame = (t: number) => {
      if (!running) return;
      if (!start) start = t;
      const el = (t - start) / 1000;

      ctx.clearRect(0, 0, W, H);

      const pulse = 0.5 + 0.5 * Math.sin(el * 2.2);
      drawCluster(left, pulse);
      drawCluster(right, pulse);

      const lc = left[left.length - 1];
      const rc = right[right.length - 1];
      drawTrace(lc, gapA);
      drawTrace(rc, gapB);

      // re-route attempt: a dashed pulse draws from gapA toward gapB,
      // reaches short of the far endpoint, then fails (fades) and retries.
      const cycle = 2.6;
      const phase = (el % cycle) / cycle; // 0..1
      const attemptEnd = 0.72; // fraction of cycle the trace grows over
      const gapVec = { x: gapB.x - gapA.x, y: gapB.y - gapA.y };

      if (phase < attemptEnd) {
        const p = phase / attemptEnd; // 0..1 grow
        // it never quite bridges — stops at 0.82 of the gap
        const reach = 0.82 * p;
        const ex = gapA.x + gapVec.x * reach;
        const ey = gapA.y + gapVec.y * reach;

        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -el * 40;
        const g = ctx.createLinearGradient(gapA.x, gapA.y, gapB.x, gapB.y);
        g.addColorStop(0, SIGNAL);
        g.addColorStop(1, SIGNAL2);
        ctx.strokeStyle = g;
        ctx.globalAlpha = 0.85;
        ctx.lineWidth = 2;
        ctx.shadowColor = SIGNAL;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(gapA.x, gapA.y);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.restore();

        // leading spark head
        ctx.save();
        ctx.fillStyle = SIGNAL2;
        ctx.shadowColor = SIGNAL2;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(ex, ey, 2.5 + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        // failure flash: sparks scatter near the far endpoint, then dark
        const fp = (phase - attemptEnd) / (1 - attemptEnd); // 0..1
        const fade = 1 - fp;
        const fx = gapA.x + gapVec.x * 0.82;
        const fy = gapA.y + gapVec.y * 0.82;
        ctx.save();
        for (let i = 0; i < sparkSeeds.length; i++) {
          const a = sparkSeeds[i] * Math.PI * 2;
          const dist = fp * (10 + i * 2.5);
          const sx = fx + Math.cos(a) * dist;
          const sy = fy + Math.sin(a) * dist * 0.7;
          ctx.globalAlpha = fade * 0.9;
          ctx.fillStyle = i % 2 ? SIGNAL2 : SIGNAL;
          ctx.shadowColor = SIGNAL;
          ctx.shadowBlur = 8 * fade;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // faint permanent broken-gap dotted guide
      ctx.save();
      ctx.setLineDash([2, 7]);
      ctx.strokeStyle = "rgba(139,132,166,0.16)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gapA.x, gapA.y);
      ctx.lineTo(gapB.x, gapB.y);
      ctx.stroke();
      ctx.restore();

      raf = window.requestAnimationFrame(frame);
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      start = 0;
      raf = window.requestAnimationFrame(frame);
    };
    const stopLoop = () => {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(() => {
      resize();
      // Only paint a static frame when the loop isn't driving the canvas.
      if (reduced || !running) renderStatic();
    });
    ro.observe(canvas);
    resize();

    if (reduced) {
      renderStatic();
      return () => {
        ro.disconnect();
      };
    }

    const onVisibility = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };

    document.addEventListener("visibilitychange", onVisibility);
    startLoop();

    return () => {
      stopLoop();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mounted, reduced]);

  return (
    <main className="runtime relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <div
        className="runtime-grid pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
      />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center">
        <div className="hud mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1">
          <span className="hud-dot" aria-hidden="true" />
          <span className="tech-label">// signal_lost · 404</span>
        </div>

        <h1
          className="signal-text select-none leading-none"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(5rem, 22vw, 12rem)",
            letterSpacing: "-0.03em",
          }}
        >
          404
        </h1>

        <h2
          className="mt-2 text-2xl font-medium sm:text-3xl"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--color-runtime-ink)",
          }}
        >
          сигнал потерян
        </h2>

        <p
          className="tech-label mt-4"
          style={{ color: "var(--color-runtime-ink-soft)" }}
        >
          // neural link severed — rerouting
        </p>

        <p
          className="mt-4 max-w-md text-sm sm:text-base"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--color-runtime-ink-soft)",
          }}
        >
          Трасса между узлами разорвана. Система не смогла проложить маршрут к
          запрошенному адресу.
        </p>

        <a
          href="/"
          className="signal-grad signal-glow mt-9 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 sm:text-base"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          вернуться в систему
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </main>
  );
}
