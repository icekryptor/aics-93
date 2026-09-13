"use client";

import { useCallback, useEffect, useState } from "react";
import type { AuditShot } from "@/lib/kp/bigsnt";

/* AuditShotLightbox — крупный кликабельный скриншот пункта аудита.
   В строке — увеличенное превью (мобильный кадр ~220px, десктопный на всю
   колонку), по клику — полноэкранный просмотр с описанием и закрытием по
   клику/Esc. Фидбек 13.09.2026: «картинки видно плохо — сделать больше
   и чтобы открывалось по клику с описанием». */

export default function AuditShotLightbox({ shot }: { shot: AuditShot }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <figure className="m-0">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full cursor-zoom-in rounded-[8px] transition-shadow hover:shadow-[0_10px_30px_-10px_rgba(30,36,48,0.45)]"
          aria-label={`Открыть скриншот: ${shot.caption}`}
        >
          {/* превью обрезано по высоте (верх кадра — самое важное), полный кадр в лайтбоксе */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shot.src}
            alt={shot.alt}
            loading="lazy"
            className="block w-full rounded-[8px] border object-cover object-top"
            style={{
              borderColor: "var(--paper-line)",
              maxWidth: shot.ratio === "mobile" ? 230 : "100%",
              maxHeight: shot.ratio === "mobile" ? 380 : 420,
              margin: shot.ratio === "mobile" ? "0 auto" : undefined,
            }}
          />
        </button>
        <figcaption className="doc-soft mt-2 text-center text-[12px]">
          {shot.caption} · <span style={{ color: "var(--paper-accent)" }}>увеличить</span>
        </figcaption>
      </figure>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={shot.alt}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-4 p-5 sm:p-10"
          style={{ background: "rgba(12,10,20,0.88)", backdropFilter: "blur(6px)" }}
          onClick={close}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shot.src}
            alt={shot.alt}
            className="max-h-[78vh] max-w-full rounded-[10px] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
            style={{ width: "auto" }}
          />
          <div className="max-w-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-[15px] leading-relaxed text-white">{shot.alt}</p>
            <p className="mt-1.5 text-[12.5px] text-white/60">{shot.caption}</p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Закрыть"
            className="absolute right-5 top-5 grid size-10 cursor-pointer place-items-center rounded-full border border-white/25 text-[18px] leading-none text-white transition-colors hover:bg-white/10"
          >
            ×
          </button>
        </div>
      ) : null}
    </>
  );
}
