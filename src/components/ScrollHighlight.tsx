"use client";

import { useEffect, useRef, useState } from "react";

// Text dims to 50% by default and brightens to 100% once the block scrolls up
// to within 250px of the viewport top.
export default function ScrollHighlight({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setOn(r.top <= 250 && r.bottom >= 80);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p
      ref={ref}
      className={`transition-opacity duration-500 ${on ? "opacity-100" : "opacity-50"} ${className}`}
    >
      {children}
    </p>
  );
}
