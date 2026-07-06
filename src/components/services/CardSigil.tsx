/**
 * CardSigil — a small deterministic "data-glyph" generated from a seed string.
 * Pure SVG, server-rendered (no client JS, no hydration risk): every card gets
 * a unique techy sigil in its corner. Decorative (aria-hidden).
 */

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function mulberry32(a: number): () => number {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const C = 32;

export default function CardSigil({
  seed,
  className,
  stroke = "rgba(181,123,255,0.55)",
}: {
  seed: string;
  className?: string;
  stroke?: string;
}) {
  const rng = mulberry32(hashStr(seed));
  const ringR = 9 + rng() * 6;
  const spokes = 5 + Math.floor(rng() * 5);
  const rot = rng() * Math.PI * 2;

  // radial ticks
  const ticks: string[] = [];
  for (let i = 0; i < spokes; i++) {
    const a = rot + (i / spokes) * Math.PI * 2;
    const r0 = ringR + 2;
    const r1 = ringR + 3 + rng() * 6;
    ticks.push(
      `M ${(C + Math.cos(a) * r0).toFixed(1)} ${(C + Math.sin(a) * r0).toFixed(1)} L ${(C + Math.cos(a) * r1).toFixed(1)} ${(C + Math.sin(a) * r1).toFixed(1)}`,
    );
  }

  // a few satellite nodes wired to the core
  const sats = 2 + Math.floor(rng() * 2);
  const nodes: { x: number; y: number }[] = [];
  for (let i = 0; i < sats; i++) {
    const a = rng() * Math.PI * 2;
    const d = ringR + 8 + rng() * 9;
    nodes.push({ x: C + Math.cos(a) * d, y: C + Math.sin(a) * d });
  }

  // an arc accent on the ring
  const a0 = rng() * Math.PI * 2;
  const a1 = a0 + 0.8 + rng() * 1.4;
  const arc = `M ${(C + Math.cos(a0) * ringR).toFixed(1)} ${(C + Math.sin(a0) * ringR).toFixed(1)} A ${ringR.toFixed(1)} ${ringR.toFixed(1)} 0 0 1 ${(C + Math.cos(a1) * ringR).toFixed(1)} ${(C + Math.sin(a1) * ringR).toFixed(1)}`;

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      <circle cx={C} cy={C} r={ringR} stroke={stroke} strokeWidth="1" opacity="0.5" />
      <path d={arc} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d={ticks.join(" ")} stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      {nodes.map((n, i) => (
        <g key={i}>
          <line x1={C} y1={C} x2={n.x} y2={n.y} stroke={stroke} strokeWidth="0.8" opacity="0.35" />
          <circle cx={n.x} cy={n.y} r="1.6" fill={stroke} />
        </g>
      ))}
      <circle cx={C} cy={C} r="1.7" fill={stroke} />
    </svg>
  );
}
