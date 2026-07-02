"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ShaderBackground
 * A fixed, full-viewport RAW WebGL fragment-shader ambient background.
 *
 * - Subtle, slow-drifting neural/plasma field of faint violet filaments over a
 *   near-light field (matches the page bg #ececeb) — reads as ambient depth,
 *   not a loud background.
 * - Graceful no-op if WebGL is unavailable.
 * - DPR-aware (cap 2), ResizeObserver-driven, rAF paused on document.hidden.
 * - prefers-reduced-motion: renders exactly ONE static frame and stops.
 * - color-mode class on <html> pushes saturation/contrast a bit higher.
 */

const VERT_SRC = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision mediump float;

uniform float u_time;
uniform vec2  u_res;
uniform vec2  u_pointer;   // 0..1 in viewport space
uniform float u_mode;      // 0 = default, 1 = color-mode

// hash / value-noise building blocks
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// 3-octave fbm — cheap
float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 3; i++) {
    v += amp * noise(p);
    p = rot * p * 2.02;
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  // aspect-correct domain so filaments aren't stretched
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 p = uv;
  p.x *= aspect;

  float t = u_time * 0.035;

  // domain-warped fbm → soft flowing veins
  vec2 q = vec2(fbm(p * 1.6 + vec2(0.0, t)),
                fbm(p * 1.6 + vec2(3.4, -t)));
  vec2 r = vec2(fbm(p * 1.8 + q * 1.4 + vec2(1.7, 9.2) + t * 0.5),
                fbm(p * 1.8 + q * 1.4 + vec2(8.3, 2.8) - t * 0.4));
  float f = fbm(p * 2.2 + r * 1.2);

  // ridged component → thin filament lines
  float filament = 1.0 - abs(f - 0.5) * 2.0;
  filament = pow(clamp(filament, 0.0, 1.0), 3.5);

  // gentle pointer influence: a faint local lift near the cursor
  float pd = distance(uv, u_pointer);
  float glow = smoothstep(0.42, 0.0, pd) * 0.16;

  // signal palette: #8b67ff -> #c856ff -> cool #56b8ff hint
  vec3 signalA = vec3(0.545, 0.404, 1.0);   // #8b67ff
  vec3 signalB = vec3(0.784, 0.337, 1.0);   // #c856ff
  vec3 signalC = vec3(0.337, 0.722, 1.0);   // #56b8ff

  float mixT = clamp(r.x + q.y * 0.5, 0.0, 1.0);
  vec3 signal = mix(signalA, signalB, mixT);
  signal = mix(signal, signalC, clamp(q.x * 0.35, 0.0, 0.35));

  // mono (default) desaturates the veins to graphite; color-mode restores the
  // full violet→magenta→cyan spectrum. This is the mono↔colour background toggle.
  float m = clamp(u_mode, 0.0, 1.0);
  float lum = dot(signal, vec3(0.299, 0.587, 0.114));
  vec3 grey = vec3(lum * 0.92);
  signal = mix(grey, signal, m);

  // intensity of the veins
  float intensity = filament * (0.30 + 0.55 * f) + glow;

  // color-mode: richer, a touch more contrast
  float modeBoost = mix(1.0, 1.45, m);
  intensity *= modeBoost;

  // keep it FAINT — near-light field, low-alpha violet on top
  float alpha = clamp(intensity * 0.22, 0.0, 0.30);

  // slight vertical falloff so top reads a touch calmer
  alpha *= mix(0.65, 1.0, smoothstep(0.0, 1.0, uv.y));

  // premultiplied-friendly output
  vec3 col = signal * alpha;
  gl_FragColor = vec4(col, alpha);
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
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // bump to fully re-init GL after a context-restored event
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // re-run the whole effect (fresh context + program) when the GPU restores
    const onContextRestored = () => setEpoch((n) => n + 1);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);
    const cleanupEarly = () =>
      canvas.removeEventListener("webglcontextrestored", onContextRestored, false);

    let gl: WebGLRenderingContext | null = null;
    try {
      gl =
        (canvas.getContext("webgl", {
          alpha: true,
          premultipliedAlpha: true,
          antialias: false,
          depth: false,
          stencil: false,
        }) as WebGLRenderingContext | null) ||
        (canvas.getContext(
          "experimental-webgl"
        ) as WebGLRenderingContext | null);
    } catch {
      gl = null;
    }

    // Graceful no-op — never throw.
    if (!gl) return cleanupEarly;
    const ctx = gl;

    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- program setup ---
    const vs = compileShader(ctx, ctx.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(ctx, ctx.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return cleanupEarly;

    const program = ctx.createProgram();
    if (!program) return cleanupEarly;
    ctx.attachShader(program, vs);
    ctx.attachShader(program, fs);
    ctx.linkProgram(program);
    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
      ctx.deleteProgram(program);
      ctx.deleteShader(vs);
      ctx.deleteShader(fs);
      return cleanupEarly;
    }
    ctx.useProgram(program);

    // fullscreen quad (single oversized triangle)
    const buffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
    ctx.bufferData(
      ctx.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      ctx.STATIC_DRAW
    );

    const aPos = ctx.getAttribLocation(program, "a_pos");
    if (aPos >= 0) {
      ctx.enableVertexAttribArray(aPos);
      ctx.vertexAttribPointer(aPos, 2, ctx.FLOAT, false, 0, 0);
    }

    const uTime = ctx.getUniformLocation(program, "u_time");
    const uRes = ctx.getUniformLocation(program, "u_res");
    const uPointer = ctx.getUniformLocation(program, "u_pointer");
    const uMode = ctx.getUniformLocation(program, "u_mode");

    ctx.disable(ctx.DEPTH_TEST);
    ctx.enable(ctx.BLEND);
    // premultiplied alpha blend so the CSS page bg shows through
    ctx.blendFunc(ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
    ctx.clearColor(0, 0, 0, 0);

    // --- state ---
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let width = 1;
    let height = 1;
    const pointer = { x: 0.5, y: 0.5 };
    const pointerTarget = { x: 0.5, y: 0.5 };
    let rafId = 0;
    let running = false;
    let disposed = false;

    // Accumulated-time model so pause/resume never corrupts elapsed time.
    let accumulated = 0; // seconds of animation time already elapsed
    let epoch = 0; // performance.now() at the last (re)start

    const isColorMode = () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("color-mode");

    function resize() {
      if (!canvas || disposed) return;
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      ctx.viewport(0, 0, w, h);
    }

    function renderFrame(elapsed: number) {
      if (disposed) return;
      // ease pointer toward target for smoothness
      pointer.x += (pointerTarget.x - pointer.x) * 0.06;
      pointer.y += (pointerTarget.y - pointer.y) * 0.06;

      if (uTime !== null) ctx.uniform1f(uTime, elapsed);
      if (uRes !== null) ctx.uniform2f(uRes, width, height);
      if (uPointer !== null) ctx.uniform2f(uPointer, pointer.x, pointer.y);
      if (uMode !== null) ctx.uniform1f(uMode, isColorMode() ? 1 : 0);

      ctx.clear(ctx.COLOR_BUFFER_BIT);
      ctx.drawArrays(ctx.TRIANGLES, 0, 3);
    }

    function loop(now: number) {
      if (!running || disposed) return;
      const elapsed = accumulated + (now - epoch) / 1000;
      renderFrame(elapsed);
      rafId = window.requestAnimationFrame(loop);
    }

    function start() {
      if (running || disposed || reduceMotion) return;
      running = true;
      epoch = performance.now();
      rafId = window.requestAnimationFrame(loop);
    }

    function stop() {
      if (running) {
        // bank the time run so far, keeping animation continuous on resume
        accumulated += (performance.now() - epoch) / 1000;
      }
      running = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    // pointer throttled with rAF
    let pointerRaf = 0;
    function onPointerMove(e: PointerEvent) {
      if (pointerRaf) return;
      pointerRaf = window.requestAnimationFrame(() => {
        pointerRaf = 0;
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        pointerTarget.x = e.clientX / w;
        // flip Y for gl_FragCoord space
        pointerTarget.y = 1 - e.clientY / h;
      });
    }

    function onVisibility() {
      if (reduceMotion) return;
      if (document.hidden) stop();
      else start();
    }

    function onContextLost(e: Event) {
      e.preventDefault();
      stop();
    }

    // --- init ---
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            resize();
            if (reduceMotion) {
              // re-render the single static frame at the new size
              renderFrame(accumulated);
            }
          })
        : null;
    if (ro) ro.observe(canvas);

    resize();

    const coarse =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;

    if (!coarse) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    if (reduceMotion) {
      // Render exactly ONE static frame and stop (no loop).
      renderFrame(accumulated);
    } else {
      document.addEventListener("visibilitychange", onVisibility);
      if (!document.hidden) start();
    }

    canvas.addEventListener("webglcontextlost", onContextLost, false);

    // --- cleanup ---
    return () => {
      disposed = true;
      stop();
      if (pointerRaf) cancelAnimationFrame(pointerRaf);
      if (ro) ro.disconnect();
      if (!coarse) window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost, false);
      canvas.removeEventListener("webglcontextrestored", onContextRestored, false);
      try {
        ctx.deleteProgram(program);
        ctx.deleteShader(vs);
        ctx.deleteShader(fs);
        ctx.deleteBuffer(buffer);
      } catch {
        /* ignore */
      }
    };
  }, [epoch]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 h-full w-full"
      style={{
        zIndex: -11,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
