/**
 * PipelineSchematic — a compact horizontal "signal pipeline" overview of the
 * process: numbered nodes wired along a trace with a light pulse travelling
 * through them. Pure SVG + scoped CSS (server-rendered, no client JS). The
 * global reduced-motion net in globals.css neutralises the animation.
 * Decorative overview — the detailed timeline below carries the real content.
 */

type Stage = { label: string };

const VW = 1000;
const VH = 104;
const X0 = 52;
const X1 = 948;

export default function PipelineSchematic({ stages }: { stages: Stage[] }) {
  const n = stages.length;
  const xs = stages.map((_, i) => (n === 1 ? (X0 + X1) / 2 : X0 + ((X1 - X0) * i) / (n - 1)));
  const y = 44;
  const travel = X1 - X0;

  return (
    <div className="w-full">
      <style>{`
        /* px in a transform on an SVG element = user units (verified: the pulse
           lands exactly on the last node at 480px and 1100px render widths), so
           this scales with the viewBox. Do NOT drop the unit — unitless
           translateX() is invalid CSS and would disable the animation. */
        @keyframes pipePulse { 0% { transform: translateX(0); } 100% { transform: translateX(${travel}px); } }
        @keyframes pipeTrail { 0%,100% { opacity: .35; } 50% { opacity: .9; } }
        .pipe-pulse { animation: pipePulse 6s linear infinite; }
        .pipe-node { animation: pipeTrail 3.2s ease-in-out infinite; }
      `}</style>
      <svg viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full" role="img" aria-label="Схема процесса: этапы от брифа до аналитического сопровождения">
        <defs>
          <linearGradient id="pipeLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9747ff" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#b57bff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#9747ff" stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id="pipeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#efeaff" stopOpacity="1" />
            <stop offset="35%" stopColor="#c9b6ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#9747ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* baseline trace */}
        <line x1={X0} y1={y} x2={X1} y2={y} stroke="url(#pipeLine)" strokeWidth="2" />

        {/* travelling pulse */}
        <g className="pipe-pulse">
          <circle cx={X0} cy={y} r="16" fill="url(#pipeGlow)" />
          <circle cx={X0} cy={y} r="3" fill="#efeaff" />
        </g>

        {/* nodes */}
        {xs.map((x, i) => (
          <g key={i}>
            <circle
              className="pipe-node"
              cx={x}
              cy={y}
              r="6"
              fill="rgba(151,71,255,0.18)"
              stroke="#b57bff"
              strokeWidth="1.4"
              style={{ animationDelay: `${(i * 0.28).toFixed(2)}s` }}
            />
            <text
              x={x}
              y={y - 18}
              textAnchor="middle"
              fill="#c9b6ff"
              fontSize="13"
              fontFamily="var(--font-display), monospace"
              letterSpacing="1"
            >
              {String(i + 1).padStart(2, "0")}
            </text>
            <text
              x={x}
              y={y + 34}
              textAnchor="middle"
              fill="#a99fce"
              fontSize="13"
              fontFamily="var(--font-sans), sans-serif"
            >
              {stages[i].label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
