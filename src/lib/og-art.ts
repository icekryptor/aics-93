/**
 * og-art — deterministic flow-field art rendered to an SVG string.
 *
 * Mirrors the on-page <GenerativeCover> aesthetic (seeded mulberry32 + value
 * noise flow field over an accent-tinted dark base) but emits SVG instead of
 * canvas strokes, so it can be embedded in a Satori/`next/og` ImageResponse
 * (which cannot run canvas or WebGL). Same `seed` → same image.
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
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

type Opts = { seed: string; accent: string; w?: number; h?: number; density?: number };

export function flowFieldSvg({ seed, accent, w = 1200, h = 630, density = 1 }: Opts): string {
  const base = hashStr(seed);
  const [ar, ag, ab] = hexToRgb(accent);
  const palette: [number, number, number][] = [
    [ar, ag, ab],
    [181, 123, 255], // b57bff
    [201, 182, 255], // c9b6ff
    [239, 234, 255], // near-white sparks
  ];

  // seeded value noise (same as GenerativeCover)
  const vhash = (ix: number, iy: number) => {
    let hh = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263)) ^ base;
    hh = Math.imul(hh ^ (hh >>> 13), 1274126177);
    return ((hh >>> 0) % 100000) / 100000;
  };
  const vnoise = (x: number, y: number) => {
    const ix = Math.floor(x),
      iy = Math.floor(y);
    const fx = x - ix,
      fy = y - iy;
    const u = fx * fx * (3 - 2 * fx),
      v = fy * fy * (3 - 2 * fy);
    const a = vhash(ix, iy),
      b = vhash(ix + 1, iy),
      c = vhash(ix, iy + 1),
      d = vhash(ix + 1, iy + 1);
    return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
  };

  const rng = mulberry32(base ^ 0x51ed);
  const scale = 0.0016;
  const count = Math.round((w / 26) * density);
  const steps = 34;
  const stepLen = w / 150;

  const strokes: string[] = [];
  for (let p = 0; p < count; p++) {
    let x = rng() * w;
    let y = rng() * h;
    const ci = rng();
    const col =
      ci > 0.965 ? palette[3] : ci > 0.86 ? palette[1] : ci > 0.7 ? palette[2] : palette[0];
    const bright = ci > 0.965 ? 0.55 : 0.07 + rng() * 0.1;
    const width = (ci > 0.965 ? 1.8 : 1 + rng() * 1.1).toFixed(2);
    const pts: string[] = [`${x.toFixed(1)},${y.toFixed(1)}`];
    for (let s = 0; s < steps; s++) {
      const ang = vnoise(x * scale, y * scale) * Math.PI * 4;
      x += Math.cos(ang) * stepLen;
      y += Math.sin(ang) * stepLen;
      if (x < -30 || x > w + 30 || y < -30 || y > h + 30) break;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    if (pts.length < 2) continue;
    strokes.push(
      `<polyline points="${pts.join(" ")}" fill="none" stroke="rgba(${col[0]},${col[1]},${col[2]},${bright.toFixed(
        2,
      )})" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`,
    );
  }

  // bright signal nodes
  const nodeRng = mulberry32(base ^ 0x9a21);
  const nodes = Math.max(4, Math.round(w / 150));
  const nodeEls: string[] = [];
  for (let i = 0; i < nodes; i++) {
    const nx = (nodeRng() * w).toFixed(1);
    const ny = (nodeRng() * h).toFixed(1);
    const col = nodeRng() > 0.5 ? palette[0] : palette[1];
    const r = (10 + nodeRng() * 18).toFixed(1);
    nodeEls.push(
      `<circle cx="${nx}" cy="${ny}" r="${r}" fill="url(#nd${i})"/>` +
        `<radialGradient id="nd${i}" cx="50%" cy="50%" r="50%">` +
        `<stop offset="0%" stop-color="rgba(${col[0]},${col[1]},${col[2]},0.9)"/>` +
        `<stop offset="100%" stop-color="rgba(${col[0]},${col[1]},${col[2]},0)"/></radialGradient>`,
    );
  }

  const midR = Math.round(ar * 0.32 + 24),
    midG = Math.round(ag * 0.26 + 16),
    midB = Math.round(ab * 0.4 + 30);

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<defs><radialGradient id="bg" cx="78%" cy="10%" r="105%">` +
    `<stop offset="0%" stop-color="rgb(${ar},${ag},${ab})"/>` +
    `<stop offset="50%" stop-color="rgb(${midR},${midG},${midB})"/>` +
    `<stop offset="100%" stop-color="#171029"/></radialGradient></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#bg)"/>` +
    `<g>${strokes.join("")}</g>` +
    `<g>${nodeEls.join("")}</g>` +
    // subtle dark scrim at the bottom-left so overlaid title text stays legible
    `<rect width="${w}" height="${h}" fill="url(#scrim)"/>` +
    `<defs><linearGradient id="scrim" x1="0" y1="1" x2="0.6" y2="0">` +
    `<stop offset="0%" stop-color="rgba(11,7,20,0.72)"/>` +
    `<stop offset="100%" stop-color="rgba(11,7,20,0)"/></linearGradient></defs>` +
    `</svg>`
  );
}

/** data-URI form for use as a Satori `backgroundImage` / `<img src>`. */
export function flowFieldDataUri(opts: Opts): string {
  const svg = flowFieldSvg(opts);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
