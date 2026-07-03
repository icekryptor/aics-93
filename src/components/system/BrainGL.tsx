"use client";

import { useEffect, useRef, useState } from "react";
import BrainCanvas from "./BrainCanvas";

type BrainGLProps = {
  className?: string;
};

/* ------------------------------------------------------------------ */
/* Deterministic geometry                                               */
/* ------------------------------------------------------------------ */

const GRID_X = 24;
const GRID_Y = 10;
const GRID_Z = 24;
const POINT_COUNT = GRID_X * GRID_Y * GRID_Z; // 5760 points

/** Deterministic integer hash -> [0, 1). Same output on every load. */
function hash01(n: number): number {
  let x = (n + 0x9e3779b9) >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x21f0aaad) >>> 0;
  x ^= x >>> 15;
  x = Math.imul(x, 0x735a2d97) >>> 0;
  x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
}

function clampN(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function smoothstepN(e0: number, e1: number, x: number): number {
  const t = clampN((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Layered deterministic value-noise-ish sin products for gyri wrinkles. */
function wrinkle(x: number, y: number, z: number): number {
  return (
    Math.sin(x * 6.3 + Math.sin(z * 4.7 + 1.3)) *
      Math.sin(y * 5.1 + Math.sin(x * 3.9 + 0.7)) *
      0.55 +
    Math.sin(x * 11.4 + z * 9.2) * Math.sin(y * 10.3 + x * 7.6) * 0.3 +
    Math.sin(z * 16.2 + y * 13.7 + x * 5.5) * 0.15
  );
}

type Geometry = {
  p0: Float32Array; // biology — organic brain
  p1: Float32Array; // hybrid — right hemisphere on lattice
  p2: Float32Array; // machine — cubic chip-die lattice
  seed: Float32Array;
  shade: Float32Array; // 0 core → 1 cortex (dim interior, bright surface)
  // synapse segments (pairs of endpoints), morphing through the same 3 states
  lineP0: Float32Array;
  lineP1: Float32Array;
  lineP2: Float32Array;
  lineVertexCount: number;
};

let geometryCache: Geometry | null = null;

function buildGeometry(): Geometry {
  const n = POINT_COUNT;
  const p0 = new Float32Array(n * 3);
  const p1 = new Float32Array(n * 3);
  const p2 = new Float32Array(n * 3);
  const seed = new Float32Array(n);
  const shade = new Float32Array(n);
  const Q = 0.16; // hybrid quantization cell

  for (let i = 0; i < n; i++) {
    seed[i] = hash01(i * 7 + 5);

    /* --- state 0: BIOLOGY --- */
    const u = hash01(i * 7 + 1);
    const v = hash01(i * 7 + 2);
    const w = hash01(i * 7 + 3);
    const cosT = 2 * u - 1;
    const sinT = Math.sqrt(Math.max(0, 1 - cosT * cosT));
    const ph = 2 * Math.PI * v;
    const dx = sinT * Math.cos(ph);
    const dy = cosT;
    const dz = sinT * Math.sin(ph);
    // Almost all density on the cortex shell — readable surface, sparse core.
    const r = Math.pow(w, 0.11);
    const shell = smoothstepN(0.55, 1, r);
    shade[i] = 0.28 + 0.72 * shell;
    // gyri: banded folds wrapping the surface + finer wrinkle detail
    const fold =
      Math.sin(dx * 5.2 + dz * 8.8 + Math.sin(dy * 6.1) * 1.5) * 0.62 +
      Math.sin(dy * 11.3 + dx * 7.4 + dz * 3.1) * 0.38;
    const rr = r * (1 + shell * (0.105 * wrinkle(dx, dy, dz) + 0.08 * fold));
    let x = dx * rr * 0.8;
    let y = dy * rr * 0.72;
    const z = dz * rr * 1.02;
    if (y < 0) y *= 0.74; // flatter base
    x *= 1 - 0.16 * Math.max(0, z); // frontal taper
    const side = x >= 0 ? 1 : -1;
    x = side * (Math.abs(x) * 0.94 + 0.05); // sagittal gap between lobes
    y += 0.05;
    p0[i * 3] = x;
    p0[i * 3 + 1] = y;
    p0[i * 3 + 2] = z;

    /* --- state 1: HYBRID — right hemisphere snaps to a lattice --- */
    if (x > 0) {
      p1[i * 3] = Math.round(x / Q) * Q;
      p1[i * 3 + 1] = Math.round(y / Q) * Q;
      p1[i * 3 + 2] = Math.round(z / Q) * Q;
    } else {
      p1[i * 3] = x;
      p1[i * 3 + 1] = y;
      p1[i * 3 + 2] = z;
    }

    /* --- state 2: MACHINE — ordered cubic slab / chip die --- */
    // Deterministic bijective permutation so the morph doesn't sweep in raster order.
    const j = (i * 2654435761) % n; // gcd(2654435761, 5760) === 1
    const ix = j % GRID_X;
    const iy = Math.floor(j / GRID_X) % GRID_Y;
    const iz = Math.floor(j / (GRID_X * GRID_Y));
    p2[i * 3] = (ix / (GRID_X - 1) - 0.5) * 2.15;
    p2[i * 3 + 1] = (iy / (GRID_Y - 1) - 0.5) * 0.72;
    p2[i * 3 + 2] = (iz / (GRID_Z - 1) - 0.5) * 2.15;
  }

  /* --- synapses: connect near cortex neighbours (deterministic) --- */
  const CELLC = 0.15; // neighbour search radius / hash cell
  const buckets = new Map<string, number[]>();
  const keyOf = (x: number, y: number, z: number) =>
    Math.floor(x / CELLC) + "," + Math.floor(y / CELLC) + "," + Math.floor(z / CELLC);
  for (let i = 0; i < n; i++) {
    if (shade[i] < 0.82) continue; // cortex only
    const k = keyOf(p0[i * 3], p0[i * 3 + 1], p0[i * 3 + 2]);
    let arr = buckets.get(k);
    if (!arr) {
      arr = [];
      buckets.set(k, arr);
    }
    arr.push(i);
  }
  const edges: number[] = [];
  const seen = new Set<number>();
  const MAX_EDGES = 900;
  outer: for (const [k, arr] of buckets) {
    const [cx, cy, cz] = k.split(",").map(Number);
    for (const i of arr) {
      let best = -1;
      let bestD = CELLC * CELLC;
      for (let ox = -1; ox <= 1; ox++)
        for (let oy = -1; oy <= 1; oy++)
          for (let oz = -1; oz <= 1; oz++) {
            const nb = buckets.get(cx + ox + "," + (cy + oy) + "," + (cz + oz));
            if (!nb) continue;
            for (const j of nb) {
              if (j === i) continue;
              const dx2 = p0[i * 3] - p0[j * 3];
              const dy2 = p0[i * 3 + 1] - p0[j * 3 + 1];
              const dz2 = p0[i * 3 + 2] - p0[j * 3 + 2];
              const d = dx2 * dx2 + dy2 * dy2 + dz2 * dz2;
              if (d > 0.0004 && d < bestD) {
                bestD = d;
                best = j;
              }
            }
          }
      if (best >= 0) {
        const a = Math.min(i, best);
        const b = Math.max(i, best);
        const pairKey = a * n + b;
        if (!seen.has(pairKey)) {
          seen.add(pairKey);
          edges.push(a, b);
          if (edges.length / 2 >= MAX_EDGES) break outer;
        }
      }
    }
  }
  const E = edges.length; // vertex count = edges array length (2 per segment)
  const lineP0 = new Float32Array(E * 3);
  const lineP1 = new Float32Array(E * 3);
  const lineP2 = new Float32Array(E * 3);
  for (let v2 = 0; v2 < E; v2++) {
    const src = edges[v2] * 3;
    lineP0[v2 * 3] = p0[src];
    lineP0[v2 * 3 + 1] = p0[src + 1];
    lineP0[v2 * 3 + 2] = p0[src + 2];
    lineP1[v2 * 3] = p1[src];
    lineP1[v2 * 3 + 1] = p1[src + 1];
    lineP1[v2 * 3 + 2] = p1[src + 2];
    lineP2[v2 * 3] = p2[src];
    lineP2[v2 * 3 + 1] = p2[src + 1];
    lineP2[v2 * 3 + 2] = p2[src + 2];
  }

  return { p0, p1, p2, seed, shade, lineP0, lineP1, lineP2, lineVertexCount: E };
}

function getGeometry(): Geometry {
  if (!geometryCache) geometryCache = buildGeometry();
  return geometryCache;
}

/* ------------------------------------------------------------------ */
/* Shaders                                                              */
/* ------------------------------------------------------------------ */

const VERT_SRC = `
attribute vec3 a_pos0;
attribute vec3 a_pos1;
attribute vec3 a_pos2;
attribute float a_seed;
attribute float a_shade;
uniform mat4 u_proj;
uniform float u_m01;
uniform float u_m12;
uniform float u_yaw;
uniform float u_pitch;
uniform float u_scale;
uniform float u_dpr;
varying float v_near;
varying float v_seed;
varying float v_shade;
varying float v_machine;
varying float v_rim;
void main() {
  vec3 p = mix(mix(a_pos0, a_pos1, u_m01), a_pos2, u_m12) * u_scale;
  float cy = cos(u_yaw);
  float sy = sin(u_yaw);
  vec3 q = vec3(p.x * cy + p.z * sy, p.y, p.z * cy - p.x * sy);
  float cx = cos(u_pitch);
  float sx = sin(u_pitch);
  q = vec3(q.x, q.y * cx - q.z * sx, q.y * sx + q.z * cx);
  float near = clamp((q.z + 1.4) / 2.8, 0.0, 1.0);
  // machine state shades uniformly (chip die), organic keeps cortex/core depth
  float sh = mix(a_shade, 1.0, u_m12);
  // silhouette rim: shell points whose direction is ⟂ to the view axis form
  // the visible outline of the brain — brighten them (organic states only)
  vec3 nrm = q / max(length(q), 0.0001);
  float rim = pow(1.0 - abs(nrm.z), 3.0) * a_shade;
  v_rim = rim * (1.0 - u_m12);
  gl_Position = u_proj * vec4(q.x, q.y, q.z - 3.0, 1.0);
  gl_PointSize = clamp(u_dpr * mix(2.2, 5.5, near) * mix(0.75, 1.12, sh) * (1.0 + v_rim * 0.35), 1.0, 60.0);
  v_near = near;
  v_seed = a_seed;
  v_shade = sh;
  v_machine = u_m12;
}
`;

const FRAG_SRC = `
precision mediump float;
varying float v_near;
varying float v_seed;
varying float v_shade;
varying float v_machine;
varying float v_rim;
uniform float u_pointer;
uniform float u_time;
void main() {
  vec2 d = gl_PointCoord - vec2(0.5);
  float r2 = dot(d, d);
  if (r2 > 0.25) discard;
  // NOTE: smoothstep(edge0, edge1, x) with edge0 > edge1 is UNDEFINED in
  // GLSL ES 1.00 — invert the result of a well-ordered call instead.
  float fall = 1.0 - smoothstep(0.0, 0.25, r2);
  vec3 deep = vec3(0.592, 0.278, 1.0);
  vec3 mid  = vec3(0.710, 0.482, 1.0);
  vec3 soft = vec3(0.788, 0.714, 1.0);
  vec3 ink  = vec3(0.937, 0.918, 1.0);
  vec3 lime = vec3(0.773, 1.0, 0.267);
  vec3 col = mix(deep, soft, v_near);
  float a = 0.26 + 0.5 * v_near;
  if (v_seed > 0.985) {
    col = ink;
    a = 0.78;
  } else if (v_seed > 0.9) {
    col = mid;
    a = 0.58;
  }
  // dim core / bright cortex (uniform in machine state via v_shade→1)
  a *= mix(0.35, 1.0, v_shade);
  // glowing silhouette outline — makes the brain contour read instantly
  a *= 1.0 + v_rim * 1.1;
  col = mix(col, soft, clamp(v_rim, 0.0, 1.0) * 0.5);
  // MACHINE: lattice points blink like chip registers
  float reg = fract(v_seed * 61.7);
  float regMask = step(0.6, reg);
  float blinkOn = step(0.5, fract(u_time * (0.8 + reg * 2.8) + reg * 17.0));
  a *= mix(1.0, mix(0.3, 1.1, blinkOn), v_machine * regMask);
  // the hottest registers flash constructive lime
  col = mix(col, lime, v_machine * step(0.94, reg) * blinkOn * 0.85);
  a *= fall * (1.0 + 0.3 * u_pointer);
  a *= 0.74; // global dim — the brain should glow, not blind
  gl_FragColor = vec4(col * a, a);
}
`;

// synapse lines — same transform, flat translucent violet, fade toward machine
const LINE_VERT_SRC = `
attribute vec3 a_p0;
attribute vec3 a_p1;
attribute vec3 a_p2;
uniform mat4 u_proj;
uniform float u_m01;
uniform float u_m12;
uniform float u_yaw;
uniform float u_pitch;
uniform float u_scale;
varying float v_near;
varying float v_machine;
void main() {
  vec3 p = mix(mix(a_p0, a_p1, u_m01), a_p2, u_m12) * u_scale;
  float cy = cos(u_yaw);
  float sy = sin(u_yaw);
  vec3 q = vec3(p.x * cy + p.z * sy, p.y, p.z * cy - p.x * sy);
  float cx = cos(u_pitch);
  float sx = sin(u_pitch);
  q = vec3(q.x, q.y * cx - q.z * sx, q.y * sx + q.z * cx);
  float near = clamp((q.z + 1.4) / 2.8, 0.0, 1.0);
  gl_Position = u_proj * vec4(q.x, q.y, q.z - 3.0, 1.0);
  v_near = near;
  v_machine = u_m12;
}
`;

const LINE_FRAG_SRC = `
precision mediump float;
varying float v_near;
varying float v_machine;
void main() {
  vec3 deep = vec3(0.592, 0.278, 1.0);
  vec3 soft = vec3(0.788, 0.714, 1.0);
  vec3 col = mix(deep, soft, v_near);
  float a = (0.04 + 0.09 * v_near) * (1.0 - v_machine * 0.7);
  gl_FragColor = vec4(col * a, a);
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS) && !gl.isContextLost()) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/** Column-major perspective projection, written into `out` (no allocation). */
function perspective(
  out: Float32Array,
  fovY: number,
  aspect: number,
  near: number,
  far: number
): void {
  const f = 1 / Math.tan(fovY / 2);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) / (near - far);
  out[11] = -1;
  out[14] = (2 * far * near) / (near - far);
}

type UniformLocs = {
  proj: WebGLUniformLocation;
  m01: WebGLUniformLocation;
  m12: WebGLUniformLocation;
  yaw: WebGLUniformLocation;
  pitch: WebGLUniformLocation;
  scale: WebGLUniformLocation;
  dpr: WebGLUniformLocation;
  pointer: WebGLUniformLocation;
  time: WebGLUniformLocation;
};

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export default function BrainGL({ className }: BrainGLProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let disposed = false;
    let raf = 0;
    let contextLost = false;
    let pageVisible = !document.hidden;
    let onScreen = true;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const fail = () => {
      if (!disposed) setFailed(true);
    };

    /* --- context --- */
    let gl: WebGLRenderingContext | null = null;
    try {
      const attrs: WebGLContextAttributes = {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: true,
        powerPreference: "high-performance",
      };
      gl = canvas.getContext("webgl", attrs) as WebGLRenderingContext | null;
      if (!gl) {
        gl = canvas.getContext(
          "experimental-webgl",
          attrs
        ) as WebGLRenderingContext | null;
      }
    } catch {
      gl = null;
    }
    if (!gl) {
      fail();
      return;
    }
    const ctx: WebGLRenderingContext = gl;

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const onContextRestored = () => {
      // Full re-init: bump the epoch so this effect re-runs from scratch.
      setEpoch((prev) => prev + 1);
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);

    const baseCleanup = () => {
      canvas.removeEventListener("webglcontextlost", onContextLost, false);
      canvas.removeEventListener(
        "webglcontextrestored",
        onContextRestored,
        false
      );
    };

    /* --- programs + static buffers --- */
    let program: WebGLProgram | null = null;
    let lineProgram: WebGLProgram | null = null;
    const buffers: WebGLBuffer[] = [];
    type Binding = { loc: number; buf: WebGLBuffer; size: number };
    const pointBindings: Binding[] = [];
    const lineBindings: Binding[] = [];
    let lineVertexCount = 0;
    let lineLocs: {
      proj: WebGLUniformLocation;
      m01: WebGLUniformLocation;
      m12: WebGLUniformLocation;
      yaw: WebGLUniformLocation;
      pitch: WebGLUniformLocation;
      scale: WebGLUniformLocation;
    } | null = null;
    let dprNow = 1;

    const disposeGL = () => {
      if (ctx.isContextLost()) return;
      for (const b of buffers) ctx.deleteBuffer(b);
      if (program) ctx.deleteProgram(program);
      if (lineProgram) ctx.deleteProgram(lineProgram);
    };

    const makeProgram = (vsSrc: string, fsSrc: string): WebGLProgram | null => {
      const vs = compileShader(ctx, ctx.VERTEX_SHADER, vsSrc);
      if (!vs) return null;
      const fs = compileShader(ctx, ctx.FRAGMENT_SHADER, fsSrc);
      if (!fs) {
        ctx.deleteShader(vs);
        return null;
      }
      const prog = ctx.createProgram();
      if (!prog) {
        ctx.deleteShader(vs);
        ctx.deleteShader(fs);
        return null;
      }
      ctx.attachShader(prog, vs);
      ctx.attachShader(prog, fs);
      ctx.linkProgram(prog);
      ctx.deleteShader(vs);
      ctx.deleteShader(fs);
      if (!ctx.getProgramParameter(prog, ctx.LINK_STATUS)) {
        ctx.deleteProgram(prog);
        return null;
      }
      return prog;
    };

    const makeAttrib = (
      prog: WebGLProgram,
      name: string,
      data: Float32Array,
      size: number,
      into: Binding[]
    ): boolean => {
      const loc = ctx.getAttribLocation(prog, name);
      if (loc < 0) return false;
      const buf = ctx.createBuffer();
      if (!buf) return false;
      buffers.push(buf);
      ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
      ctx.bufferData(ctx.ARRAY_BUFFER, data as BufferSource, ctx.STATIC_DRAW);
      into.push({ loc, buf, size });
      return true;
    };

    const bindAll = (bindings: Binding[]) => {
      for (const b of bindings) {
        ctx.bindBuffer(ctx.ARRAY_BUFFER, b.buf);
        ctx.vertexAttribPointer(b.loc, b.size, ctx.FLOAT, false, 0, 0);
        ctx.enableVertexAttribArray(b.loc);
      }
    };

    const init = (): UniformLocs | null => {
      const prog = makeProgram(VERT_SRC, FRAG_SRC);
      if (!prog) return null;
      program = prog;
      ctx.useProgram(prog);

      const geo = getGeometry();
      if (
        !makeAttrib(prog, "a_pos0", geo.p0, 3, pointBindings) ||
        !makeAttrib(prog, "a_pos1", geo.p1, 3, pointBindings) ||
        !makeAttrib(prog, "a_pos2", geo.p2, 3, pointBindings) ||
        !makeAttrib(prog, "a_seed", geo.seed, 1, pointBindings) ||
        !makeAttrib(prog, "a_shade", geo.shade, 1, pointBindings)
      ) {
        return null;
      }

      // synapse line program (optional — points still render if it fails)
      const lp = makeProgram(LINE_VERT_SRC, LINE_FRAG_SRC);
      if (lp) {
        const okLines =
          makeAttrib(lp, "a_p0", geo.lineP0, 3, lineBindings) &&
          makeAttrib(lp, "a_p1", geo.lineP1, 3, lineBindings) &&
          makeAttrib(lp, "a_p2", geo.lineP2, 3, lineBindings);
        const lProj = ctx.getUniformLocation(lp, "u_proj");
        const lM01 = ctx.getUniformLocation(lp, "u_m01");
        const lM12 = ctx.getUniformLocation(lp, "u_m12");
        const lYaw = ctx.getUniformLocation(lp, "u_yaw");
        const lPitch = ctx.getUniformLocation(lp, "u_pitch");
        const lScale = ctx.getUniformLocation(lp, "u_scale");
        if (okLines && lProj && lM01 && lM12 && lYaw && lPitch && lScale) {
          lineProgram = lp;
          lineVertexCount = geo.lineVertexCount;
          lineLocs = { proj: lProj, m01: lM01, m12: lM12, yaw: lYaw, pitch: lPitch, scale: lScale };
        } else {
          ctx.deleteProgram(lp);
        }
      }
      ctx.useProgram(prog);

      const uProj = ctx.getUniformLocation(prog, "u_proj");
      const uM01 = ctx.getUniformLocation(prog, "u_m01");
      const uM12 = ctx.getUniformLocation(prog, "u_m12");
      const uYaw = ctx.getUniformLocation(prog, "u_yaw");
      const uPitch = ctx.getUniformLocation(prog, "u_pitch");
      const uScale = ctx.getUniformLocation(prog, "u_scale");
      const uDpr = ctx.getUniformLocation(prog, "u_dpr");
      const uPointer = ctx.getUniformLocation(prog, "u_pointer");
      const uTime = ctx.getUniformLocation(prog, "u_time");
      if (
        !uProj ||
        !uM01 ||
        !uM12 ||
        !uYaw ||
        !uPitch ||
        !uScale ||
        !uDpr ||
        !uPointer ||
        !uTime
      ) {
        return null;
      }

      ctx.disable(ctx.DEPTH_TEST);
      ctx.enable(ctx.BLEND);
      ctx.blendFunc(ctx.ONE, ctx.ONE); // premultiplied additive glow on dark bg

      return {
        proj: uProj,
        m01: uM01,
        m12: uM12,
        yaw: uYaw,
        pitch: uPitch,
        scale: uScale,
        dpr: uDpr,
        pointer: uPointer,
        time: uTime,
      };
    };

    const locs = init();
    if (!locs) {
      if (!ctx.isContextLost()) fail();
      return () => {
        disposed = true;
        baseCleanup();
        disposeGL();
      };
    }

    /* --- animation state (closure vars; no per-frame allocation) --- */
    let lastNow = -1;
    let t = 0;
    let rot = 0; // integrated yaw so speed changes never jump the angle
    let m01 = 0;
    let m12 = 0;
    let m01Target = 0;
    let m12Target = 0;
    let yawOff = 0;
    let pitchOff = 0;
    let yawTarget = 0;
    let pitchTarget = 0;
    let pointerS = 0;
    let pointerTarget = 0;
    let px = 0;
    let py = 0;
    let hasPointer = false;
    let scrollDirty = true;
    let centerX = 0;
    let centerY = 0;
    let halfDiag = 1;
    const projMat = new Float32Array(16);

    const shouldRun = () =>
      !reducedMotion && !contextLost && pageVisible && onScreen && !disposed;

    // click-to-morph override: -1 = scroll-driven; 0/1/2 = pinned state
    let override = -1;
    let overrideScrollY = 0;
    let lastState = -1;
    // idle showcase: at the top of the hero, auto-cycle states every 5s
    let autoState = 0;
    let autoT = 0;
    let lastP = 0;

    const dispatchState = () => {
      const s = m12Target > 0.5 ? 2 : m01Target > 0.5 ? 1 : 0;
      if (s !== lastState) {
        lastState = s;
        try {
          window.dispatchEvent(new CustomEvent("aics:brainstate", { detail: s }));
        } catch {
          /* ignore */
        }
      }
    };

    const updateRect = () => {
      const r = wrap.getBoundingClientRect();
      centerX = r.left + r.width / 2;
      centerY = r.top + r.height / 2;
      halfDiag = Math.sqrt(r.width * r.width + r.height * r.height) / 2;
      // scrolling away releases a click-pinned state back to scroll control
      if (override >= 0 && Math.abs(window.scrollY - overrideScrollY) > 120) {
        override = -1;
      }
      const p = clampN(-r.top / Math.max(1, r.height * 0.85), 0, 1);
      lastP = p;
      if (override < 0) {
        if (p < 0.06) {
          // idle at the top — the 5s auto-showcase drives the state
          m01Target = autoState >= 1 ? 1 : 0;
          m12Target = autoState >= 2 ? 1 : 0;
        } else {
          m01Target = smoothstepN(0, 0.55, p);
          m12Target = smoothstepN(0.55, 1, p);
        }
      } else {
        m01Target = override >= 1 ? 1 : 0;
        m12Target = override >= 2 ? 1 : 0;
      }
      dispatchState();
    };

    // click anywhere over the brain (non-interactive targets) cycles the state
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        typeof target.closest === "function" &&
        target.closest("a, button, input, textarea, select, [role='button']")
      )
        return;
      const r = wrap.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        return;
      const cur =
        override >= 0 ? override : m12Target > 0.5 ? 2 : m01Target > 0.5 ? 1 : 0;
      override = (cur + 1) % 3;
      overrideScrollY = window.scrollY;
      autoState = override; // auto-showcase continues from the clicked state
      autoT = 0;
      updateRect();
    };
    window.addEventListener("click", onClick);

    const draw = (yaw: number, pitch: number, scale: number) => {
      ctx.clearColor(0, 0, 0, 0);
      ctx.clear(ctx.COLOR_BUFFER_BIT);
      // synapses first (points render on top)
      if (lineProgram && lineLocs && lineVertexCount > 0) {
        ctx.useProgram(lineProgram);
        bindAll(lineBindings);
        ctx.uniformMatrix4fv(lineLocs.proj, false, projMat);
        ctx.uniform1f(lineLocs.m01, m01);
        ctx.uniform1f(lineLocs.m12, m12);
        ctx.uniform1f(lineLocs.yaw, yaw);
        ctx.uniform1f(lineLocs.pitch, pitch);
        ctx.uniform1f(lineLocs.scale, scale);
        ctx.drawArrays(ctx.LINES, 0, lineVertexCount);
      }
      ctx.useProgram(program);
      bindAll(pointBindings);
      ctx.uniformMatrix4fv(locs.proj, false, projMat);
      ctx.uniform1f(locs.dpr, dprNow);
      ctx.uniform1f(locs.m01, m01);
      ctx.uniform1f(locs.m12, m12);
      ctx.uniform1f(locs.yaw, yaw);
      ctx.uniform1f(locs.pitch, pitch);
      ctx.uniform1f(locs.scale, scale);
      ctx.uniform1f(locs.pointer, pointerS);
      ctx.uniform1f(locs.time, t);
      ctx.drawArrays(ctx.POINTS, 0, POINT_COUNT);
    };

    // Static frame for prefers-reduced-motion: mid "hybrid" state, no loop.
    const renderStatic = () => {
      m01 = 1;
      m12 = 0;
      pointerS = 0;
      draw(0.55, -0.18, 0.94);
    };

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w < 2 || h < 2) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const bw = Math.round(w * dpr);
      const bh = Math.round(h * dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      ctx.viewport(0, 0, bw, bh);
      perspective(projMat, (34 * Math.PI) / 180, bw / bh, 0.1, 20);
      dprNow = dpr;
      scrollDirty = true;
      if (reducedMotion) {
        updateRect();
        renderStatic();
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!shouldRun()) return;
      if (lastNow < 0) lastNow = now;
      const dt = Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;
      t += dt;

      if (scrollDirty) {
        scrollDirty = false;
        updateRect();
      }

      // 5s auto-showcase while idle at the top of the hero
      autoT += dt;
      if (autoT >= 5) {
        autoT = 0;
        if (override < 0 && lastP < 0.06) {
          autoState = (autoState + 1) % 3;
          updateRect();
        }
      }

      if (coarse) {
        // No cursor influence on touch devices — gentle autonomous drift.
        yawTarget = Math.sin(t * 0.21) * 0.07;
        pitchTarget = Math.cos(t * 0.17) * 0.045;
        pointerTarget = 0;
      } else if (hasPointer) {
        const vw = window.innerWidth || 1;
        const vh = window.innerHeight || 1;
        yawTarget = clampN((px / vw - 0.5) * 0.5, -0.22, 0.22);
        pitchTarget = clampN((py / vh - 0.5) * 0.5, -0.22, 0.22);
        const ddx = px - centerX;
        const ddy = py - centerY;
        pointerTarget = Math.max(
          0,
          1 - Math.sqrt(ddx * ddx + ddy * ddy) / Math.max(1, halfDiag * 1.4)
        );
      }

      m01 += (m01Target - m01) * 0.16;
      m12 += (m12Target - m12) * 0.16;
      yawOff += (yawTarget - yawOff) * 0.18;
      pitchOff += (pitchTarget - pitchOff) * 0.18;
      pointerS += (pointerTarget - pointerS) * 0.16;

      // machine state settles: rotation slows to a near-stop
      rot += dt * 0.05 * (1 - m12 * 0.72);
      const breathe = 1 + 0.018 * Math.sin(t * 0.85);
      draw(rot + yawOff, -0.18 + pitchOff, breathe * 0.94);

      raf = requestAnimationFrame(frame);
    };

    const startLoop = () => {
      if (raf === 0 && shouldRun()) {
        lastNow = -1;
        raf = requestAnimationFrame(frame);
      }
    };
    const stopLoop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    /* --- wiring --- */
    resize();
    updateRect();
    m01 = m01Target;
    m12 = m12Target;

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    if (reducedMotion) {
      renderStatic();
      return () => {
        disposed = true;
        ro.disconnect();
        window.removeEventListener("click", onClick);
        baseCleanup();
        disposeGL();
      };
    }

    // Scroll + pointer are consumed inside the rAF loop (rAF-throttled).
    const onScroll = () => {
      scrollDirty = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onPointerMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      hasPointer = true;
    };
    if (!coarse) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible) startLoop();
      else stopLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver((entries) => {
        const entry = entries[entries.length - 1];
        if (entry) {
          onScreen = entry.isIntersecting;
          if (onScreen) startLoop();
          else stopLoop();
        }
      });
      io.observe(wrap);
    }

    startLoop();

    return () => {
      disposed = true;
      stopLoop();
      ro.disconnect();
      if (io) io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
      if (!coarse) window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      baseCleanup();
      disposeGL();
    };
  }, [epoch]);

  if (failed) {
    return <BrainCanvas {...(className !== undefined ? { className } : {})} />;
  }

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={
        className ? `relative h-full w-full ${className}` : "relative h-full w-full"
      }
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
