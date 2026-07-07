"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * SiteBuilderGL — raw-WebGL 3-stage morph for the web-dev service hero.
 *   state 0: chaotic 3D point cloud, points wired by random links
 *   state 1: points gather into UI elements (bars, buttons, media, cards)
 *   state 2: elements compose into a website wireframe inside a screen frame
 * Scroll-driven (like BrainGL) + idle auto-showcase. Same violet palette.
 * Points + lines both morph across the 3 states via mix(mix(p0,p1),p2).
 * ------------------------------------------------------------------ */

type Props = { className?: string };

const N = 4600;

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
/** random point inside a unit sphere from a seed */
function spherePoint(seedBase: number): [number, number, number] {
  const u = hash01(seedBase * 3 + 11);
  const v = hash01(seedBase * 3 + 23);
  const w = hash01(seedBase * 3 + 37);
  const cosT = 2 * u - 1;
  const sinT = Math.sqrt(Math.max(0, 1 - cosT * cosT));
  const ph = 2 * Math.PI * v;
  const r = Math.pow(w, 1 / 3);
  return [sinT * Math.cos(ph) * r, cosT * r, sinT * Math.sin(ph) * r];
}

// UI elements of the target wireframe (screen space; y up). kind drives colour:
// 0 generic · 1 CTA (lime) · 2 chrome bar (bright) · 3 media panel.
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
// which elements also get a drawn outline in the wireframe (bigger blocks)
const OUTLINE = [0, 3, 8, 9, 10, 11, 12];

type Geometry = {
  p0: Float32Array;
  p1: Float32Array;
  p2: Float32Array;
  seed: Float32Array;
  kind: Float32Array;
  lineP0: Float32Array;
  lineP1: Float32Array;
  lineP2: Float32Array;
  lineKind: Float32Array; // 0 structure · 1 chaos (fades as it assembles)
  lineVertexCount: number;
};

let cache: Geometry | null = null;

