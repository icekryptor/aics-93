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
};

let geometryCache: Geometry | null = null;

function buildGeometry(): Geometry {
  const n = POINT_COUNT;
  const p0 = new Float32Array(n * 3);
  const p1 = new Float32Array(n * 3);
  const p2 = new Float32Array(n * 3);
  const seed = new Float32Array(n);
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
    // Bias density strongly toward the shell (cortex), sparse core.
    const r = Math.pow(w, 0.22);
    const shell = smoothstepN(0.72, 1, r);
    const rr = r * (1 + shell * 0.085 * wrinkle(dx, dy, dz));
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

  return { p0, p1, p2, seed };
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
uniform mat4 u_proj;
uniform float u_m01;
uniform float u_m12;
uniform float u_yaw;
uniform float u_pitch;
uniform float u_scale;
uniform float u_dpr;
varying float v_near;
varying float v_seed;
void main() {
  vec3 p = mix(mix(a_pos0, a_pos1, u_m01), a_pos2, u_m12) * u_scale;
  float cy = cos(u_yaw);
  float sy = sin(u_yaw);
  vec3 q = vec3(p.x * cy + p.z * sy, p.y, p.z * cy - p.x * sy);
  float cx = cos(u_pitch);
  float sx = sin(u_pitch);
  q = vec3(q.x, q.y * cx - q.z * sx, q.y * sx + q.z * cx);
  float near = clamp((q.z + 1.4) / 2.8, 0.0, 1.0);
  gl_Position = u_proj * vec4(q.x, q.y, q.z - 3.0, 1.0);
  gl_PointSize = clamp(u_dpr * mix(2.2, 5.5, near), 1.0, 60.0);
  v_near = near;
  v_seed = a_seed;
}
`;

const FRAG_SRC = `
precision mediump float;
varying float v_near;
varying float v_seed;
uniform float u_pointer;
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
  vec3 col = mix(deep, soft, v_near);
  float a = 0.26 + 0.5 * v_near;
  if (v_seed > 0.985) {
    col = ink;
    a = 0.92;
  } else if (v_seed > 0.9) {
    col = mid;
    a = 0.72;
  }
  a *= fall * (1.0 + 0.3 * u_pointer);
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

    /* --- program + static buffers --- */
    let program: WebGLProgram | null = null;
    const buffers: WebGLBuffer[] = [];

    const disposeGL = () => {
      if (ctx.isContextLost()) return;
      for (const b of buffers) ctx.deleteBuffer(b);
      if (program) ctx.deleteProgram(program);
    };

    const init = (): UniformLocs | null => {
      const vs = compileShader(ctx, ctx.VERTEX_SHADER, VERT_SRC);
      if (!vs) return null;
      const fs = compileShader(ctx, ctx.FRAGMENT_SHADER, FRAG_SRC);
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
      program = prog;
      ctx.useProgram(prog);

      const geo = getGeometry();
      const attach = (
        name: string,
        data: Float32Array,
        size: number
      ): boolean => {
        const loc = ctx.getAttribLocation(prog, name);
        if (loc < 0) return false;
        const buf = ctx.createBuffer();
        if (!buf) return false;
        buffers.push(buf);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
        ctx.bufferData(ctx.ARRAY_BUFFER, data as BufferSource, ctx.STATIC_DRAW);
        ctx.enableVertexAttribArray(loc);
        ctx.vertexAttribPointer(loc, size, ctx.FLOAT, false, 0, 0);
        return true;
      };
      if (
        !attach("a_pos0", geo.p0, 3) ||
        !attach("a_pos1", geo.p1, 3) ||
        !attach("a_pos2", geo.p2, 3) ||
        !attach("a_seed", geo.seed, 1)
      ) {
        return null;
      }

      const uProj = ctx.getUniformLocation(prog, "u_proj");
      const uM01 = ctx.getUniformLocation(prog, "u_m01");
      const uM12 = ctx.getUniformLocation(prog, "u_m12");
      const uYaw = ctx.getUniformLocation(prog, "u_yaw");
      const uPitch = ctx.getUniformLocation(prog, "u_pitch");
      const uScale = ctx.getUniformLocation(prog, "u_scale");
      const uDpr = ctx.getUniformLocation(prog, "u_dpr");
      const uPointer = ctx.getUniformLocation(prog, "u_pointer");
      if (
        !uProj ||
        !uM01 ||
        !uM12 ||
        !uYaw ||
        !uPitch ||
        !uScale ||
        !uDpr ||
        !uPointer
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

    const updateRect = () => {
      const r = wrap.getBoundingClientRect();
      centerX = r.left + r.width / 2;
      centerY = r.top + r.height / 2;
      halfDiag = Math.sqrt(r.width * r.width + r.height * r.height) / 2;
      const p = clampN(-r.top / Math.max(1, r.height * 0.85), 0, 1);
      m01Target = smoothstepN(0, 0.55, p);
      m12Target = smoothstepN(0.55, 1, p);
    };

    const draw = (yaw: number, pitch: number, scale: number) => {
      ctx.clearColor(0, 0, 0, 0);
      ctx.clear(ctx.COLOR_BUFFER_BIT);
      ctx.uniform1f(locs.m01, m01);
      ctx.uniform1f(locs.m12, m12);
      ctx.uniform1f(locs.yaw, yaw);
      ctx.uniform1f(locs.pitch, pitch);
      ctx.uniform1f(locs.scale, scale);
      ctx.uniform1f(locs.pointer, pointerS);
      ctx.drawArrays(ctx.POINTS, 0, POINT_COUNT);
    };

    // Static frame for prefers-reduced-motion: mid "hybrid" state, no loop.
    const renderStatic = () => {
      m01 = 1;
      m12 = 0;
      pointerS = 0;
      draw(0.55, -0.18, 0.82);
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
      ctx.uniformMatrix4fv(locs.proj, false, projMat);
      ctx.uniform1f(locs.dpr, dpr);
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

      if (coarse) {
        // No cursor influence on touch devices — gentle autonomous drift.
        yawTarget = Math.sin(t * 0.21) * 0.07;
        pitchTarget = Math.cos(t * 0.17) * 0.045;
        pointerTarget = 0;
      } else if (hasPointer) {
        const vw = window.innerWidth || 1;
        const vh = window.innerHeight || 1;
        yawTarget = clampN((px / vw - 0.5) * 0.32, -0.15, 0.15);
        pitchTarget = clampN((py / vh - 0.5) * 0.32, -0.15, 0.15);
        const ddx = px - centerX;
        const ddy = py - centerY;
        pointerTarget = Math.max(
          0,
          1 - Math.sqrt(ddx * ddx + ddy * ddy) / Math.max(1, halfDiag * 1.4)
        );
      }

      m01 += (m01Target - m01) * 0.09;
      m12 += (m12Target - m12) * 0.09;
      yawOff += (yawTarget - yawOff) * 0.05;
      pitchOff += (pitchTarget - pitchOff) * 0.05;
      pointerS += (pointerTarget - pointerS) * 0.06;

      const breathe = 1 + 0.018 * Math.sin(t * 0.85);
      draw(t * 0.05 + yawOff, -0.18 + pitchOff, breathe * 0.82);

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
