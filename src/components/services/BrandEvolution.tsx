"use client";

import { useEffect, useRef, useState } from "react";

/* BrandEvolution — аллегория эволюции бренда частицами (canvas-2d):
   ДНК (смыслы) → одноклеточные (концепция) → единорог (стиль) — отсылка
   к компании-единорогу. Клик — следующая стадия, авто-цикл 4.5с, пауза вне
   вьюпорта/при скрытой вкладке, reduced-motion — статичный единорог.
   Дебаг: ?evo=0|1|2 пинит стадию. */

const STAGES = ["смыслы", "концепция", "стиль"] as const;
const N = 720;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Pt = { x: number; y: number };

/* --- стадия 3: силуэт единорога (голова с рогом и гривой, смотрит вправо) --- */
const UNICORN: Pt[] = [
  { x: -0.34, y: 0.92 }, // низ шеи
  { x: 0.06, y: 0.92 },
  { x: 0.18, y: 0.66 }, // горло
  { x: 0.34, y: 0.52 }, // челюсть
  { x: 0.46, y: 0.44 },
  { x: 0.55, y: 0.36 }, // губа
  { x: 0.6, y: 0.26 }, // морда
  { x: 0.58, y: 0.16 },
  { x: 0.5, y: 0.1 }, // переносица
  { x: 0.4, y: 0.02 },
  { x: 0.32, y: -0.06 }, // лоб
  { x: 0.26, y: -0.12 }, // основание рога
  { x: 0.68, y: -0.72 }, // кончик рога
  { x: 0.16, y: -0.18 },
  { x: 0.12, y: -0.24 }, // перед уха
  { x: 0.04, y: -0.54 }, // кончик уха
  { x: -0.06, y: -0.26 },
  { x: -0.14, y: -0.24 }, // затылок
  { x: -0.24, y: -0.32 }, // грива — волны наружу/внутрь
  { x: -0.3, y: -0.18 },
  { x: -0.22, y: -0.08 },
  { x: -0.38, y: 0.02 },
  { x: -0.28, y: 0.14 },
  { x: -0.44, y: 0.26 },
  { x: -0.32, y: 0.38 },
  { x: -0.48, y: 0.5 },
  { x: -0.34, y: 0.62 },
  { x: -0.46, y: 0.76 },
];

function inPolygon(p: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

type Target = { x: number; y: number; horn: boolean };

function buildTargets(): { dna: Pt[]; cells: Pt[]; uni: Target[]; uniEdges: number } {
  const rng = mulberry32(0xa1c593);

  /* ДНК: двойная горизонтальная спираль + перекладины */
  const dna: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const kind = i % 8;
    const t = rng();
    const x = -0.92 + 1.84 * t;
    const ph = t * Math.PI * 4;
    if (kind < 3) {
      dna.push({ x, y: Math.sin(ph) * 0.42 + (rng() - 0.5) * 0.03 });
    } else if (kind < 6) {
      dna.push({ x, y: Math.sin(ph + Math.PI) * 0.42 + (rng() - 0.5) * 0.03 });
    } else {
      // перекладина: точка между нитями на «защёлкнутой» позиции
      const ts = Math.round(t * 22) / 22;
      const xs = -0.92 + 1.84 * ts;
      const phs = ts * Math.PI * 4;
      const y1 = Math.sin(phs) * 0.42;
      const y2 = Math.sin(phs + Math.PI) * 0.42;
      dna.push({ x: xs + (rng() - 0.5) * 0.015, y: y1 + (y2 - y1) * rng() });
    }
  }

  /* Клетки: 11 «одноклеточных» — мембрана + ядро + цитоплазма */
  const cells: Pt[] = [];
  const centers: { c: Pt; r: number }[] = [];
  let guard = 0;
  while (centers.length < 11 && guard++ < 400) {
    const c = { x: (rng() * 2 - 1) * 0.72, y: (rng() * 2 - 1) * 0.68 };
    const r = 0.13 + rng() * 0.1;
    if (centers.every((o) => Math.hypot(o.c.x - c.x, o.c.y - c.y) > o.r + r + 0.05)) {
      centers.push({ c, r });
    }
  }
  for (let i = 0; i < N; i++) {
    const cell = centers[i % centers.length];
    const u = rng();
    if (u < 0.58) {
      const a = rng() * Math.PI * 2;
      const rr = cell.r * (0.96 + rng() * 0.08);
      cells.push({ x: cell.c.x + Math.cos(a) * rr, y: cell.c.y + Math.sin(a) * rr });
    } else if (u < 0.82) {
      const a = rng() * Math.PI * 2;
      const rr = cell.r * 0.28 * Math.sqrt(rng());
      cells.push({ x: cell.c.x + 0.03 + Math.cos(a) * rr, y: cell.c.y - 0.02 + Math.sin(a) * rr });
    } else {
      const a = rng() * Math.PI * 2;
      const rr = cell.r * (0.4 + rng() * 0.5);
      cells.push({ x: cell.c.x + Math.cos(a) * rr, y: cell.c.y + Math.sin(a) * rr });
    }
  }

  /* Единорог: контур (по длине рёбер) + заливка (rejection sampling) */
  const uni: Target[] = [];
  const edges: { a: Pt; b: Pt; len: number }[] = [];
  let per = 0;
  for (let i = 0; i < UNICORN.length; i++) {
    const a = UNICORN[i];
    const b = UNICORN[(i + 1) % UNICORN.length];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    edges.push({ a, b, len });
    per += len;
  }
  const isHorn = (p: Pt) => p.x > 0.15 && p.y < -0.12;
  // контур доминирует — силуэт читается; заливка вторична
  const nEdge = Math.floor(N * 0.62);
  for (let i = 0; i < nEdge; i++) {
    let d = ((i + rng() * 0.7) / nEdge) * per;
    let e = 0;
    while (d > edges[e].len) {
      d -= edges[e].len;
      e++;
    }
    const { a, b, len } = edges[e];
    const t = d / len;
    const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    uni.push({ ...p, horn: isHorn(p) });
  }
  while (uni.length < N) {
    const p = { x: rng() * 2 - 1, y: rng() * 2 - 1 };
    if (inPolygon(p, UNICORN)) uni.push({ ...p, horn: isHorn(p) });
  }

  return { dna, cells, uni, uniEdges: nEdge };
}

