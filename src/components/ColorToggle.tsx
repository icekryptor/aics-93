"use client";

import { useEffect, useState } from "react";

// Small floating button that swaps the greyscale background gradient for a
// colourful one (orange / purple / pink / green) and back.
export default function ColorToggle() {
  const [color, setColor] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("aics-color") === "1";
    if (saved) {
      document.documentElement.classList.add("color-mode");
      setColor(true);
    }
  }, []);

  const toggle = () => {
    const next = !color;
    setColor(next);
    document.documentElement.classList.toggle("color-mode", next);
    try {
      localStorage.setItem("aics-color", next ? "1" : "0");
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={color}
      title={color ? "Вернуть монохром" : "Добавить красок"}
      className="group fixed bottom-5 right-5 z-[120] flex items-center gap-2 rounded-full border border-ink/15 bg-bg/70 py-1.5 pl-1.5 pr-3.5 text-[12px] font-medium text-ink shadow-[0_8px_30px_-12px_rgba(48,32,85,0.35)] backdrop-blur-md transition-all hover:scale-[1.03]"
    >
      <span
        className="size-6 rounded-full ring-1 ring-black/5 transition-transform group-active:scale-90"
        style={{
          background: color
            ? "conic-gradient(#9ca3af, #d1d5db, #9ca3af, #e5e7eb, #9ca3af)"
            : // official AICS-93 palette: violet / mild / constructive / destructive
              "conic-gradient(#9747ff, #ccbbee, #c5ff44, #ff7050, #9747ff)",
        }}
      />
      <span className="tech-label text-[11px]">
        {color ? "монохром" : "добавить яркости"}
      </span>
    </button>
  );
}
