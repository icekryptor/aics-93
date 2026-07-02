"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

type AudioCtor = typeof AudioContext;

interface AmbientNodes {
  ctx: AudioContext;
  master: GainNode;
  osc: OscillatorNode[];
  lfo: OscillatorNode;
  lfoGain: GainNode;
  filter: BiquadFilterNode;
  noise: AudioBufferSourceNode | null;
  noiseGain: GainNode | null;
}

const STORAGE_KEY = "aics_sound";
const BAR_COUNT = 4;

function getAudioCtor(): AudioCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    AudioContext?: AudioCtor;
    webkitAudioContext?: AudioCtor;
  };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

export default function SoundToggle() {
  const [mounted, setMounted] = useState(false);
  const [on, setOn] = useState(false);
  const [reduced, setReduced] = useState(false);
  // Tracks whether an AudioContext has actually been created (i.e. a real
  // user gesture has occurred). Drives whether the eq bars should animate.
  const [audible, setAudible] = useState(false);

  const nodesRef = useRef<AmbientNodes | null>(null);
  const rafRef = useRef<number | null>(null);
  const suspendTimerRef = useRef<number | null>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const phaseRef = useRef<number[]>(
    Array.from({ length: BAR_COUNT }, (_, i) => i * 1.4),
  );

  const clearSuspendTimer = useCallback(() => {
    if (suspendTimerRef.current !== null) {
      window.clearTimeout(suspendTimerRef.current);
      suspendTimerRef.current = null;
    }
  }, []);

  // Mount + read persisted preference + reduced-motion.
  useEffect(() => {
    setMounted(true);
    let initialOn = false;
    try {
      initialOn = window.localStorage.getItem(STORAGE_KEY) === "on";
    } catch {
      initialOn = false;
    }
    setOn(initialOn);

    let mq: MediaQueryList | null = null;
    try {
      mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReduced(mq.matches);
    } catch {
      mq = null;
      setReduced(false);
    }
    if (!mq) return;
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    try {
      mq.addEventListener("change", onChange);
    } catch {
      // Safari <14
      mq.addListener(onChange);
    }
    return () => {
      try {
        mq?.removeEventListener("change", onChange);
      } catch {
        mq?.removeListener(onChange);
      }
    };
  }, []);

  // Build the ambient audio bed. Never throws.
  const buildAmbient = useCallback((): boolean => {
    if (nodesRef.current) return true;
    const Ctor = getAudioCtor();
    if (!Ctor) return false;

    try {
      const ctx = new Ctor();
      const now = ctx.currentTime;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.connect(ctx.destination);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(420, now);
      filter.Q.setValueAtTime(0.7, now);
      filter.connect(master);

      // Two low detuned oscillators -> breathing pad.
      const freqs = [55, 82.5];
      const detunes = [-6, 7];
      const osc: OscillatorNode[] = [];
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = i === 0 ? "sine" : "triangle";
        o.frequency.setValueAtTime(f, now);
        o.detune.setValueAtTime(detunes[i], now);
        const g = ctx.createGain();
        g.gain.setValueAtTime(i === 0 ? 0.6 : 0.4, now);
        o.connect(g);
        g.connect(filter);
        o.start();
        osc.push(o);
      });

      // Slow LFO on master gain for a breathing envelope.
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.08, now);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.025, now);
      lfo.connect(lfoGain);
      lfoGain.connect(master.gain);
      lfo.start();

      // Very quiet filtered noise layer.
      let noise: AudioBufferSourceNode | null = null;
      let noiseGain: GainNode | null = null;
      try {
        const len = Math.floor(ctx.sampleRate * 2);
        const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        // Deterministic shaped noise (no Math.random) via a simple LCG.
        let seed = 1337;
        for (let i = 0; i < len; i++) {
          seed = (seed * 1103515245 + 12345) & 0x7fffffff;
          data[i] = (seed / 0x7fffffff) * 2 - 1;
        }
        noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const nf = ctx.createBiquadFilter();
        nf.type = "lowpass";
        nf.frequency.setValueAtTime(240, now);
        noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.012, now);
        noise.connect(nf);
        nf.connect(noiseGain);
        noiseGain.connect(master);
        noise.start();
      } catch {
        noise = null;
        noiseGain = null;
      }

      nodesRef.current = {
        ctx,
        master,
        osc,
        lfo,
        lfoGain,
        filter,
        noise,
        noiseGain,
      };
      return true;
    } catch {
      nodesRef.current = null;
      return false;
    }
  }, []);

  const enableAudio = useCallback(async (): Promise<boolean> => {
    clearSuspendTimer();
    if (!buildAmbient()) return false;
    const n = nodesRef.current;
    if (!n) return false;
    try {
      if (n.ctx.state === "suspended") {
        await n.ctx.resume();
      }
      const now = n.ctx.currentTime;
      // Soft attack to a very low master level (LFO adds/subtracts around it).
      n.master.gain.cancelScheduledValues(now);
      n.master.gain.setValueAtTime(Math.max(0.0001, n.master.gain.value), now);
      n.master.gain.linearRampToValueAtTime(0.07, now + 1.6);
      setAudible(true);
      return true;
    } catch {
      return false;
    }
  }, [buildAmbient, clearSuspendTimer]);

  const disableAudio = useCallback(() => {
    clearSuspendTimer();
    const n = nodesRef.current;
    if (!n) return;
    try {
      const now = n.ctx.currentTime;
      n.master.gain.cancelScheduledValues(now);
      n.master.gain.setValueAtTime(Math.max(0.0001, n.master.gain.value), now);
      n.master.gain.linearRampToValueAtTime(0.0001, now + 0.6);
      suspendTimerRef.current = window.setTimeout(() => {
        suspendTimerRef.current = null;
        const cur = nodesRef.current;
        if (!cur) return;
        if (cur.ctx.state === "running") {
          cur.ctx.suspend().catch(() => {});
        }
      }, 700);
    } catch {
      /* ignore */
    }
  }, [clearSuspendTimer]);

  // React to programmatic on/off changes (e.g. restored preference). The click
  // handler is the real gesture driver; here we only resume if a context that
  // was already built by a prior gesture exists.
  const didInit = useRef(false);
  useEffect(() => {
    if (!mounted) return;
    if (!didInit.current) {
      didInit.current = true;
      // On restore, do NOT auto-build/resume without a fresh gesture.
      // A context cannot exist yet at first load, so we stay silent until
      // the user clicks. Visual "on" is reconciled once audio becomes audible.
      return;
    }
    if (on) {
      if (nodesRef.current) void enableAudio();
    } else {
      disableAudio();
    }
  }, [on, mounted, enableAudio, disableAudio]);

  // Equalizer bar animation — only while audible (real audio), on, and motion allowed.
  const animate = on && audible && !reduced;
  useEffect(() => {
    if (!mounted) return;
    if (!animate) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      barRefs.current.forEach((el) => {
        if (el) el.style.transform = "scaleY(0.35)";
      });
      return;
    }

    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      const speeds = [2.1, 3.0, 2.6, 3.4];
      for (let i = 0; i < BAR_COUNT; i++) {
        phaseRef.current[i] += dt * speeds[i];
        const v = 0.35 + (Math.sin(phaseRef.current[i]) * 0.5 + 0.5) * 0.65;
        const el = barRefs.current[i];
        if (el) el.style.transform = `scaleY(${v.toFixed(3)})`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const onVis = () => {
      if (document.hidden) {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else if (rafRef.current === null) {
        last = performance.now();
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [animate, mounted]);

  // Full teardown on unmount.
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (suspendTimerRef.current !== null) {
        window.clearTimeout(suspendTimerRef.current);
        suspendTimerRef.current = null;
      }
      const n = nodesRef.current;
      nodesRef.current = null;
      if (n) {
        try {
          n.osc.forEach((o) => {
            try {
              o.stop();
            } catch {
              /* already stopped */
            }
          });
          try {
            n.lfo.stop();
          } catch {
            /* ignore */
          }
          if (n.noise) {
            try {
              n.noise.stop();
            } catch {
              /* ignore */
            }
          }
          if (n.ctx.state !== "closed") {
            n.ctx.close().catch(() => {});
          }
        } catch {
          /* ignore */
        }
      }
    };
  }, []);

  const handleToggle = useCallback(() => {
    setOn((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        /* ignore */
      }
      // The click IS the required user gesture: build/resume from here so the
      // gesture chain stays intact even on the first restored-on interaction.
      if (next) {
        void enableAudio();
      } else {
        disableAudio();
      }
      return next;
    });
  }, [enableAudio, disableAudio]);

  if (!mounted) return null;

  const barStyle: CSSProperties = {
    transformOrigin: "bottom",
    transform: animate ? undefined : "scaleY(0.35)",
    transition: animate ? "none" : "transform 240ms ease",
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={on}
      title={on ? "Ambient sound: on" : "Ambient sound: off"}
      className={[
        "fixed right-5 bottom-[4.75rem] z-50",
        "inline-flex items-center gap-2",
        "rounded-full border px-3 py-1.5",
        "backdrop-blur-md select-none",
        "transition-colors duration-300",
        "hud",
      ].join(" ")}
      style={{
        background: on
          ? "color-mix(in srgb, var(--color-signal) 14%, transparent)"
          : "color-mix(in srgb, var(--color-runtime-2) 78%, transparent)",
        borderColor: on
          ? "color-mix(in srgb, var(--color-signal) 55%, transparent)"
          : "var(--color-runtime-line)",
        color: on ? "var(--color-runtime-ink)" : "var(--color-runtime-ink-soft)",
        boxShadow: on
          ? "0 0 18px -6px color-mix(in srgb, var(--color-signal) 70%, transparent)"
          : "none",
      }}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-3.5 items-end gap-[2px]"
        style={{ width: 16 }}
      >
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <span
            key={i}
            ref={(el) => {
              barRefs.current[i] = el;
            }}
            style={{
              ...barStyle,
              display: "block",
              width: 2.5,
              height: "100%",
              borderRadius: 2,
              background: on
                ? "linear-gradient(to top, var(--color-signal), var(--color-signal-2))"
                : "var(--color-runtime-ink-soft)",
            }}
          />
        ))}
      </span>
      <span
        className="tech-label"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}
      >
        sound
      </span>
    </button>
  );
}