export default function BrandEvolution({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);
  stageRef.current = stage;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rng = mulberry32(0x0093ec0);
    const { dna, cells, uni, uniEdges } = buildTargets();

    // дебаг: ?evo=N пинит стадию
    let pinned: number | null = null;
    try {
      const v = new URLSearchParams(window.location.search).get("evo");
      if (v !== null) pinned = Math.max(0, Math.min(2, Number(v) || 0));
    } catch {
      /* ignore */
    }
    if (pinned !== null) setStage(pinned);
    if (reduced && pinned === null) setStage(2);

    type P = {
      x: number;
      y: number;
      k: number;
      size: number;
      tw: number;
      ph: number;
      col: readonly [number, number, number];
    };
    const PALETTE = [
      [151, 71, 255],
      [181, 123, 255],
      [201, 182, 255],
      [239, 234, 255],
    ] as const;
    const CYAN = [95, 217, 245] as const;

    const parts: P[] = Array.from({ length: N }, (_, i) => ({
      x: dna[i].x + (rng() - 0.5) * 0.4,
      y: dna[i].y + (rng() - 0.5) * 0.4,
      k: 0.04 + rng() * 0.035,
      size: 0.9 + rng() * 1.7,
      tw: 0.5 + rng() * 1.1,
      ph: rng() * Math.PI * 2,
      col: PALETTE[Math.floor(rng() * PALETTE.length) % PALETTE.length],
    }));

    let W = 1;
    let H = 1;
    let raf = 0;
    let running = false;
    let intersecting = true;
    let last = 0;
    let t = 0;
    let autoT = 0;

    const targetOf = (i: number, s: number): Pt => (s === 0 ? dna[i] : s === 1 ? cells[i] : uni[i]);

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      const s = Math.min(W, H) * 0.42;
      const cx = W / 2;
      const cy = H / 2;
      const st = stageRef.current;
      for (let i = 0; i < N; i++) {
        const p = parts[i];
        const jx = Math.sin(t * p.tw + p.ph) * 0.006;
        const jy = Math.cos(t * p.tw * 0.8 + p.ph) * 0.006;
        let a = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(t * p.tw + p.ph * 1.7));
        const horned = st === 2 && uni[i].horn;
        // на стадии единорога контур ярче и крупнее, заливка приглушена
        let sizeMul = horned ? 1.25 : 1;
        if (st === 2) {
          if (i < uniEdges) sizeMul *= 1.15;
          else {
            sizeMul *= 0.62;
            a *= 0.6;
          }
        }
        const col = horned ? CYAN : p.col;
        ctx!.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a.toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(cx + (p.x + jx) * s, cy + (p.y + jy) * s, p.size * sizeMul, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function frame(now: number) {
      if (last === 0) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      if (pinned === null) {
        autoT += dt;
        if (autoT >= 4.5) {
          autoT = 0;
          setStage((v) => (v + 1) % 3);
        }
      }
      const st = stageRef.current;
      for (let i = 0; i < N; i++) {
        const p = parts[i];
        const tg = targetOf(i, st);
        p.x += (tg.x - p.x) * p.k;
        p.y += (tg.y - p.y) * p.k;
      }
      draw();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    }
    function sync() {
      if (intersecting && !document.hidden && !reduced) start();
      else stop();
    }

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = wrap!.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) {
        // статичный кадр: частицы сразу в целевой стадии
        const st = stageRef.current;
        for (let i = 0; i < N; i++) {
          const tg = targetOf(i, st);
          parts[i].x = tg.x;
          parts[i].y = tg.y;
        }
        t = 1;
      }
      draw();
    }

    const onClick = () => {
      if (pinned !== null) return;
      autoT = 0;
      setStage((v) => (v + 1) % 3);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(
      (es) => {
        intersecting = es[0]?.isIntersecting ?? true;
        sync();
      },
      { threshold: 0.05 }
    );
    io.observe(wrap);
    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);
    canvas.addEventListener("click", onClick);

    resize();
    sync();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("click", onClick);
    };
    // stageRef держит актуальную стадию — эффект намеренно одноразовый
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className ?? ""}`}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full cursor-pointer"
        role="img"
        aria-label="Эволюция бренда: смыслы → концепция → стиль (частицы: ДНК → клетки → единорог)"
      />
      {/* стадии */}
      <div className="pointer-events-none absolute inset-x-0 bottom-1 z-10 flex flex-col items-center gap-1">
        <p className="text-[12px] uppercase tracking-widest text-runtime-ink">
          {STAGES.map((s, i) => (
            <span key={s} className={i === stage ? "signal-text" : "opacity-30"}>
              {s}
              {i < STAGES.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
        <p className="tech-label text-[9px] text-runtime-ink-soft/70">
          [ клик — следующая стадия эволюции ]
        </p>
      </div>
    </div>
  );
}
