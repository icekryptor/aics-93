"use client";

import { useEffect, useRef, useState } from "react";

type SignalTransitionProps = {
  label?: string;
  index?: string;
  id?: string;
  compact?: boolean;
};

const NODE_COUNT = 5;
const TAP_INDICES = [1, 3];

export default function SignalTransition({ label, index, id, compact }: SignalTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!mounted || reduced) return;
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let visible = true;

    let proximity = 0;
    let targetProximity = 0;

    const readColor = (name: string, fallback: string) => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
      return v || fallback;
    };

    let cLine = readColor("--color-line", "#ded6f0");
    let cSignal = readColor("--color-signal", "#9747ff");
    let cSignal2 = readColor("--color-signal-2", "#b57bff");
    let cInkSoft = readColor("--color-ink-soft", "#554488");

    const refreshColors = () => {
      cLine = readColor("--color-line", "#ded6f0");
      cSignal = readColor("--color-signal", "#9747ff");
      cSignal2 = readColor("--color-signal-2", "#b57bff");
      cInkSoft = readColor("--color-ink-soft", "#554488");
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      refreshColors();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    resize();

    const updateProximity = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const bandCenter = rect.top + rect.height / 2;
      const dist = Math.abs(bandCenter - vh / 2);
      const norm = 1 - Math.min(1, dist / (vh * 0.55));
      targetProximity = Math.max(0, norm);
    };

    updateProximity();
    window.addEventListener("scroll", updateProximity, { passive: true });
    window.addEventListener("resize", updateProximity);

    const nodesX = () => {
      const margin = Math.min(64, width * 0.06);
      const usable = width - margin * 2;
      const arr: number[] = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        arr.push(margin + (usable * i) / (NODE_COUNT - 1));
      }
      return arr;
    };

    let last = performance.now();
    let pulse = 0;

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      proximity += (targetProximity - proximity) * Math.min(1, dt * 6);

      const speed = 0.28 + proximity * 0.55;
      pulse += dt * speed;
      if (pulse > 1) pulse -= 1;

      ctx.clearRect(0, 0, width, height);

      const midY = height / 2;
      const xs = nodesX();
      const x0 = xs[0];
      const x1 = xs[xs.length - 1];

      ctx.lineWidth = 1;
      ctx.strokeStyle = cLine;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(x0, midY);
      ctx.lineTo(x1, midY);
      ctx.stroke();

      const pxx = x0 + (x1 - x0) * pulse;

      for (const ti of TAP_INDICES) {
        const tx = xs[ti];
        const near = 1 - Math.min(1, Math.abs(pxx - tx) / 46);
        const glow = near * (0.35 + proximity * 0.65);
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = cLine;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tx, midY - 14);
        ctx.lineTo(tx, midY + 14);
        ctx.stroke();
        if (glow > 0.02) {
          ctx.globalAlpha = glow;
          ctx.strokeStyle = cSignal;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(tx, midY - 14);
          ctx.lineTo(tx, midY + 14);
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      }

      for (let i = 0; i < xs.length; i++) {
        const nx = xs[i];
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = cInkSoft;
        ctx.beginPath();
        ctx.arc(nx, midY, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      const px = pxx;
      const trail = 90 + proximity * 40;
      const gradStart = Math.max(x0, px - trail);
      const grad = ctx.createLinearGradient(px - trail, 0, px, 0);
      grad.addColorStop(0, "rgba(151, 71, 255,0)");
      grad.addColorStop(1, cSignal);
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gradStart, midY);
      ctx.lineTo(px, midY);
      ctx.stroke();
      ctx.lineWidth = 1;

      const headR = 2.6 + proximity * 2.2;
      const headGlow = ctx.createRadialGradient(px, midY, 0, px, midY, headR * 4);
      headGlow.addColorStop(0, cSignal2);
      headGlow.addColorStop(0.5, cSignal);
      headGlow.addColorStop(1, "rgba(151, 71, 255,0)");
      ctx.globalAlpha = 0.6 + proximity * 0.4;
      ctx.fillStyle = headGlow;
      ctx.beginPath();
      ctx.arc(px, midY, headR * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.fillStyle = cSignal2;
      ctx.beginPath();
      ctx.arc(px, midY, headR, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;

      if (running) {
        raf = requestAnimationFrame(draw);
      } else {
        raf = 0;
      }
    };

    const start = () => {
      if (raf || running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const sync = () => {
      const shouldRun =
        typeof document !== "undefined" && !document.hidden && visible;
      if (shouldRun) start();
      else stop();
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible = e.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    io.observe(root);

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    sync();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", updateProximity);
      window.removeEventListener("resize", updateProximity);
    };
  }, [mounted, reduced]);

  const showLabel = Boolean(index || label);
  const labelText = [index, label].filter(Boolean).join(" // ");

  return (
    <div
      ref={rootRef}
      id={id}
      data-act={id ? "" : undefined}
      className="relative w-full scroll-mt-24 overflow-hidden"
      style={{ height: compact ? 74 : 112 }}
    >
      {showLabel && (
        <span
          className="tech-label absolute left-4 top-1/2 z-10 -translate-y-1/2 sm:left-8"
          style={{ color: "var(--color-ink-soft)" }}
        >
          {labelText}
        </span>
      )}

      {mounted && !reduced ? (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 block h-full w-full"
        />
      ) : (
        <div
          aria-hidden="true"
          className="signal-seam absolute left-0 right-0 top-1/2 -translate-y-1/2"
          style={{ height: 1 }}
        />
      )}
    </div>
  );
}
