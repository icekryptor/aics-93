"use client";

import { useEffect, useRef } from "react";

/* CardVideo — обложка-видео карточки услуги: muted loop, стартует только
   во вьюпорте (IntersectionObserver), вне — пауза; preload="none" +
   постер, чтобы 4 ролика не грузились до скролла. reduced-motion —
   остаётся постер, видео не запускается. */

export default function CardVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (es) => {
        const on = es[0]?.isIntersecting ?? false;
        if (on) {
          v.play().catch(() => {
            /* autoplay заблокирован — остаётся постер */
          });
        } else {
          v.pause();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      className={`h-full w-full object-cover ${className ?? ""}`}
    />
  );
}
