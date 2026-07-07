"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * SiteBuilderGL — raw-WebGL 3-stage morph for the web-dev service hero.
 *   0 · данные      : sparse graph — fewer, bigger nodes, bold links
 *   1 · прототип    : points gather into UI elements, wired node-to-node
 *   2 · реализация  : elements compose into a head-on website wireframe
 * Lines are camera-facing quads (real screen-space width) so links read
 * bold and the wireframe frame is crisp. Scroll + click + auto-showcase.
 * ------------------------------------------------------------------ */

type Props = { className?: string };

const N = 9000;
const SPHERE = 1.5;

function hash01(n: number): number {
  let x = (n + 0x9e3779b9) >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x21f0aaad) >>> 0;
  x ^= x >>> 15;
  x = Math.imul(x, 0x735a2d97) >>> 0;
  x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
}
function clampN(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}
function smoothstepN(e0: number, e1: number, x: number) {
  const t = clampN((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}
function spherePoint(seedBase: number, r: number): [number, number, number] {
  const u = hash01(seedBase * 3 + 11);
  const v = hash01(seedBase * 3 + 23);
  const w = hash01(seedBase * 3 + 37);
  const cosT = 2 * u - 1;
  const sinT = Math.sqrt(Math.max(0, 1 - cosT * cosT));
  const ph = 2 * Math.PI * v;
  const rr = Math.pow(w, 1 / 3) * r;
  return [sinT * Math.cos(ph) * rr, cosT * rr, sinT * Math.sin(ph) * rr];
}

type El = { x0: number; y0: number; x1: number; y1: number; z: number; kind: number };
const ELEMENTS: El[] = [
  { x0: -1.42, y0: 0.82, x1: 1.42, y1: 0.98, z: -0.05, kind: 2 }, // header bar
  { x0: -1.36, y0: 0.855, x1: -1.16, y1: 0.945, z: 0.06, kind: 2 }, // logo
  { x0: 0.62, y0: 0.86, x1: 1.35, y1: 0.94, z: 0.06, kind: 0 }, // nav
  { x0: -1.42, y0: 0.44, x1: -0.18, y1: 0.66, z: 0.02, kind: 0 }, // h1 bar 1
  { x0: -1.42, y0: 0.2, x1: -0.55, y1: 0.4, z: 0.02, kind: 0 }, // h1 bar 2
  { x0: -1.42, y0: 0.02, x1: -0.35, y1: 0.1, z: 0.0, kind: 0 }, // sub line 1
  { x0: -1.42, y0: -0.12, x1: -0.5, y1: -0.04, z: 0.0, kind: 0 }, // sub line 2
  { x0: -1.42, y0: -0.36, x1: -0.92, y1: -0.18, z: 0.05, kind: 1 }, // CTA button
  { x0: -0.05, y0: -0.16, x1: 1.42, y1: 0.66, z: 0.09, kind: 3 }, // media panel
  { x0: -1.42, y0: -0.76, x1: -0.55, y1: -0.5, z: 0.0, kind: 0 }, // card 1
  { x0: -0.3, y0: -0.76, x1: 0.42, y1: -0.5, z: 0.0, kind: 0 }, // card 2
  { x0: 0.55, y0: -0.76, x1: 1.42, y1: -0.5, z: 0.0, kind: 0 }, // card 3
  { x0: -1.42, y0: -1.0, x1: 1.42, y1: -0.86, z: -0.05, kind: 2 }, // footer bar
];
const OUTLINE = [0, 3, 8, 9, 10, 11, 12];
type V3 = [number, number, number];

type Geometry = {
  p0: Float32Array;
  p1: Float32Array;
  p2: Float32Array;
  seed: Float32Array;
  kind: Float32Array;
  datavis: Float32Array;
  self0: Float32Array;
  self1: Float32Array;
  self2: Float32Array;
  other0: Float32Array;
  other1: Float32Array;
  other2: Float32Array;
  side: Float32Array;
  lkind: Float32Array; // 0 outline · 1 chaos · 2 connector · 3 frame
  lineVertexCount: number;
};

let cache: Geometry | null = null;

function build(): Geometry {
  const p0 = new Float32Array(N * 3);
  const p1 = new Float32Array(N * 3);
  const p2 = new Float32Array(N * 3);
  const seed = new Float32Array(N);
  const kind = new Float32Array(N);
  const datavis = new Float32Array(N);

  // tighter scatter → UI blocks sit closer together in the prototype stage
  const off = ELEMENTS.map((_, e) => ({
    x: (hash01(e * 5 + 1) - 0.5) * 1.35,
    y: (hash01(e * 5 + 2) - 0.5) * 1.2,
    z: (hash01(e * 5 + 3) - 0.5) * 1.05,
  }));
  const center = (el: El): V3 => [(el.x0 + el.x1) / 2, (el.y0 + el.y1) / 2, el.z];

  const areas = ELEMENTS.map((el) => (el.x1 - el.x0) * (el.y1 - el.y0));
  const totalA = areas.reduce((a, b) => a + b, 0);
  const counts = areas.map((a) => Math.max(10, Math.floor((N * a) / totalA)));
  let assigned = counts.reduce((a, b) => a + b, 0);
  let bump = 0;
  while (assigned < N) {
    counts[bump % counts.length]++;
    assigned++;
    bump++;
  }

  let i = 0;
  for (let e = 0; e < ELEMENTS.length && i < N; e++) {
    const el = ELEMENTS[e];
    const c = counts[e];
    const w = el.x1 - el.x0;
    const h = el.y1 - el.y0;
    const cols = Math.max(1, Math.round(Math.sqrt((c * w) / h)));
    const rows = Math.max(1, Math.ceil(c / cols));
    for (let k = 0; k < c && i < N; k++, i++) {
      seed[i] = hash01(i * 7 + 5);
      kind[i] = el.kind;
      datavis[i] = hash01(i * 3 + 91) < 0.3 ? 1 : 0; // ~42% shown in data stage
      const col = k % cols;
      const row = Math.floor(k / cols);
      const gx = (col + 0.5) / cols + (hash01(i * 9 + 1) - 0.5) * (0.9 / cols);
      const gy = (row + 0.5) / rows + (hash01(i * 9 + 2) - 0.5) * (0.9 / rows);
      const rx = el.x0 + w * clampN(gx, 0, 1);
      const ry = el.y0 + h * clampN(gy, 0, 1);
      const jz = (hash01(i * 9 + 3) - 0.5) * 0.03;
      p2[i * 3] = rx;
      p2[i * 3 + 1] = ry;
      p2[i * 3 + 2] = el.z + jz;
      p1[i * 3] = rx + off[e].x;
      p1[i * 3 + 1] = ry + off[e].y;
      p1[i * 3 + 2] = el.z * 0.4 + off[e].z;
      const [sx, sy, sz] = spherePoint(i + 1, SPHERE);
      p0[i * 3] = sx;
      p0[i * 3 + 1] = sy;
      p0[i * 3 + 2] = sz;
    }
  }
  for (; i < N; i++) {
    seed[i] = hash01(i * 7 + 5);
    kind[i] = 0;
    datavis[i] = hash01(i * 3 + 91) < 0.3 ? 1 : 0;
    const [sx, sy, sz] = spherePoint(i + 1, SPHERE);
    p0[i * 3] = sx;
    p0[i * 3 + 1] = sy;
    p0[i * 3 + 2] = sz;
    p1[i * 3] = sx * 0.4;
    p1[i * 3 + 1] = sy * 0.4;
    p1[i * 3 + 2] = sz * 0.4;
  }

  /* ---- thick lines (camera-facing quads: 6 verts / segment) ---- */
  const S0: number[] = [];
  const S1: number[] = [];
  const S2: number[] = [];
  const O0: number[] = [];
  const O1: number[] = [];
  const O2: number[] = [];
  const SIDE: number[] = [];
  const LK: number[] = [];
  // endpoints given across the 3 states: a=(a0,a1,a2), b=(b0,b1,b2)
  const line = (a0: V3, a1: V3, a2: V3, b0: V3, b1: V3, b2: V3, lk: number) => {
    const push = (s0: V3, s1: V3, s2: V3, o0: V3, o1: V3, o2: V3, sd: number) => {
      S0.push(...s0);
      S1.push(...s1);
      S2.push(...s2);
      O0.push(...o0);
      O1.push(...o1);
      O2.push(...o2);
      SIDE.push(sd);
      LK.push(lk);
    };
    push(a0, a1, a2, b0, b1, b2, -1);
    push(a0, a1, a2, b0, b1, b2, 1);
    push(b0, b1, b2, a0, a1, a2, 1);
    push(a0, a1, a2, b0, b1, b2, -1);
    push(b0, b1, b2, a0, a1, a2, 1);
    push(b0, b1, b2, a0, a1, a2, -1);
  };
  const rnd = (base: number): V3 => spherePoint(base, SPHERE);

  const FR: El = { x0: -1.55, y0: -1.12, x1: 1.55, y1: 1.12, z: -0.02, kind: 2 };
  const frameOff = { x: 0, y: 0, z: -0.55 };
  const corners = (el: El): V3[] => [
    [el.x0, el.y0, el.z],
    [el.x1, el.y0, el.z],
    [el.x1, el.y1, el.z],
    [el.x0, el.y1, el.z],
  ];
  const outline = (el: El, o: { x: number; y: number; z: number }, lk: number) => {
    const c2 = corners(el);
    for (let e = 0; e < 4; e++) {
      const a = c2[e];
      const b = c2[(e + 1) % 4];
      const a1: V3 = [a[0] + o.x, a[1] + o.y, a[2] * 0.4 + o.z];
      const b1: V3 = [b[0] + o.x, b[1] + o.y, b[2] * 0.4 + o.z];
      line(rnd(1000 + S0.length), a1, a, rnd(2000 + S0.length), b1, b, lk);
    }
  };
  outline(FR, frameOff, 3); // frame — thickest, crisp
  for (const idx of OUTLINE) outline(ELEMENTS[idx], off[idx], 0);

  // node connectors — each element to its 2 nearest, visible in prototype
  const cen = ELEMENTS.map(center);
  const seen = new Set<string>();
  for (let a = 0; a < ELEMENTS.length; a++) {
    const near = ELEMENTS.map((_, b) => ({
      b,
      d: b === a ? 1e9 : (cen[a][0] - cen[b][0]) ** 2 + (cen[a][1] - cen[b][1]) ** 2,
    })).sort((x, y) => x.d - y.d);
    for (let n = 0; n < 2; n++) {
      const b = near[n].b;
      const key = Math.min(a, b) + "-" + Math.max(a, b);
      if (seen.has(key)) continue;
      seen.add(key);
      const a1: V3 = [cen[a][0] + off[a].x, cen[a][1] + off[a].y, cen[a][2] * 0.4 + off[a].z];
      const b1: V3 = [cen[b][0] + off[b].x, cen[b][1] + off[b].y, cen[b][2] * 0.4 + off[b].z];
      line(rnd(3000 + a * 31 + b), a1, cen[a], rnd(3500 + a * 31 + b), b1, cen[b], 2);
    }
  }

  // chaos web — fewer but bolder links, present only in the data stage
  const CHAOS = 210;
  for (let c = 0; c < CHAOS; c++) {
    const A = spherePoint(5000 + c, SPHERE);
    const dl = 0.6;
    const B: V3 = [
      A[0] + (hash01(c * 13 + 1) - 0.5) * dl,
      A[1] + (hash01(c * 13 + 2) - 0.5) * dl,
      A[2] + (hash01(c * 13 + 3) - 0.5) * dl,
    ];
    const col = (p: V3): V3 => [p[0] * 0.12, p[1] * 0.12, p[2] * 0.12];
    line(A, col(A), col(A), B, col(B), col(B), 1);
  }

  return {
    p0,
    p1,
    p2,
    seed,
    kind,
    datavis,
    self0: new Float32Array(S0),
    self1: new Float32Array(S1),
    self2: new Float32Array(S2),
    other0: new Float32Array(O0),
    other1: new Float32Array(O1),
    other2: new Float32Array(O2),
    side: new Float32Array(SIDE),
    lkind: new Float32Array(LK),
    lineVertexCount: SIDE.length,
  };
}

function getGeometry(): Geometry {
  if (!cache) cache = build();
  return cache;
}

/* ---- shaders ---- */
const VERT = `
attribute vec3 a_pos0;
attribute vec3 a_pos1;
attribute vec3 a_pos2;
attribute float a_seed;
attribute float a_kind;
attribute float a_datavis;
uniform mat4 u_proj;
uniform float u_m01;
uniform float u_m12;
uniform float u_yaw;
uniform float u_pitch;
uniform float u_scale;
uniform float u_dpr;
varying float v_near;
varying float v_seed;
varying float v_kind;
varying float v_compose;
varying float v_vis;
void main() {
  vec3 p = mix(mix(a_pos0, a_pos1, u_m01), a_pos2, u_m12) * u_scale;
  float cy = cos(u_yaw); float sy = sin(u_yaw);
  vec3 q = vec3(p.x * cy + p.z * sy, p.y, p.z * cy - p.x * sy);
  float cx = cos(u_pitch); float sx = sin(u_pitch);
  q = vec3(q.x, q.y * cx - q.z * sx, q.y * sx + q.z * cx);
  float near = clamp((q.z + 1.6) / 3.2, 0.0, 1.0);
  gl_Position = u_proj * vec4(q.x, q.y, q.z - 3.2, 1.0);
  // data stage → fewer, bigger nodes
  float dataAmt = 1.0 - smoothstep(0.0, 0.42, u_m01);
  gl_PointSize = clamp(u_dpr * mix(1.7, 3.9, near) * (1.0 + dataAmt * 1.35) * (1.0 + step(1.5, a_kind) * 0.18), 1.0, 46.0);
  v_near = near;
  v_seed = a_seed;
  v_kind = a_kind;
  v_compose = u_m12;
  v_vis = mix(a_datavis, 1.0, smoothstep(0.0, 0.5, u_m01));
}
`;
const FRAG = `
precision mediump float;
varying float v_near;
varying float v_seed;
varying float v_kind;
varying float v_compose;
varying float v_vis;
uniform float u_pointer;
uniform float u_time;
void main() {
  vec2 d = gl_PointCoord - vec2(0.5);
  float r2 = dot(d, d);
  if (r2 > 0.25) discard;
  float fall = 1.0 - smoothstep(0.0, 0.25, r2);
  vec3 deep = vec3(0.592, 0.278, 1.0);
  vec3 soft = vec3(0.788, 0.714, 1.0);
  vec3 ink  = vec3(0.937, 0.918, 1.0);
  vec3 lime = vec3(0.773, 1.0, 0.267);
  vec3 col = mix(deep, soft, v_near);
  float a = 0.26 + 0.5 * v_near;
  if (v_seed > 0.972) { col = ink; a = 0.8; }
  col = mix(col, ink, step(1.5, v_kind) * step(v_kind, 2.5) * 0.4);
  col = mix(col, lime, step(0.5, v_kind) * step(v_kind, 1.5) * 0.78);
  float tw = 0.62 + 0.38 * sin(u_time * 1.6 + v_seed * 42.0);
  a *= mix(tw, 1.0, v_compose);
  a *= mix(0.88, 1.12, v_compose);
  a *= fall * (1.0 + 0.3 * u_pointer);
  a *= 0.82 * v_vis;
  gl_FragColor = vec4(col * a, a);
}
`;
// thick lines — expand each segment into a screen-space quad of pixel width
const LVERT = `
attribute vec3 a_self0;
attribute vec3 a_self1;
attribute vec3 a_self2;
attribute vec3 a_other0;
attribute vec3 a_other1;
attribute vec3 a_other2;
attribute float a_side;
attribute float a_lkind;
uniform mat4 u_proj;
uniform float u_m01;
uniform float u_m12;
uniform float u_yaw;
uniform float u_pitch;
uniform float u_scale;
uniform float u_aspect;
uniform float u_vph;
uniform float u_dpr;
varying float v_near;
varying float v_lkind;
varying float v_m01;
varying float v_compose;
vec3 tf(vec3 p) {
  p *= u_scale;
  float cy = cos(u_yaw); float sy = sin(u_yaw);
  vec3 q = vec3(p.x * cy + p.z * sy, p.y, p.z * cy - p.x * sy);
  float cx = cos(u_pitch); float sx = sin(u_pitch);
  return vec3(q.x, q.y * cx - q.z * sx, q.y * sx + q.z * cx);
}
void main() {
  vec3 s = tf(mix(mix(a_self0, a_self1, u_m01), a_self2, u_m12));
  vec3 o = tf(mix(mix(a_other0, a_other1, u_m01), a_other2, u_m12));
  vec4 cs = u_proj * vec4(s.x, s.y, s.z - 3.2, 1.0);
  vec4 co = u_proj * vec4(o.x, o.y, o.z - 3.2, 1.0);
  vec2 ns = cs.xy / cs.w;
  vec2 no = co.xy / co.w;
  vec2 diff = vec2((no.x - ns.x) * u_aspect, no.y - ns.y);
  float len = length(diff);
  vec2 dir = len > 0.0001 ? diff / len : vec2(1.0, 0.0);
  vec2 perp = vec2(-dir.y, dir.x);
  float w = 1.8;
  if (a_lkind > 2.5) w = 2.9;       // frame
  else if (a_lkind > 1.5) w = 2.1;  // connector
  else if (a_lkind > 0.5) w = 2.4;  // chaos
  vec2 offset = vec2(perp.x / u_aspect, perp.y) * (w * u_dpr / u_vph) * a_side;
  gl_Position = vec4((ns + offset) * cs.w, cs.z, cs.w);
  v_near = clamp((s.z + 1.6) / 3.2, 0.0, 1.0);
  v_lkind = a_lkind;
  v_m01 = u_m01;
  v_compose = u_m12;
}
`;
const LFRAG = `
precision mediump float;
varying float v_near;
varying float v_lkind;
varying float v_m01;
varying float v_compose;
void main() {
  vec3 deep = vec3(0.592, 0.278, 1.0);
  vec3 soft = vec3(0.788, 0.714, 1.0);
  vec3 col = mix(deep, soft, v_near);
  float isOut = step(v_lkind, 0.5);
  float isChaos = step(0.5, v_lkind) * step(v_lkind, 1.5);
  float isConn = step(1.5, v_lkind) * step(v_lkind, 2.5);
  float isFrame = step(2.5, v_lkind);
  float structA = (0.09 + 0.15 * v_near) * mix(0.6, 1.5, v_compose);
  float frameA = (0.13 + 0.22 * v_near) * mix(0.7, 1.75, v_compose);
  float chaosA = (0.11 + 0.15 * v_near) * (1.0 - v_m01);
  float connA = (0.14 + 0.2 * v_near) * v_m01 * (1.0 - v_compose);
  float a = structA * isOut + chaosA * isChaos + connA * isConn + frameA * isFrame;
  gl_FragColor = vec4(col * a, a);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}
function perspective(out: Float32Array, fovY: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovY / 2);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) / (near - far);
  out[11] = -1;
  out[14] = (2 * far * near) / (near - far);
}

const FOV = (36 * Math.PI) / 180;
const CAM_DIST = 3.2;

export default function SiteBuilderGL({ className }: Props) {
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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let gl: WebGLRenderingContext | null = null;
    try {
      const attrs: WebGLContextAttributes = {
        alpha: true,
        antialias: true,
        depth: false,
        premultipliedAlpha: true,
        powerPreference: "high-performance",
      };
      gl =
        (canvas.getContext("webgl", attrs) as WebGLRenderingContext | null) ||
        (canvas.getContext("experimental-webgl", attrs) as WebGLRenderingContext | null);
    } catch {
      gl = null;
    }
    if (!gl) {
      setFailed(true);
      return;
    }
    const ctx = gl;

    const onLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const onRestored = () => setEpoch((p) => p + 1);
    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);

    let program: WebGLProgram | null = null;
    let lineProgram: WebGLProgram | null = null;
    const buffers: WebGLBuffer[] = [];
    type Binding = { loc: number; buf: WebGLBuffer; size: number };
    const pb: Binding[] = [];
    const lb: Binding[] = [];
    let lineVertexCount = 0;
    let dprNow = 1;
    let aspectNow = 1;
    let vphNow = 1;

    const disposeGL = () => {
      if (ctx.isContextLost()) return;
      for (const b of buffers) ctx.deleteBuffer(b);
      if (program) ctx.deleteProgram(program);
      if (lineProgram) ctx.deleteProgram(lineProgram);
    };
    const makeProgram = (vs: string, fs: string) => {
      const v = compile(ctx, ctx.VERTEX_SHADER, vs);
      if (!v) return null;
      const f = compile(ctx, ctx.FRAGMENT_SHADER, fs);
      if (!f) {
        ctx.deleteShader(v);
        return null;
      }
      const p = ctx.createProgram();
      if (!p) {
        ctx.deleteShader(v);
        ctx.deleteShader(f);
        return null;
      }
      ctx.attachShader(p, v);
      ctx.attachShader(p, f);
      ctx.linkProgram(p);
      ctx.deleteShader(v);
      ctx.deleteShader(f);
      if (!ctx.getProgramParameter(p, ctx.LINK_STATUS)) {
        ctx.deleteProgram(p);
        return null;
      }
      return p;
    };
    const attr = (prog: WebGLProgram, name: string, data: Float32Array, size: number, into: Binding[]) => {
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
    const bindAll = (bs: Binding[]) => {
      for (const b of bs) {
        ctx.bindBuffer(ctx.ARRAY_BUFFER, b.buf);
        ctx.vertexAttribPointer(b.loc, b.size, ctx.FLOAT, false, 0, 0);
        ctx.enableVertexAttribArray(b.loc);
      }
    };

    type U = Record<string, WebGLUniformLocation | null>;
    let u: U = {};
    let lu: U = {};

    const init = (): boolean => {
      const prog = makeProgram(VERT, FRAG);
      if (!prog) return false;
      program = prog;
      ctx.useProgram(prog);
      const g = getGeometry();
      if (
        !attr(prog, "a_pos0", g.p0, 3, pb) ||
        !attr(prog, "a_pos1", g.p1, 3, pb) ||
        !attr(prog, "a_pos2", g.p2, 3, pb) ||
        !attr(prog, "a_seed", g.seed, 1, pb) ||
        !attr(prog, "a_kind", g.kind, 1, pb) ||
        !attr(prog, "a_datavis", g.datavis, 1, pb)
      )
        return false;
      const lp = makeProgram(LVERT, LFRAG);
      if (lp) {
        const ok =
          attr(lp, "a_self0", g.self0, 3, lb) &&
          attr(lp, "a_self1", g.self1, 3, lb) &&
          attr(lp, "a_self2", g.self2, 3, lb) &&
          attr(lp, "a_other0", g.other0, 3, lb) &&
          attr(lp, "a_other1", g.other1, 3, lb) &&
          attr(lp, "a_other2", g.other2, 3, lb) &&
          attr(lp, "a_side", g.side, 1, lb) &&
          attr(lp, "a_lkind", g.lkind, 1, lb);
        if (ok) {
          lineProgram = lp;
          lineVertexCount = g.lineVertexCount;
          lu = {
            proj: ctx.getUniformLocation(lp, "u_proj"),
            m01: ctx.getUniformLocation(lp, "u_m01"),
            m12: ctx.getUniformLocation(lp, "u_m12"),
            yaw: ctx.getUniformLocation(lp, "u_yaw"),
            pitch: ctx.getUniformLocation(lp, "u_pitch"),
            scale: ctx.getUniformLocation(lp, "u_scale"),
            aspect: ctx.getUniformLocation(lp, "u_aspect"),
            vph: ctx.getUniformLocation(lp, "u_vph"),
            dpr: ctx.getUniformLocation(lp, "u_dpr"),
          };
        } else {
          ctx.deleteProgram(lp);
        }
      }
      ctx.useProgram(prog);
      u = {
        proj: ctx.getUniformLocation(prog, "u_proj"),
        m01: ctx.getUniformLocation(prog, "u_m01"),
        m12: ctx.getUniformLocation(prog, "u_m12"),
        yaw: ctx.getUniformLocation(prog, "u_yaw"),
        pitch: ctx.getUniformLocation(prog, "u_pitch"),
        scale: ctx.getUniformLocation(prog, "u_scale"),
        dpr: ctx.getUniformLocation(prog, "u_dpr"),
        pointer: ctx.getUniformLocation(prog, "u_pointer"),
        time: ctx.getUniformLocation(prog, "u_time"),
      };
      for (const k of ["proj", "m01", "m12", "yaw", "pitch", "scale", "dpr", "pointer", "time"]) {
        if (!u[k]) return false;
      }
      ctx.disable(ctx.DEPTH_TEST);
      ctx.enable(ctx.BLEND);
      ctx.blendFunc(ctx.ONE, ctx.ONE);
      return true;
    };

    if (!init()) {
      if (!ctx.isContextLost()) setFailed(true);
      return () => {
        disposed = true;
        canvas.removeEventListener("webglcontextlost", onLost, false);
        canvas.removeEventListener("webglcontextrestored", onRestored, false);
        disposeGL();
      };
    }

    let override = -1;
    try {
      const q = new URLSearchParams(window.location.search).get("viz");
      if (q === "0" || q === "1" || q === "2") override = Number(q);
    } catch {
      /* ignore */
    }

    let lastNow = -1;
    let t = 0;
    let rot = 0;
    let m01 = 0;
    let m12 = 0;
    let m01T = 0;
    let m12T = 0;
    let yawOff = 0;
    let pitchOff = 0;
    let yawT = 0;
    let pitchT = 0;
    let pointerS = 0;
    let pointerT = 0;
    let px = 0;
    let py = 0;
    let hasPointer = false;
    let scrollDirty = true;
    let cx = 0;
    let cy = 0;
    let halfDiag = 1;
    let baseScale = 0.62;
    const projMat = new Float32Array(16);
    let autoState = override >= 0 ? override : 0;
    let autoT = 0;
    let lastP = 0;
    let lastStage = -1;
    let overrideScrollY = 0;

    const shouldRun = () => !reduced && !contextLost && pageVisible && onScreen && !disposed;

    const dispatchStage = () => {
      const s = m12T > 0.5 ? 2 : m01T > 0.5 ? 1 : 0;
      if (s !== lastStage) {
        lastStage = s;
        try {
          window.dispatchEvent(new CustomEvent("aics:sitestate", { detail: s }));
        } catch {
          /* ignore */
        }
      }
    };

    const updateRect = () => {
      const r = wrap.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
      halfDiag = Math.sqrt(r.width * r.width + r.height * r.height) / 2;
      if (override >= 0 && Math.abs(window.scrollY - overrideScrollY) > 160) override = -1;
      const p = clampN(-r.top / Math.max(1, r.height * 0.9), 0, 1);
      lastP = p;
      if (override >= 0) {
        m01T = override >= 1 ? 1 : 0;
        m12T = override >= 2 ? 1 : 0;
      } else if (p < 0.06) {
        m01T = autoState >= 1 ? 1 : 0;
        m12T = autoState >= 2 ? 1 : 0;
      } else {
        m01T = smoothstepN(0, 0.5, p);
        m12T = smoothstepN(0.5, 1, p);
      }
      dispatchStage();
    };

    const onClick = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      const cur = override >= 0 ? override : m12T > 0.5 ? 2 : m01T > 0.5 ? 1 : 0;
      override = (cur + 1) % 3;
      overrideScrollY = window.scrollY;
      autoState = override;
      autoT = 0;
      updateRect();
    };
    window.addEventListener("click", onClick);

    const draw = (yaw: number, pitch: number, scale: number) => {
      ctx.clearColor(0, 0, 0, 0);
      ctx.clear(ctx.COLOR_BUFFER_BIT);
      if (lineProgram && lineVertexCount > 0) {
        ctx.useProgram(lineProgram);
        bindAll(lb);
        ctx.uniformMatrix4fv(lu.proj, false, projMat);
        ctx.uniform1f(lu.m01, m01);
        ctx.uniform1f(lu.m12, m12);
        ctx.uniform1f(lu.yaw, yaw);
        ctx.uniform1f(lu.pitch, pitch);
        ctx.uniform1f(lu.scale, scale);
        ctx.uniform1f(lu.aspect, aspectNow);
        ctx.uniform1f(lu.vph, vphNow);
        ctx.uniform1f(lu.dpr, dprNow);
        ctx.drawArrays(ctx.TRIANGLES, 0, lineVertexCount);
      }
      ctx.useProgram(program);
      bindAll(pb);
      ctx.uniformMatrix4fv(u.proj, false, projMat);
      ctx.uniform1f(u.dpr, dprNow);
      ctx.uniform1f(u.m01, m01);
      ctx.uniform1f(u.m12, m12);
      ctx.uniform1f(u.yaw, yaw);
      ctx.uniform1f(u.pitch, pitch);
      ctx.uniform1f(u.scale, scale);
      ctx.uniform1f(u.pointer, pointerS);
      ctx.uniform1f(u.time, t);
      ctx.drawArrays(ctx.POINTS, 0, N);
    };

    const renderStatic = () => {
      m01 = 1;
      m12 = 1;
      pointerS = 0;
      draw(0, 0, baseScale);
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
      const aspect = bw / bh;
      perspective(projMat, FOV, aspect, 0.1, 20);
      const visH = Math.tan(FOV / 2) * CAM_DIST;
      const visW = visH * aspect;
      baseScale = Math.min(visW / 1.72, visH / 1.28) * 0.94;
      dprNow = dpr;
      aspectNow = aspect;
      vphNow = bh;
      scrollDirty = true;
      if (reduced) {
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
      autoT += dt;
      if (autoT >= 3.8) {
        autoT = 0;
        if (override < 0 && lastP < 0.06) {
          autoState = (autoState + 1) % 3;
          updateRect();
        }
      }
      if (coarse) {
        yawT = Math.sin(t * 0.2) * 0.05;
        pitchT = Math.cos(t * 0.16) * 0.035;
        pointerT = 0;
      } else if (hasPointer) {
        const vw = window.innerWidth || 1;
        const vh = window.innerHeight || 1;
        yawT = clampN((px / vw - 0.5) * 0.5, -0.24, 0.24);
        pitchT = clampN((py / vh - 0.5) * 0.4, -0.2, 0.2);
        const ddx = px - cx;
        const ddy = py - cy;
        pointerT = Math.max(0, 1 - Math.sqrt(ddx * ddx + ddy * ddy) / Math.max(1, halfDiag * 1.4));
      }
      m01 += (m01T - m01) * 0.13;
      m12 += (m12T - m12) * 0.13;
      yawOff += (yawT - yawOff) * 0.16;
      pitchOff += (pitchT - pitchOff) * 0.16;
      pointerS += (pointerT - pointerS) * 0.15;
      rot += dt * 0.08 * (1 - m12 * 0.96);
      const free = 1 - m12;
      const breathe = 1 + 0.018 * Math.sin(t * 0.8);
      draw((rot + yawOff) * free, (-0.1 + pitchOff) * free, breathe * baseScale);
      raf = requestAnimationFrame(frame);
    };

    const startLoop = () => {
      if (raf === 0 && shouldRun()) {
        lastNow = -1;
        raf = requestAnimationFrame(frame);
      }
    };
    const stopLoop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    resize();
    updateRect();
    m01 = m01T;
    m12 = m12T;

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    if (reduced) {
      renderStatic();
      return () => {
        disposed = true;
        ro.disconnect();
        window.removeEventListener("click", onClick);
        canvas.removeEventListener("webglcontextlost", onLost, false);
        canvas.removeEventListener("webglcontextrestored", onRestored, false);
        disposeGL();
      };
    }

    const onScroll = () => {
      scrollDirty = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      hasPointer = true;
    };
    if (!coarse) window.addEventListener("pointermove", onMove, { passive: true });
    const onVis = () => {
      pageVisible = !document.hidden;
      if (pageVisible) startLoop();
      else stopLoop();
    };
    document.addEventListener("visibilitychange", onVis);
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver((es) => {
        const e = es[es.length - 1];
        if (e) {
          onScreen = e.isIntersecting;
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
      if (!coarse) window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost, false);
      canvas.removeEventListener("webglcontextrestored", onRestored, false);
      disposeGL();
    };
  }, [epoch]);

  if (failed) {
    return (
      <div className={className} aria-hidden>
        <div className="relative h-full w-full">
          <div className="absolute inset-[8%] rounded-lg border border-runtime-line/70">
            <div className="absolute inset-x-3 top-3 h-3 rounded bg-signal/25" />
            <div className="absolute left-3 top-10 h-8 w-2/3 rounded bg-signal/15" />
            <div className="absolute left-3 top-20 h-2 w-1/2 rounded bg-runtime-line" />
            <div className="absolute left-3 top-24 h-6 w-24 rounded bg-[color-mix(in_srgb,var(--color-constructive)_40%,transparent)]" />
            <div className="absolute bottom-10 left-3 right-3 flex gap-2">
              <div className="h-10 flex-1 rounded bg-signal/12" />
              <div className="h-10 flex-1 rounded bg-signal/12" />
              <div className="h-10 flex-1 rounded bg-signal/12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={className ? `relative h-full w-full ${className}` : "relative h-full w-full"}
      style={{
        cursor: "pointer",
        maskImage: "radial-gradient(125% 125% at 50% 46%, #000 70%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(125% 125% at 50% 46%, #000 70%, transparent 100%)",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
