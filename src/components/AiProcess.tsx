"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ------------------------------------------------------------------ *
 * AiProcess — dark "runtime" section dramatizing AI woven into a
 * company's processes. Interactive SVG schematic: a central AI core
 * routes a violet signal out to 6 department nodes in sequence.
 * Self-contained client component. No external deps.
 * ------------------------------------------------------------------ */

type Dept = {
  id: string;
  label: string;
  code: string;
  /** angle in degrees, 0 = right, clockwise */
  angle: number;
};

const VIEW_W = 900;
const VIEW_H = 620;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;
const RING_R = 232; // ring radius (node centers)

const DEPARTMENTS: readonly Dept[] = [
  { id: "mkt", label: "маркетинг", code: "NODE.01", angle: -90 },
  { id: "content", label: "контент", code: "NODE.02", angle: -30 },
  { id: "sales", label: "продажи", code: "NODE.03", angle: 30 },
  { id: "analytics", label: "аналитика", code: "NODE.04", angle: 90 },
  { id: "support", label: "поддержка", code: "NODE.05", angle: 150 },
  { id: "hire", label: "найм", code: "NODE.06", angle: 210 },
] as const;

const NODE_W = 150;
const NODE_H = 62;
const CUT = 12; // cut-corner size for chip rects

type Pt = { x: number; y: number };

