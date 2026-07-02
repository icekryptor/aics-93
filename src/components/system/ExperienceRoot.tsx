"use client";

import { useEffect } from "react";

// Marks the document as the immersive experience so shared canvas engines
// (GraphCanvas, SalesGears) can switch on their "signal" mode only on "/",
// leaving /classic frozen. No-op visual.
export default function ExperienceRoot() {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-experience", "1");
    return () => html.removeAttribute("data-experience");
  }, []);
  return null;
}
