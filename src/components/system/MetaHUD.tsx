"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * MetaHUD — a fixed "running-system" HUD readout that makes the page feel
 * like a live machine (codename AICS-93). Bottom-left, non-interactive,
 * hidden on small screens. SSR-safe, respects prefers-reduced-motion.
 */

type Metrics = {
  clock: string; // HH:MM:SS
  uptime: string; // mm:ss
  load: number; // 0..100
  inference: number; // ms
  px: number; // pointer viewport X
  py: number; // pointer viewport Y
};

const pad2 = (n: number): string => (n < 10 ? "0" + n : String(n));

function pad4(n: number): string {
  const s = String(Math.max(0, Math.min(9999, n)));
  return s.padStart(4, "0");
}

function formatClock(d: Date): string {
  return (
    pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds())
  );
}

function formatUptime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return pad2(mm) + ":" + pad2(ss);
}

export default function MetaHUD() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [colorMode, setColorMode] = useState(false);
  // Reveal only after the hero, so it never competes with the hero's own HUD.
  const [shown, setShown] = useState(false);

  const [metrics, setMetrics] = useState<Metrics>({
    clock: "00:00:00",
    uptime: "00:00",
    load: 42,
    inference: 12,
    px: 0,
    py: 0,
  });

  // Mutable refs for values updated at high frequency without re-render churn.
  const mountAtRef = useRef<number>(0);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const reducedRef = useRef<boolean>(false);

  // Mount flag + reduced-motion + color-mode detection (client-only).
  useEffect(() => {
    setMounted(true);
    mountAtRef.current =
      typeof performance !== "undefined" ? performance.now() : 0;

    const motionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => {
      reducedRef.current = motionMQ.matches;
      setReduced(motionMQ.matches);
    };
    applyMotion();
    motionMQ.addEventListener("change", applyMotion);

    const root = document.documentElement;
    const readColorMode = () =>
      setColorMode(root.classList.contains("color-mode"));
    readColorMode();
    const classObserver = new MutationObserver(readColorMode);
    classObserver.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      motionMQ.removeEventListener("change", applyMotion);
      classObserver.disconnect();
    };
  }, []);

  // Fade in once the hero is scrolled past.
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pointer tracking (throttled via rAF), window-level. Disabled on coarse pointers.
  useEffect(() => {
    if (!mounted) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    let queued = false;
    let rafId = 0;
    let nextX = pointerRef.current.x;
    let nextY = pointerRef.current.y;

    const flush = () => {
      queued = false;
      pointerRef.current.x = nextX;
      pointerRef.current.y = nextY;
    };

    const onMove = (e: PointerEvent) => {
      nextX = e.clientX;
      nextY = e.clientY;
      if (!queued) {
        queued = true;
        rafId = requestAnimationFrame(flush);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (queued) cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  // Main driver loop. Clock ticks always; oscillations pause under reduced motion.
  useEffect(() => {
    if (!mounted) return;

    let lastClockSecond = -1;
    let lastCommit = 0;
    let intervalId: number | null = null;

    const commit = (now: number, force: boolean) => {
      // Throttle visual updates to ~6/sec for the oscillating values.
      if (!force && now - lastCommit < 160) return;
      lastCommit = now;

      const elapsed = (now - mountAtRef.current) / 1000;
      const d = new Date();
      const currentSecond = d.getSeconds();
      const clockChanged = currentSecond !== lastClockSecond;
      lastClockSecond = currentSecond;

      const still = reducedRef.current;

      // Deterministic oscillations driven by elapsed time.
      const t = elapsed;
      const load = still
        ? 46
        : 46 + 26 * Math.sin(t * 0.55) + 8 * Math.sin(t * 1.9 + 1.3);
      const inference = still
        ? 12
        : 12 + 5 * Math.sin(t * 0.9 + 0.4) + 2 * Math.sin(t * 2.7);

      setMetrics((prev) => {
        const next: Metrics = {
          clock: clockChanged ? formatClock(d) : prev.clock,
          uptime: formatUptime(elapsed),
          load: Math.round(Math.max(0, Math.min(100, load))),
          inference: Math.max(1, Math.round(inference)),
          px: Math.round(pointerRef.current.x),
          py: Math.round(pointerRef.current.y),
        };
        // Avoid state churn when nothing meaningful changed (reduced-motion idle).
        if (
          next.clock === prev.clock &&
          next.uptime === prev.uptime &&
          next.load === prev.load &&
          next.inference === prev.inference &&
          next.px === prev.px &&
          next.py === prev.py
        ) {
          return prev;
        }
        return next;
      });
    };

    const startRaf = () => {
      const tick = () => {
        commit(performance.now(), false);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const stopRaf = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const startInterval = () => {
      // Under reduced motion we only need the 1s clock/uptime tick.
      commit(performance.now(), true);
      intervalId = window.setInterval(
        () => commit(performance.now(), true),
        1000,
      );
    };

    const stopInterval = () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };

    const startLoop = () => {
      if (reducedRef.current) {
        stopRaf();
        if (intervalId === null) startInterval();
      } else {
        stopInterval();
        if (rafRef.current === null) startRaf();
      }
    };

    const stopLoop = () => {
      stopRaf();
      stopInterval();
    };

    const onVisibility = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        commit(performance.now(), true);
        startLoop();
      }
    };

    // Restart loop when reduced-motion preference flips.
    const motionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      reducedRef.current = motionMQ.matches;
      stopLoop();
      if (!document.hidden) startLoop();
    };

    startLoop();
    document.addEventListener("visibilitychange", onVisibility);
    motionMQ.addEventListener("change", onMotion);

    return () => {
      stopLoop();
      document.removeEventListener("visibilitychange", onVisibility);
      motionMQ.removeEventListener("change", onMotion);
    };
  }, [mounted]);

  // Stable server/first-client render: nothing until mounted (prevents hydration mismatch).
  if (!mounted) return null;

  const inkSoft = "var(--color-ink-soft, #554488)";
  const ink = "var(--color-ink, #302055)";
  const signal = "var(--color-signal, #9747ff)";

  return (
    <div
      aria-hidden="true"
      className="hud tech-label hidden md:block"
      style={{
        position: "fixed",
        left: "1rem",
        bottom: "1rem",
        zIndex: 40,
        pointerEvents: "none",
        userSelect: "none",
        fontSize: "10px",
        lineHeight: 1.5,
        letterSpacing: "0.06em",
        color: inkSoft,
        fontVariantNumeric: "tabular-nums",
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(8px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <style>{`
        @keyframes metahud-blink {
          0%, 45% { opacity: 1; }
          55%, 100% { opacity: 0.25; }
        }
      `}</style>
      <div
        style={{
          display: "grid",
          rowGap: "2px",
          padding: "8px 10px",
          borderRadius: "10px",
          border: `1px solid ${
            colorMode ? signal : "var(--color-line, #ded6f0)"
          }`,
          background: colorMode
            ? "color-mix(in srgb, var(--color-signal, #9747ff) 8%, rgba(255,255,255,0.62))"
            : "rgba(255,255,255,0.55)",
          backdropFilter: "blur(8px) saturate(1.05)",
          WebkitBackdropFilter: "blur(8px) saturate(1.05)",
          minWidth: "148px",
        }}
      >
        <Row>
          <span style={{ color: ink, fontWeight: 600 }}>AICS-93</span>
          <span>runtime</span>
        </Row>

        <Row>
          <span>
            <span
              className="hud-dot"
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                marginRight: "6px",
                borderRadius: "50%",
                background: signal,
                verticalAlign: "middle",
                boxShadow: `0 0 6px ${signal}`,
                animation: reduced
                  ? "none"
                  : "metahud-blink 1.6s steps(1, end) infinite",
                opacity: reduced ? 1 : undefined,
              }}
            />
            sys
          </span>
          <span style={{ color: signal }}>online</span>
        </Row>

        <Row>
          <span>clock</span>
          <span style={{ color: ink }}>{metrics.clock}</span>
        </Row>

        <Row>
          <span>uptime</span>
          <span style={{ color: ink }}>{metrics.uptime}</span>
        </Row>

        <Row>
          <span>neural load</span>
          <span style={{ color: ink }}>{pad2(metrics.load)}%</span>
        </Row>

        <Row>
          <span>inference</span>
          <span style={{ color: ink }}>{metrics.inference} ms</span>
        </Row>

        <Row>
          <span>pointer</span>
          <span style={{ color: ink }}>
            {pad4(metrics.px)}·{pad4(metrics.py)}
          </span>
        </Row>
      </div>
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        columnGap: "16px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}
