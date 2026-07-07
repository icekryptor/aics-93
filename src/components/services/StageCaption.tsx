"use client";

import { useEffect, useState } from "react";

// Live caption for SiteBuilderGL — highlights the active stage. Syncs to the
// "aics:sitestate" event the GL component dispatches on each stage change.
const STAGES = ["данные", "прототип", "реализация"];

export default function StageCaption({ className }: { className?: string }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const h = (e: Event) => {
      const s = (e as CustomEvent).detail;
      if (typeof s === "number") setStage(s);
    };
    window.addEventListener("aics:sitestate", h);
    return () => window.removeEventListener("aics:sitestate", h);
  }, []);

  return (
    <span
      className={className}
      aria-hidden
      style={{ letterSpacing: "0.22em", fontVariantNumeric: "tabular-nums" }}
    >
      {STAGES.map((n, i) => (
        <span key={n}>
          <span
            style={{
              color: i === stage ? "var(--color-signal-cool)" : undefined,
              opacity: i === stage ? 1 : 0.4,
              transition: "opacity 0.35s ease, color 0.35s ease",
            }}
          >
            {n}
          </span>
          {i < STAGES.length - 1 ? <span style={{ opacity: 0.4 }}> · </span> : null}
        </span>
      ))}
    </span>
  );
}
