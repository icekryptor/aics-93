"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

type BootSequenceProps = {
  onDone?: () => void;
};

type Phase = "boot" | "glitch" | "done";

const STORAGE_KEY = "aics_booted";

const LOG_LINES: readonly string[] = [
  "initializing neural interface",
  "calibrating agent mesh",
  "linking cortex ⇄ silicon",
  "mounting knowledge base",
  "VASILY AISTOV // AICS-93 online",
];

const BOOT_MS = 2600;
const GLITCH_MS = 460;

const TRACES: readonly string[] = [
  "M40 60 H96 V96 H150",
  "M40 90 H70 V132 H150",
  "M40 120 H88 V120 H150",
  "M210 60 H164 V96 H110",
  "M210 90 H188 V132 H110",
  "M210 120 H172 V120 H110",
  "M96 150 V176 H130 V150",
  "M164 150 V176 H130",
];

type Pin = { x: number; y: number; v: boolean };

const PIN_POSITIONS: readonly Pin[] = (() => {
  const pins: Pin[] = [];
  const start = 70;
  const gap = 22;
  for (let i = 0; i < 5; i++) {
    const c = start + i * gap;
    pins.push({ x: c, y: 34, v: true });
    pins.push({ x: c, y: 208, v: true });
    pins.push({ x: 34, y: c, v: false });
    pins.push({ x: 208, y: c, v: false });
  }
  return pins;
})();

const BOOT_CSS = `
@keyframes aics-boot-scan {
  0%   { transform: translateY(-8%); opacity: 0; }
  8%   { opacity: 1; }
  92%  { opacity: 1; }
  100% { transform: translateY(108%); opacity: 0; }
}
@keyframes aics-boot-tear {
  0%   { transform: translateY(20%); opacity: 0; }
  40%  { transform: translateY(48%); opacity: 1; }
  60%  { transform: translateY(52%); opacity: 1; }
  100% { transform: translateY(60%); opacity: 0; }
}
`;