function polar(cx: number, cy: number, r: number, deg: number): Pt {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** cut-corner (chip) rect path, top-left & bottom-right chamfered */
function chipPath(x: number, y: number, w: number, h: number, c: number): string {
  return [
    `M ${x + c} ${y}`,
    `L ${x + w} ${y}`,
    `L ${x + w} ${y + h - c}`,
    `L ${x + w - c} ${y + h}`,
    `L ${x} ${y + h}`,
    `L ${x} ${y + c}`,
    "Z",
  ].join(" ");
}

export default function AiProcess() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(false); // section in view
  const [energized, setEnergized] = useState<boolean[]>(
    () => DEPARTMENTS.map(() => false),
  );
  const [coreLive, setCoreLive] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const timers = useRef<number[]>([]);
  const loopId = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    for (const t of timers.current) window.clearTimeout(t);
    timers.current = [];
    if (loopId.current !== null) {
      window.clearTimeout(loopId.current);
      loopId.current = null;
    }
  }, []);

  // mount + reduced-motion detection (client only)
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // observe section visibility
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setActive(e.isIntersecting);
      },
      { threshold: 0.28 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // routing sequence
  const runSequence = useCallback(() => {
    clearTimers();
    setCoreLive(false);
    setEnergized(DEPARTMENTS.map(() => false));

    // core spins up
    timers.current.push(
      window.setTimeout(() => setCoreLive(true), 240),
    );

    const STEP = 560; // ms between department arrivals
    const START = 700; // when first arrival lands
    DEPARTMENTS.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setEnergized((prev) => {
            const next = prev.slice();
            next[i] = true;
            return next;
          });
        }, START + i * STEP),
      );
    });

    // loop subtly: re-pulse traces after a beat (nodes stay online)
    const total = START + DEPARTMENTS.length * STEP + 2600;
    loopId.current = window.setTimeout(() => {
      setPulseKey((k) => k + 1);
      loopId.current = window.setTimeout(function again() {
        setPulseKey((k) => k + 1);
        loopId.current = window.setTimeout(again, 4200);
      }, 4200);
    }, total);
  }, [clearTimers]);

  // drive animation based on visibility + motion pref
  useEffect(() => {
    if (!mounted) return;

    if (reduced) {
      // static final state — everything online, no loop
      clearTimers();
      setCoreLive(true);
      setEnergized(DEPARTMENTS.map(() => true));
      return;
    }

    if (active) {
      const onVis = () => {
        if (document.hidden) clearTimers();
        else runSequence();
      };
      document.addEventListener("visibilitychange", onVis);
      if (!document.hidden) runSequence();
      return () => {
        document.removeEventListener("visibilitychange", onVis);
        clearTimers();
      };
    }

    // out of view: reset to dormant so re-entry replays
    clearTimers();
    setCoreLive(false);
    setEnergized(DEPARTMENTS.map(() => false));
    return;
  }, [mounted, reduced, active, runSequence, clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  // precompute geometry
  const nodes = useMemo<NodeGeom[]>(() => {
    return DEPARTMENTS.map((d) => {
      const center = polar(CX, CY, RING_R, d.angle);
      // trace endpoint sits on the node edge facing the core
      const edge = polar(CX, CY, RING_R - NODE_W / 2 - 6, d.angle);
      // core exit point
      const start = polar(CX, CY, 74, d.angle);
      const dx = edge.x - start.x;
      const dy = edge.y - start.y;
      const len = Math.hypot(dx, dy);
      return { dept: d, center, edge, start, len };
    });
  }, []);

  const rootStatic = mounted && reduced;

  return (
    <section
      ref={sectionRef}
      id="ai"
      className="runtime relative isolate overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 90% at 50% -10%, var(--color-runtime-2, #100d1a) 0%, var(--color-runtime, #0a0912) 62%)",
        color: "var(--color-runtime-ink, #e9e6f5)",
      }}
    >
      {/* top seam */}
      <div className="signal-seam" aria-hidden="true" />

      {/* grid overlay */}
      <div
        className="runtime-grid pointer-events-none absolute inset-0 opacity-[0.5]"
        aria-hidden="true"
        style={{
          maskImage:
            "radial-gradient(120% 80% at 50% 30%, #000 30%, transparent 92%)",
          WebkitMaskImage:
            "radial-gradient(120% 80% at 50% 30%, #000 30%, transparent 92%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-28 lg:py-36">
        {/* ---------- HEADER ---------- */}
        <header className="max-w-3xl">
          <span
            className="tech-label"
            style={{
              color: "var(--color-signal, #8b67ff)",
              fontFamily: "var(--font-display, inherit)",
              letterSpacing: "0.22em",
              fontSize: "0.72rem",
              textTransform: "uppercase",
            }}
          >
            [ ai в ваших процессах ]
          </span>

          <h2
            className="mt-6 text-balance text-3xl font-semibold leading-[1.08] sm:text-4xl lg:text-[3.35rem]"
            style={{ color: "var(--color-runtime-ink, #e9e6f5)" }}
          >
            ИИ — не инструмент.{" "}
            <span
              className="signal-text"
              style={{
                background:
                  "linear-gradient(92deg, var(--color-signal, #8b67ff), var(--color-signal-2, #c856ff))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Это ядро
            </span>
            , которое приводит в движение все процессы.
          </h2>

          <p
            className="mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--color-runtime-ink-soft, #8b84a6)" }}
          >
            Внедряю сеть нейроагентов в процессы компаний — от контента и
            аналитики до продаж и найма. Один связный контур: данные текут в
            ядро, решения возвращаются в каждый узел.
          </p>
        </header>

        {/* ---------- SCHEMATIC ---------- */}
        <div className="relative mt-14 sm:mt-16">
          <div
            className="tech-label mb-4 flex items-center gap-2"
            style={{
              color: "var(--color-runtime-ink-soft, #8b84a6)",
              fontFamily: "var(--font-display, inherit)",
              fontSize: "0.66rem",
              letterSpacing: "0.2em",
            }}
            aria-hidden="true"
          >
            <span
              className="hud-dot"
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "var(--color-signal, #8b67ff)",
                boxShadow: "0 0 8px var(--color-signal, #8b67ff)",
              }}
            />
            AICS-93 / PROCESS ROUTER
          </div>

          <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{
              border: "1px solid var(--color-runtime-line, #241f38)",
              background:
                "linear-gradient(180deg, rgba(20,17,32,0.55), rgba(10,9,18,0.2))",
            }}
          >
            <ProcessSVG
              nodes={nodes}
              energized={energized}
              coreLive={coreLive}
              reduced={rootStatic}
              pulseKey={pulseKey}
            />
          </div>

          {/* accessible textual description of the schematic */}
          <p className="sr-only">
            Схема: центральное ядро ИИ соединено с шестью узлами — маркетинг,
            контент, продажи, аналитика, поддержка и найм. Сигнал расходится из
            ядра к каждому узлу.
          </p>
        </div>

        {/* ---------- БЫЛО / СТАЛО ---------- */}
        <div className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-2 sm:gap-5">
          {/* было */}
          <div
            className="rounded-2xl p-6 sm:p-7"
            style={{
              border: "1px solid var(--color-runtime-line, #241f38)",
              background: "rgba(16,13,26,0.5)",
            }}
          >
            <div
              className="tech-label"
              style={{
                fontFamily: "var(--font-display, inherit)",
                fontSize: "0.68rem",
                letterSpacing: "0.24em",
                color: "var(--color-runtime-ink-soft, #8b84a6)",
              }}
            >
              БЫЛО
            </div>
            <ul
              className="mt-4 space-y-3 text-[0.95rem] leading-relaxed"
              style={{ color: "var(--color-runtime-ink-soft, #8b84a6)" }}
            >
              {["ручные процессы", "разрозненные данные", "решения «на глаз»"].map(
                (t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] inline-block h-px w-4 shrink-0"
                      style={{ background: "var(--color-runtime-line, #241f38)" }}
                    />
                    {t}
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* стало */}
          <div
            className="signal-glow relative overflow-hidden rounded-2xl p-6 sm:p-7"
            style={{
              border: "1px solid rgba(139,103,255,0.4)",
              background:
                "linear-gradient(180deg, rgba(139,103,255,0.1), rgba(200,86,255,0.04))",
            }}
          >
            <div
              className="tech-label"
              style={{
                fontFamily: "var(--font-display, inherit)",
                fontSize: "0.68rem",
                letterSpacing: "0.24em",
                color: "var(--color-signal, #8b67ff)",
              }}
            >
              СТАЛО
            </div>
            <ul
              className="mt-4 space-y-3 text-[0.95rem] leading-relaxed"
              style={{ color: "var(--color-runtime-ink, #e9e6f5)" }}
            >
              {["агенты в каждом узле", "единый поток данных", "решения на данных"].map(
                (t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.5em] inline-block h-[7px] w-[7px] shrink-0 rounded-full"
                      style={{
                        background:
                          "linear-gradient(92deg, var(--color-signal, #8b67ff), var(--color-signal-2, #c856ff))",
                        boxShadow: "0 0 10px rgba(139,103,255,0.9)",
                      }}
                    />
                    {t}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        {/* ---------- OUTCOME CHIPS ---------- */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-4 sm:gap-4">
          {(
            [
              { n: "−70%", l: "рутины" },
              { n: "×3", l: "скорость решений" },
              { n: "24/7", l: "агенты" },
              { n: "1", l: "источник правды" },
            ] as const
          ).map((m) => (
            <div
              key={m.l}
              className="rounded-xl px-4 py-5"
              style={{
                border: "1px solid var(--color-runtime-line, #241f38)",
                background: "rgba(16,13,26,0.45)",
              }}
            >
              <div
                className="signal-text text-2xl font-semibold sm:text-3xl"
                style={{
                  fontFamily: "var(--font-display, inherit)",
                  fontVariantNumeric: "tabular-nums",
                  background:
                    "linear-gradient(92deg, var(--color-signal, #8b67ff), var(--color-signal-2, #c856ff))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {m.n}
              </div>
              <div
                className="mt-1.5 text-[0.78rem] leading-snug"
                style={{ color: "var(--color-runtime-ink-soft, #8b84a6)" }}
              >
                {m.l}
              </div>
            </div>
          ))}
        </div>

        <p
          className="mt-5 text-[0.72rem]"
          style={{
            color: "var(--color-runtime-ink-soft, #8b84a6)",
            opacity: 0.7,
          }}
        >
          * Показатели иллюстративны и зависят от процессов конкретной компании.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * The SVG schematic. Pure presentational — driven by props.
 * ------------------------------------------------------------------ */

type NodeGeom = {
  dept: Dept;
  center: Pt;
  edge: Pt;
  start: Pt;
  len: number;
};

function ProcessSVG({
  nodes,
  energized,
  coreLive,
  reduced,
  pulseKey,
}: {
  nodes: NodeGeom[];
  energized: boolean[];
  coreLive: boolean;
  reduced: boolean;
  pulseKey: number;
}) {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="block h-auto w-full"
      role="img"
      aria-hidden="true"
      style={{ maxHeight: 620 }}
    >
      <defs>
        <linearGradient id="aip-trace" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-signal, #8b67ff)" />
          <stop offset="100%" stopColor="var(--color-signal-2, #c856ff)" />
        </linearGradient>
        <radialGradient id="aip-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-signal-2, #c856ff)" />
          <stop offset="55%" stopColor="var(--color-signal, #8b67ff)" />
          <stop offset="100%" stopColor="rgba(139,103,255,0)" />
        </radialGradient>
        <filter id="aip-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="aip-softglow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* faint concentric ring for depth */}
      <circle
        cx={CX}
        cy={CY}
        r={RING_R}
        fill="none"
        stroke="var(--color-runtime-line, #241f38)"
        strokeWidth={1}
        strokeDasharray="2 8"
        opacity={0.55}
      />

      {/* traces */}
      {nodes.map((n, i) => {
        const on = energized[i];
        const drawDur = 0.62;
        const drawDelay = 0.7 + i * 0.56;
        return (
          <g key={`trace-${n.dept.id}`}>
            {/* base rail */}
            <line
              x1={n.start.x}
              y1={n.start.y}
              x2={n.edge.x}
              y2={n.edge.y}
              stroke="var(--color-runtime-line, #241f38)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            {/* signal draw */}
            <line
              x1={n.start.x}
              y1={n.start.y}
              x2={n.edge.x}
              y2={n.edge.y}
              stroke="url(#aip-trace)"
              strokeWidth={2.4}
              strokeLinecap="round"
              filter="url(#aip-glow)"
              style={{
                strokeDasharray: n.len,
                strokeDashoffset: reduced ? 0 : on ? 0 : n.len,
                opacity: reduced ? 1 : on ? 1 : 0,
                transition: reduced
                  ? "none"
                  : `stroke-dashoffset ${drawDur}s cubic-bezier(0.4,0,0.2,1) ${
                      on ? 0 : drawDelay
                    }s, opacity 0.25s linear`,
              }}
            />
            {/* traveling pulse */}
            {!reduced && on && (
              <circle
                key={`pulse-${n.dept.id}-${pulseKey}`}
                r={3.4}
                fill="var(--color-signal-2, #c856ff)"
                filter="url(#aip-glow)"
              >
                <animateMotion
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                  path={`M ${n.start.x} ${n.start.y} L ${n.edge.x} ${n.edge.y}`}
                  keyPoints="0;1"
                  keyTimes="0;1"
                  calcMode="linear"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.12;0.82;1"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        );
      })}

      {/* department nodes */}
      {nodes.map((n, i) => (
        <DeptNode key={n.dept.id} geom={n} on={energized[i]} reduced={reduced} />
      ))}

      {/* ---- CORE ---- */}
      <g>
        {/* pulsing halo — scaled via transform (transitionable cross-browser) */}
        <circle
          cx={CX}
          cy={CY}
          r={96}
          fill="url(#aip-core)"
          filter="url(#aip-softglow)"
          opacity={coreLive ? 0.55 : 0.2}
          style={{
            transformOrigin: `${CX}px ${CY}px`,
            transformBox: "view-box",
            transform: coreLive ? "scale(1)" : "scale(0.625)",
            transition: reduced
              ? "none"
              : "transform 0.6s ease, opacity 0.6s ease",
          }}
        >
          {coreLive && !reduced && (
            <animate
              attributeName="opacity"
              values="0.42;0.62;0.42"
              dur="3.4s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* rotating ring accent */}
        <g
          style={{
            transformOrigin: `${CX}px ${CY}px`,
            animation:
              reduced || !coreLive ? "none" : "aip-spin 14s linear infinite",
          }}
        >
          <circle
            cx={CX}
            cy={CY}
            r={64}
            fill="none"
            stroke="url(#aip-trace)"
            strokeWidth={1.4}
            strokeDasharray="4 10"
            opacity={0.8}
          />
        </g>

        {/* core chip */}
        <circle
          cx={CX}
          cy={CY}
          r={50}
          fill="rgba(16,13,26,0.92)"
          stroke="url(#aip-trace)"
          strokeWidth={1.6}
        />
        <text
          x={CX}
          y={CY - 4}
          textAnchor="middle"
          fill="var(--color-runtime-ink, #e9e6f5)"
          style={{
            fontFamily: "var(--font-display, inherit)",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "0.08em",
          }}
        >
          AI ЯДРО
        </text>
        <text
          x={CX}
          y={CY + 14}
          textAnchor="middle"
          fill="var(--color-signal, #8b67ff)"
          style={{
            fontFamily: "var(--font-display, inherit)",
            fontSize: 8.5,
            letterSpacing: "0.22em",
          }}
        >
          CORE.00
        </text>
      </g>

      <style>{`
        @keyframes aip-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );
}

function DeptNode({
  geom,
  on,
  reduced,
}: {
  geom: NodeGeom;
  on: boolean;
  reduced: boolean;
}) {
  const { center, dept } = geom;
  const x = center.x - NODE_W / 2;
  const y = center.y - NODE_H / 2;

  return (
    <g style={{ transition: reduced ? "none" : "opacity 0.4s ease" }}>
      {/* halo when on */}
      {on && (
        <path
          d={chipPath(x - 4, y - 4, NODE_W + 8, NODE_H + 8, CUT + 2)}
          fill="none"
          stroke="url(#aip-trace)"
          strokeWidth={1.2}
          opacity={0.5}
          filter="url(#aip-softglow)"
        />
      )}

      <path
        d={chipPath(x, y, NODE_W, NODE_H, CUT)}
        fill={on ? "rgba(24,18,40,0.95)" : "rgba(16,13,26,0.9)"}
        stroke={on ? "url(#aip-trace)" : "var(--color-runtime-line, #241f38)"}
        strokeWidth={on ? 1.6 : 1.2}
        style={{
          transition: reduced ? "none" : "stroke 0.35s ease, fill 0.35s ease",
        }}
      />

      {/* label */}
      <text
        x={center.x - NODE_W / 2 + 14}
        y={center.y - 4}
        fill={
          on
            ? "var(--color-runtime-ink, #e9e6f5)"
            : "var(--color-runtime-ink-soft, #8b84a6)"
        }
        style={{
          fontFamily: "var(--font-sans, inherit)",
          fontSize: 13,
          fontWeight: 600,
          transition: reduced ? "none" : "fill 0.35s ease",
        }}
      >
        {dept.label}
      </text>

      {/* code */}
      <text
        x={center.x - NODE_W / 2 + 14}
        y={center.y + 14}
        fill={
          on
            ? "var(--color-signal, #8b67ff)"
            : "var(--color-runtime-ink-soft, #8b84a6)"
        }
        style={{
          fontFamily: "var(--font-display, inherit)",
          fontSize: 8,
          letterSpacing: "0.16em",
          transition: reduced ? "none" : "fill 0.35s ease",
        }}
      >
        {dept.code}
      </text>

      {/* status dot + text (once energized) */}
      <g
        style={{
          opacity: on ? 1 : 0,
          transition: reduced ? "none" : "opacity 0.4s ease 0.1s",
        }}
      >
        <circle
          cx={center.x + NODE_W / 2 - 40}
          cy={center.y + 10}
          r={2.6}
          fill="var(--color-signal-2, #c856ff)"
        >
          {on && !reduced && (
            <animate
              attributeName="opacity"
              values="1;0.35;1"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <text
          x={center.x + NODE_W / 2 - 34}
          y={center.y + 13}
          fill="var(--color-signal, #8b67ff)"
          style={{
            fontFamily: "var(--font-display, inherit)",
            fontSize: 7.5,
            letterSpacing: "0.1em",
          }}
        >
          online
        </text>
      </g>
    </g>
  );
}
