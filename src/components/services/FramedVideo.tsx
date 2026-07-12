"use client";

import { useEffect, useRef, useState } from "react";

/**
 * FramedVideo — a looping muted video in a cut-corner HUD frame (same language
 * as the homepage AiProcess block). Poster doubles as the fallback and as the
 * static frame under prefers-reduced-motion. Plays only while on screen.
 */

const FRAME_CUT: React.CSSProperties = {
  clipPath:
    "polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)",
};

type Props = {
  src: string;
  poster: string;
  label?: string;
  alt?: string;
  className?: string;
};

export default function FramedVideo({ src, poster, label, alt, className }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    if (typeof IntersectionObserver === "undefined") {
      v.play().catch(() => {});
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <div
        className="relative p-px"
        style={{
          ...FRAME_CUT,
          background:
            "linear-gradient(150deg, color-mix(in srgb, var(--color-signal) 55%, transparent), color-mix(in srgb, var(--color-signal-2) 20%, transparent) 45%, var(--color-runtime-line, #2c2247))",
        }}
      >
        <div className="relative overflow-hidden" style={{ ...FRAME_CUT, background: "var(--color-runtime, #0e0a1b)" }}>
          <div className="relative aspect-video w-full">
            {reduced ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt={alt ?? ""} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src={src}
                poster={poster}
                muted
                loop
                playsInline
                preload="metadata"
                autoPlay
                aria-hidden="true"
              />
            )}

            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(14,10,27,0.55) 100%)",
              }}
            />

            {(
              [
                { pos: "left-3 top-3", b: "border-l border-t" },
                { pos: "right-3 top-3", b: "border-r border-t" },
                { pos: "left-3 bottom-3", b: "border-l border-b" },
                { pos: "right-3 bottom-3", b: "border-r border-b" },
              ] as const
            ).map((c) => (
              <span
                key={c.pos}
                aria-hidden="true"
                className={`pointer-events-none absolute ${c.pos} ${c.b} h-4 w-4`}
                style={{ borderColor: "color-mix(in srgb, var(--color-signal) 55%, transparent)" }}
              />
            ))}

            {label ? (
              <div
                className="tech-label pointer-events-none absolute bottom-3 left-6 flex items-center gap-2"
                aria-hidden="true"
                style={{
                  fontFamily: "var(--font-sans, inherit)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  color: "var(--color-runtime-ink-soft, #a99fce)",
                }}
              >
                <span
                  className="hud-dot"
                  style={{
                    display: "inline-block",
                    width: 5,
                    height: 5,
                    borderRadius: 999,
                    background: "var(--color-signal, #9747ff)",
                    boxShadow: "0 0 8px var(--color-signal, #9747ff)",
                  }}
                />
                {label}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
