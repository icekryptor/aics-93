// Small 20×5 data-grid: squares fill with varied grey shades (purple in colour
// mode) and gently shimmer. Deterministic shades → no hydration mismatch.
const COLS = 20;
const ROWS = 5;
const N = COLS * ROWS;

function shade(i: number) {
  const x = Math.sin(i * 12.9898 + 4.1337) * 43758.5453;
  const f = x - Math.floor(x);
  return 0.16 + f * 0.66; // 0.16 .. 0.82
}

export default function StudioGrid({ className = "" }: { className?: string }) {
  return (
    <div
      className={`studio-grid ${className}`}
      style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      aria-hidden
    >
      {Array.from({ length: N }).map((_, i) => (
        <span
          key={i}
          className="studio-cell"
          style={
            {
              "--o": shade(i).toFixed(2),
              "--d": `${(i * 47) % 2200}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