export default function BootSequence({ onDone }: BootSequenceProps) {
  const [phase, setPhase] = useState<Phase>("boot");
  const [progress, setProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [mounted, setMounted] = useState(false);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const doneCalledRef = useRef(false);
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stabilize onDone so the boot loop effect never restarts on prop identity change.
  const onDoneRef = useRef<BootSequenceProps["onDone"]>(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const clearTimers = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (glitchTimerRef.current !== null) {
      clearTimeout(glitchTimerRef.current);
      glitchTimerRef.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    if (doneCalledRef.current) return;
    doneCalledRef.current = true;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage may be unavailable (private mode) */
    }
    setPhase("done");
    onDoneRef.current?.();
  }, []);

  const skip = useCallback(() => {
    if (doneCalledRef.current) return;
    clearTimers();
    setProgress(100);
    setVisibleLines(LOG_LINES.length);
    setPhase("glitch");
    glitchTimerRef.current = setTimeout(finish, GLITCH_MS);
  }, [clearTimers, finish]);

  useEffect(() => {
    setMounted(true);

    let shouldSkip = false;
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY)) shouldSkip = true;
      // deep-link / share override: /?boot=0 skips the boot sequence
      if (new URLSearchParams(window.location.search).get("boot") === "0") shouldSkip = true;
    } catch {
      /* ignore */
    }

    let reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      /* ignore */
    }

    if (shouldSkip || reduce) {
      clearTimers();
      doneCalledRef.current = true;
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setPhase("done");
      onDoneRef.current?.();
      return;
    }

    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = t - startRef.current;
      const p = Math.min(1, elapsed / BOOT_MS);

      const eased = 1 - Math.pow(1 - p, 2.1);
      setProgress(Math.round(eased * 100));

      const lines = Math.min(
        LOG_LINES.length,
        Math.floor(p * (LOG_LINES.length + 0.35)),
      );
      setVisibleLines(lines);

      if (p >= 1) {
        setProgress(100);
        setVisibleLines(LOG_LINES.length);
        setPhase("glitch");
        rafRef.current = null;
        glitchTimerRef.current = setTimeout(finish, GLITCH_MS);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearTimers();
    };
  }, [clearTimers, finish]);

  useEffect(() => {
    if (phase === "done") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, skip]);

  if (phase === "done") return null;

  const isGlitch = phase === "glitch";
  const nameLit = progress >= 100;

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    opacity: isGlitch ? 0 : 1,
    transform: isGlitch ? "scale(1.012)" : "scale(1)",
    clipPath: isGlitch
      ? "polygon(0 0, 100% 0, 100% 42%, 96% 44%, 100% 46%, 100% 100%, 0 100%, 0 54%, 4% 52%, 0 50%)"
      : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    transition: isGlitch
      ? "opacity 420ms ease 40ms, transform 420ms ease 40ms, clip-path 220ms steps(2, end)"
      : "none",
    color: "var(--color-runtime-ink)",
    overflow: "hidden",
    contain: "strict",
  };

  return (
    <div
      className="runtime"
      style={overlayStyle}
      onClick={skip}
      role="presentation"
      aria-hidden="true"
    >
      <style>{BOOT_CSS}</style>

      <div className="runtime-grid" style={GRID_STYLE} />

      <div style={SCANLINE_WRAP}>
        <span
          style={{
            ...SCANLINE_STYLE,
            animationName: isGlitch ? "aics-boot-tear" : "aics-boot-scan",
            animationDuration: isGlitch ? "460ms" : "2.4s",
            animationTimingFunction: isGlitch ? "steps(3, end)" : "linear",
            animationIterationCount: isGlitch ? 1 : "infinite",
            height: isGlitch ? "4px" : "2px",
          }}
        />
      </div>

      <div style={CONTENT_STYLE}>
        <div style={CHIP_WRAP}>
          <ChipDie progress={progress} lit={nameLit} />
        </div>

        <div
          className="signal-text"
          style={{
            ...COUNTER_STYLE,
            transform: isGlitch && mounted ? "translateX(2px)" : "translateX(0)",
          }}
        >
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {String(progress).padStart(3, "0")}
          </span>
          <span style={COUNTER_PCT}>%</span>
        </div>

        <ol style={LOG_STYLE} className="hud tech-label">
          {LOG_LINES.map((line, i) => {
            const shown = i < visibleLines;
            const isName = i === LOG_LINES.length - 1;
            const lit = isName && shown && nameLit;
            return (
              <li
                key={line}
                style={{
                  ...LOG_LI,
                  opacity: shown ? 1 : 0,
                  transform: shown ? "translateY(0)" : "translateY(4px)",
                  color: lit
                    ? "var(--color-signal-2)"
                    : "var(--color-runtime-ink-soft)",
                  textShadow: lit ? "0 0 12px rgba(181, 123, 255,0.55)" : "none",
                  fontWeight: lit ? 600 : 400,
                }}
              >
                <span
                  className="hud-dot"
                  style={{
                    ...LOG_DOT,
                    background: shown
                      ? isName && lit
                        ? "var(--color-signal-2)"
                        : "var(--color-signal)"
                      : "var(--color-runtime-line)",
                  }}
                />
                <span>{line}</span>
              </li>
            );
          })}
        </ol>

        <div style={HINT_STYLE} className="tech-label">
          press esc / click to skip
        </div>
      </div>
    </div>
  );
}