function build(): Geometry {
  const p0 = new Float32Array(N * 3);
  const p1 = new Float32Array(N * 3);
  const p2 = new Float32Array(N * 3);
  const seed = new Float32Array(N);
  const kind = new Float32Array(N);

  // per-element scatter anchor for the "assembled but floating" state
  const off = ELEMENTS.map((_, e) => ({
    x: (hash01(e * 5 + 1) - 0.5) * 2.4,
    y: (hash01(e * 5 + 2) - 0.5) * 2.1,
    z: (hash01(e * 5 + 3) - 0.5) * 1.9,
  }));

  const areas = ELEMENTS.map((el) => (el.x1 - el.x0) * (el.y1 - el.y0));
  const totalA = areas.reduce((a, b) => a + b, 0);
  const counts = areas.map((a) => Math.max(6, Math.floor((N * a) / totalA)));
  let assigned = counts.reduce((a, b) => a + b, 0);
  let ei = 0;
  while (assigned < N) {
    counts[ei % counts.length]++;
    assigned++;
    ei++;
  }

  let i = 0;
  for (let e = 0; e < ELEMENTS.length && i < N; e++) {
    const el = ELEMENTS[e];
    for (let k = 0; k < counts[e] && i < N; k++, i++) {
      seed[i] = hash01(i * 7 + 5);
      kind[i] = el.kind;
      const rx = el.x0 + (el.x1 - el.x0) * hash01(i * 9 + 1);
      const ry = el.y0 + (el.y1 - el.y0) * hash01(i * 9 + 2);
      const jz = (hash01(i * 9 + 3) - 0.5) * 0.04;
      // state 2 — composed layout (flat, slight per-element depth)
      p2[i * 3] = rx;
      p2[i * 3 + 1] = ry;
      p2[i * 3 + 2] = el.z + jz;
      // state 1 — rigidly translated to a floating anchor with real depth
      p1[i * 3] = rx + off[e].x;
      p1[i * 3 + 1] = ry + off[e].y;
      p1[i * 3 + 2] = el.z * 0.4 + off[e].z;
      // state 0 — chaos: random point in a sphere
      const [sx, sy, sz] = spherePoint(i + 1);
      p0[i * 3] = sx * 1.7;
      p0[i * 3 + 1] = sy * 1.5;
      p0[i * 3 + 2] = sz * 1.7;
    }
  }
  // any leftover indices (rounding) → chaos points that collapse to origin
  for (; i < N; i++) {
    seed[i] = hash01(i * 7 + 5);
    kind[i] = 0;
    const [sx, sy, sz] = spherePoint(i + 1);
    p0[i * 3] = sx * 1.7;
    p0[i * 3 + 1] = sy * 1.5;
    p0[i * 3 + 2] = sz * 1.7;
    p1[i * 3] = sx * 0.4;
    p1[i * 3 + 1] = sy * 0.4;
    p1[i * 3 + 2] = sz * 0.4;
  }

  /* ---- lines ---- */
  const L0: number[] = [];
  const L1: number[] = [];
  const L2: number[] = [];
  const LK: number[] = [];
  const pushSeg = (
    a2: [number, number, number],
    b2: [number, number, number],
    a1: [number, number, number],
    b1: [number, number, number],
    a0: [number, number, number],
    b0: [number, number, number],
    lk: number,
  ) => {
    L2.push(...a2, ...b2);
    L1.push(...a1, ...b1);
    L0.push(...a0, ...b0);
    LK.push(lk, lk);
  };

  // screen frame outline
  const FR: El = { x0: -1.55, y0: -1.12, x1: 1.55, y1: 1.12, z: -0.02, kind: 2 };
  const frameOff = { x: 0, y: 0, z: -0.6 };
  const rectCorners = (el: El): [number, number, number][] => [
    [el.x0, el.y0, el.z],
    [el.x1, el.y0, el.z],
    [el.x1, el.y1, el.z],
    [el.x0, el.y1, el.z],
  ];
  const addOutline = (el: El, o: { x: number; y: number; z: number }) => {
    const c2 = rectCorners(el);
    for (let e = 0; e < 4; e++) {
      const a = c2[e];
      const b = c2[(e + 1) % 4];
      const a1: [number, number, number] = [a[0] + o.x, a[1] + o.y, a[2] * 0.4 + o.z];
      const b1: [number, number, number] = [b[0] + o.x, b[1] + o.y, b[2] * 0.4 + o.z];
      const [ax, ay, az] = spherePoint(1000 + L2.length);
      const [bx, by, bz] = spherePoint(2000 + L2.length);
      pushSeg(a, b, a1, b1, [ax * 1.7, ay * 1.5, az * 1.7], [bx * 1.7, by * 1.5, bz * 1.7], 0);
    }
  };
  addOutline(FR, frameOff);
  for (const idx of OUTLINE) addOutline(ELEMENTS[idx], off[idx]);

  // chaos web — random short links, present in state 0, fade out on assembly
  const CHAOS = 300;
  for (let c = 0; c < CHAOS; c++) {
    const [ax, ay, az] = spherePoint(5000 + c);
    const A: [number, number, number] = [ax * 1.7, ay * 1.5, az * 1.7];
    const dl = 0.5;
    const B: [number, number, number] = [
      A[0] + (hash01(c * 13 + 1) - 0.5) * dl,
      A[1] + (hash01(c * 13 + 2) - 0.5) * dl,
      A[2] + (hash01(c * 13 + 3) - 0.5) * dl,
    ];
    const collapse = (p: [number, number, number]): [number, number, number] => [
      p[0] * 0.12,
      p[1] * 0.12,
      p[2] * 0.12,
    ];
    pushSeg(collapse(A), collapse(B), collapse(A), collapse(B), A, B, 1);
  }

  return {
    p0,
    p1,
    p2,
    seed,
    kind,
    lineP0: new Float32Array(L0),
    lineP1: new Float32Array(L1),
    lineP2: new Float32Array(L2),
    lineKind: new Float32Array(LK),
    lineVertexCount: LK.length,
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
void main() {
  vec3 p = mix(mix(a_pos0, a_pos1, u_m01), a_pos2, u_m12) * u_scale;
  float cy = cos(u_yaw); float sy = sin(u_yaw);
  vec3 q = vec3(p.x * cy + p.z * sy, p.y, p.z * cy - p.x * sy);
  float cx = cos(u_pitch); float sx = sin(u_pitch);
  q = vec3(q.x, q.y * cx - q.z * sx, q.y * sx + q.z * cx);
  float near = clamp((q.z + 1.6) / 3.2, 0.0, 1.0);
  gl_Position = u_proj * vec4(q.x, q.y, q.z - 3.2, 1.0);
  gl_PointSize = clamp(u_dpr * mix(2.0, 4.6, near) * (1.0 + step(1.5, a_kind) * 0.2), 1.0, 40.0);
  v_near = near;
  v_seed = a_seed;
  v_kind = a_kind;
  v_compose = u_m12;
}
`;
const FRAG = `
precision mediump float;
varying float v_near;
varying float v_seed;
varying float v_kind;
varying float v_compose;
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
  // sparkle
  if (v_seed > 0.972) { col = ink; a = 0.8; }
  // chrome bars brighter, CTA lime, media a touch cooler
  col = mix(col, ink, step(1.5, v_kind) * step(v_kind, 2.5) * 0.4);
  col = mix(col, lime, step(0.5, v_kind) * step(v_kind, 1.5) * 0.75);
  // gentle idle twinkle before it composes; solid once composed
  float tw = 0.6 + 0.4 * sin(u_time * 1.6 + v_seed * 42.0);
  a *= mix(tw, 1.0, v_compose);
  // composed wireframe reads a bit crisper
  a *= mix(0.9, 1.08, v_compose);
  a *= fall * (1.0 + 0.3 * u_pointer);
  a *= 0.8;
  gl_FragColor = vec4(col * a, a);
}
`;
const LVERT = `
attribute vec3 a_p0;
attribute vec3 a_p1;
attribute vec3 a_p2;
attribute float a_lkind;
uniform mat4 u_proj;
uniform float u_m01;
uniform float u_m12;
uniform float u_yaw;
uniform float u_pitch;
uniform float u_scale;
varying float v_near;
varying float v_lkind;
varying float v_m01;
varying float v_compose;
void main() {
  vec3 p = mix(mix(a_p0, a_p1, u_m01), a_p2, u_m12) * u_scale;
  float cy = cos(u_yaw); float sy = sin(u_yaw);
  vec3 q = vec3(p.x * cy + p.z * sy, p.y, p.z * cy - p.x * sy);
  float cx = cos(u_pitch); float sx = sin(u_pitch);
  q = vec3(q.x, q.y * cx - q.z * sx, q.y * sx + q.z * cx);
  float near = clamp((q.z + 1.6) / 3.2, 0.0, 1.0);
  gl_Position = u_proj * vec4(q.x, q.y, q.z - 3.2, 1.0);
  v_near = near;
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
  // structure lines: faint early, crisp when composed. chaos lines: fade as assembled.
  float structA = (0.05 + 0.1 * v_near) * mix(0.5, 1.35, v_compose);
  float chaosA = (0.05 + 0.08 * v_near) * (1.0 - v_m01);
  float a = mix(structA, chaosA, v_lkind);
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
        !attr(prog, "a_kind", g.kind, 1, pb)
      )
        return false;

      const lp = makeProgram(LVERT, LFRAG);
      if (lp) {
        const ok =
          attr(lp, "a_p0", g.lineP0, 3, lb) &&
          attr(lp, "a_p1", g.lineP1, 3, lb) &&
          attr(lp, "a_p2", g.lineP2, 3, lb) &&
          attr(lp, "a_lkind", g.lineKind, 1, lb);
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

    // debug hook: ?viz=0|1|2 pins a stage for screenshots (harmless in prod)
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
    const projMat = new Float32Array(16);
    let autoState = override >= 0 ? override : 0;
    let autoT = 0;
    let lastP = 0;

    const shouldRun = () => !reduced && !contextLost && pageVisible && onScreen && !disposed;

    const updateRect = () => {
      const r = wrap.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
      halfDiag = Math.sqrt(r.width * r.width + r.height * r.height) / 2;
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
    };

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
        ctx.drawArrays(ctx.LINES, 0, lineVertexCount);
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
      m12 = 0.62;
      pointerS = 0;
      draw(0.32, -0.12, 0.96);
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
      perspective(projMat, (36 * Math.PI) / 180, bw / bh, 0.1, 20);
      dprNow = dpr;
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
      // idle auto-showcase at the top: cycle chaos → elements → wireframe
      autoT += dt;
      if (autoT >= 3.4) {
        autoT = 0;
        if (override < 0 && lastP < 0.06) {
          autoState = (autoState + 1) % 3;
          updateRect();
        }
      }
      if (coarse) {
        yawT = Math.sin(t * 0.2) * 0.06;
        pitchT = Math.cos(t * 0.16) * 0.04;
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
      m01 += (m01T - m01) * 0.14;
      m12 += (m12T - m12) * 0.14;
      yawOff += (yawT - yawOff) * 0.16;
      pitchOff += (pitchT - pitchOff) * 0.16;
      pointerS += (pointerT - pointerS) * 0.15;
      // base spin, damped hard as it composes so the screen faces the viewer
      rot += dt * 0.09 * (1 - m12 * 0.92);
      const compFace = 1 - m12; // release rotation influence when composed
      const breathe = 1 + 0.02 * Math.sin(t * 0.8);
      draw(rot * compFace + yawOff * (1 - 0.75 * m12), -0.12 + pitchOff * (1 - 0.6 * m12), breathe * 0.96);
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
      if (!coarse) window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost, false);
      canvas.removeEventListener("webglcontextrestored", onRestored, false);
      disposeGL();
    };
  }, [epoch]);

  if (failed) {
    // static CSS wireframe fallback — always shows *something* on the right
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
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
