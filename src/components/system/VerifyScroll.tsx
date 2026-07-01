"use client";

import { useEffect } from "react";

// Verification / deep-link helper: /?to=<sectionId> force-reveals scroll
// animations and jumps to the section (used for deterministic screenshots).
// No-op unless the ?to param is present.
export default function VerifyScroll() {
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get("to");
    if (!to) return;
    const html = document.documentElement;
    html.classList.add("force-reveal");
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    let n = 0;
    const id = window.setInterval(() => {
      document.querySelectorAll(".reveal").forEach((x) => x.classList.add("is-visible"));
      const el = document.getElementById(to);
      if (el) {
        const y = window.scrollY + el.getBoundingClientRect().top;
        window.scrollTo(0, y);
      }
      if (++n >= 16) window.clearInterval(id);
    }, 200);
    return () => {
      window.clearInterval(id);
      html.style.scrollBehavior = prev;
    };
  }, []);
  return null;
}