function ChipDie({ progress, lit }: { progress: number; lit: boolean }) {
  const active = Math.floor((progress / 100) * TRACES.length);
  const glowOpacity = Math.min(1, progress / 100);

  return (
    <svg
      viewBox="0 0 250 250"
      width={200}
      height={200}
      role="img"
      aria-hidden="true"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <linearGradient id="aics-chip-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-signal)" />
          <stop offset="100%" stopColor="var(--color-signal-2)" />
        </linearGradient>
        <radialGradient id="aics-chip-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-signal-2)" stopOpacity="0.9" />
          <stop offset="55%" stopColor="var(--color-signal)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {PIN_POSITIONS.map((pin, i) => {
        const on = i < Math.floor((progress / 100) * PIN_POSITIONS.length);
        return (
          <rect
            key={`pin-${i}`}
            x={pin.v ? pin.x - 3 : pin.x - 8}
            y={pin.v ? pin.y - 8 : pin.y - 3}
            width={pin.v ? 6 : 16}
            height={pin.v ? 16 : 6}
            rx={1.5}
            fill={on ? "url(#aics-chip-grad)" : "var(--color-runtime-line)"}
            style={{ transition: "fill 200ms ease" }}
          />
        );
      })}

      <rect
        x={54}
        y={54}
        width={142}
        height={142}
        rx={18}
        fill="var(--color-runtime-2)"
        stroke="var(--color-runtime-line)"
        strokeWidth={1.5}
      />
      <rect
        x={54}
        y={54}
        width={142}
        height={142}
        rx={18}
        fill="none"
        stroke="url(#aics-chip-grad)"
        strokeWidth={1.5}
        strokeOpacity={glowOpacity * 0.85}
        style={{ transition: "stroke-opacity 240ms ease" }}
      />

      <circle
        cx={125}
        cy={125}
        r={40}
        fill="url(#aics-chip-core)"
        opacity={lit ? 1 : glowOpacity * 0.7}
        style={{ transition: "opacity 300ms ease" }}
      />

      {TRACES.map((d, i) => {
        const on = i < active;
        return (
          <path
            key={`trace-${i}`}
            d={d}
            fill="none"
            stroke="url(#aics-chip-grad)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={on ? 0 : 1}
            style={{
              transition: "stroke-dashoffset 320ms ease",
              opacity: on ? 1 : 0.25,
              filter: on
                ? "drop-shadow(0 0 4px rgba(151, 71, 255,0.6))"
                : "none",
            }}
          />
        );
      })}

      <circle
        cx={125}
        cy={125}
        r={7}
        fill="url(#aics-chip-grad)"
        opacity={glowOpacity}
        style={{ transition: "opacity 240ms ease" }}
      />
      {lit && (
        <circle
          cx={125}
          cy={125}
          r={7}
          fill="none"
          stroke="var(--color-signal-2)"
          strokeWidth={2}
          opacity={0.7}
        >
          <animate
            attributeName="r"
            from="7"
            to="26"
            dur="1.1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.7"
            to="0"
            dur="1.1s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );
}

const GRID_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  opacity: 0.5,
  pointerEvents: "none",
};

const SCANLINE_WRAP: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  overflow: "hidden",
  mixBlendMode: "screen",
};

const SCANLINE_STYLE: CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  height: "2px",
  background:
    "linear-gradient(90deg, transparent, rgba(151, 71, 255,0.55), rgba(181, 123, 255,0.7), transparent)",
  boxShadow: "0 0 18px rgba(151, 71, 255,0.5)",
  willChange: "transform, opacity",
};

const CONTENT_STYLE: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "18px",
  padding: "24px",
  maxWidth: "min(92vw, 520px)",
  width: "100%",
};

const CHIP_WRAP: CSSProperties = {
  filter: "drop-shadow(0 0 30px rgba(103,3,255,0.25))",
};

const COUNTER_STYLE: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: "clamp(48px, 12vw, 84px)",
  lineHeight: 1,
  letterSpacing: "-0.02em",
  display: "flex",
  alignItems: "baseline",
  gap: "4px",
  transition: "transform 120ms ease",
};

const COUNTER_PCT: CSSProperties = {
  fontSize: "0.32em",
  color: "var(--color-runtime-ink-soft)",
  letterSpacing: "0.05em",
};

const LOG_STYLE: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  width: "100%",
  maxWidth: "340px",
  display: "flex",
  flexDirection: "column",
  gap: "7px",
  fontSize: "12px",
  letterSpacing: "0.04em",
};

const LOG_LI: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  transition: "opacity 260ms ease, transform 260ms ease, color 200ms ease",
  whiteSpace: "nowrap",
};

const LOG_DOT: CSSProperties = {
  flex: "0 0 auto",
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  transition: "background 200ms ease",
};

const HINT_STYLE: CSSProperties = {
  marginTop: "4px",
  fontSize: "10px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--color-runtime-ink-soft)",
  opacity: 0.55,
};
