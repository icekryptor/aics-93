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
        /* лабтех-лоадер: бар заполняется слева направо (scaleX по fill-box) */
        @keyframes pipeFill { 0% { transform: scaleX(0); } 88% { transform: scaleX(1); } 100% { transform: scaleX(1); } }
        @keyframes pipeTrail { 0%,100% { opacity: .35; } 50% { opacity: .9; } }
        @keyframes pipeBlink { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
        .pipe-fill { transform-box: fill-box; transform-origin: left center; animation: pipeFill 6s linear infinite; }
        .pipe-node { animation: pipeTrail 3.2s ease-in-out infinite; }
        .pipe-loading { animation: pipeBlink 1.2s steps(2, end) infinite; }
      `}</style>
      <svg viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full" role="img" aria-label="Схема процесса: этапы от брифа до аналитического сопровождения">
        <defs>
          <linearGradient id="pipeFillGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9747ff" />
            <stop offset="70%" stopColor="#b57bff" />
            <stop offset="100%" stopColor="#5fd9f5" />
          </linearGradient>
        </defs>

        {/* labtech loading readout */}
        <text
          className="pipe-loading"
          x={X0}
          y={14}
          fill="#5fd9f5"
          fontSize="11"
          fontFamily="var(--font-sans), sans-serif"
          letterSpacing="2.5"
          style={{ textTransform: "uppercase" }}
        >
          // loading
        </text>

        {/* track + заполняющийся прогресс-бар */}
        <rect
          x={X0}
          y={y - 3}
          width={travel}
          height={6}
          rx={3}
          fill="rgba(151,71,255,0.12)"
          stroke="rgba(151,71,255,0.32)"
          strokeWidth="1"
        />
        <rect
          className="pipe-fill"
          x={X0}
          y={y - 3}
          width={travel}
          height={6}
          rx={3}
          fill="url(#pipeFillGrad)"
        />

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
