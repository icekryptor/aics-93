"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Lenis = {
  scrollTo: (
    target: number | HTMLElement,
    opts?: { offset?: number; duration?: number; immediate?: boolean }
  ) => void;
};

const ACTS = [
  { id: "top", label: "симбиоз" },
  { id: "act-mind", label: "разум" },
  { id: "act-engine", label: "движок" },
  { id: "act-proof", label: "оператор" },
  { id: "act-origin", label: "исток" },
];

const HEADER_OFFSET = 78;

// Desktop "slide deck": a right-side act rail (click to jump), keyboard deck
// navigation (arrows / PageUp-Down / Home / End), and a gentle idle-snap that
// clicks an act into place only when you've nearly stopped on it (never traps
// long sections). Disabled on touch / reduced-motion.
export default function SlideDeck() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const animatingRef = useRef(false);
  const reducedRef = useRef(false);

  const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;
  const els = useCallback(
    () => ACTS.map((a) => document.getElementById(a.id)).filter(Boolean) as HTMLElement[],
    []
  );

  const goTo = useCallback((i: number) => {
    const list = ACTS.map((a) => document.getElementById(a.id));
    const el = list[i];
    if (!el) return;
    const l = lenis();
    animatingRef.current = true;
    window.setTimeout(() => (animatingRef.current = false), 900);
    if (l && !reducedRef.current) {
      l.scrollTo(el, { offset: -HEADER_OFFSET, duration: 1.1 });
    } else {
      const y = window.scrollY + el.getBoundingClientRect().top - HEADER_OFFSET;
      window.scrollTo({ top: y, behavior: reducedRef.current ? "auto" : "smooth" });
    }
  }, []);

  // enable only on desktop + fine pointer
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && wide);
  }, []);

  // active-act tracking + gentle idle snap
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let idle = 0;

    const currentIndex = () => {
      const list = els();
      const probe = window.scrollY + HEADER_OFFSET + window.innerHeight * 0.28;
      let idx = 0;
      list.forEach((el, i) => {
        const top = window.scrollY + el.getBoundingClientRect().top;
        if (top <= probe) idx = i;
      });
      return idx;
    };

    const compute = () => {
      raf = 0;
      const idx = currentIndex();
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };

    const trySnap = () => {
      if (animatingRef.current || reducedRef.current) return;
      const l = lenis();
      if (!l) return;
      const list = els();
      const anchor = window.scrollY + HEADER_OFFSET;
      let best = -1;
      let bestDist = Infinity;
      list.forEach((el, i) => {
        const top = window.scrollY + el.getBoundingClientRect().top - HEADER_OFFSET;
        const d = Math.abs(top - window.scrollY);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      // only snap when already close (≤ 22% of viewport) — never yanks long content
      if (best >= 0 && bestDist > 6 && bestDist < window.innerHeight * 0.22) {
        void anchor;
        goTo(best);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
      window.clearTimeout(idle);
      idle = window.setTimeout(trySnap, 160);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(idle);
      cancelAnimationFrame(raf);
    };
  }, [enabled, els, goTo]);

  // keyboard deck navigation
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      let next = activeRef.current;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") next++;
      else if (e.key === "ArrowUp" || e.key === "PageUp") next--;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = ACTS.length - 1;
      else return;
      e.preventDefault();
      next = Math.max(0, Math.min(ACTS.length - 1, next));
      goTo(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, goTo]);

  if (!enabled) return null;

  return (
    <nav
      aria-label="Слайды"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      <span className="hud mb-1 text-[9px] text-[color-mix(in_srgb,var(--color-signal)_80%,#888)]">
        {String(active + 1).padStart(2, "0")} / {String(ACTS.length).padStart(2, "0")}
      </span>
      {ACTS.map((a, i) => {
        const on = i === active;
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => goTo(i)}
            aria-current={on ? "true" : undefined}
            className="group flex items-center gap-2.5"
            data-cursor={a.label}
          >
            <span
              className={`tech-label whitespace-nowrap text-[10px] transition-all duration-300 ${
                on ? "signal-text opacity-100" : "text-ink-soft opacity-0 group-hover:opacity-100"
              }`}
            >
              {a.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                on
                  ? "signal-grad h-6 w-[3px]"
                  : "h-[3px] w-[3px] bg-ink/30 group-hover:bg-ink/60"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
