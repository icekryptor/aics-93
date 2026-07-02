"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { featured, cases, type Project } from "@/lib/content";

const CASE_ORDER = ["GO.LD", "ORTHODOCS", "GENIUS CODE", "PRIDE CLUB", "HARMONICUM"] as const;

const slides: Project[] = [
  featured,
  ...CASE_ORDER.map((n) => cases.find((c) => c.name === n)).filter(
    (c): c is Project => Boolean(c),
  ),
];

const EASE = "cubic-bezier(0.22,1,0.36,1)";
const TRACK_TRANSITION = `transform 0.7s ${EASE}`;
const DRAG_START_PX = 6;
const CLIP =
  "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)";

const pad = (n: number): string => String(n).padStart(2, "0");
const clampIndex = (v: number): number => Math.max(0, Math.min(slides.length - 1, v));

export default function CaseSlider() {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [reduced, setReduced] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const capturedRef = useRef(false);
  const startXRef = useRef(0);
  const dxRef = useRef(0);
  const releasedDxRef = useRef(0);

  const total = slides.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const go = (i: number) => setIndex(clampIndex(i));
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (pointerIdRef.current !== null) return; // ignore second finger
    pointerIdRef.current = e.pointerId;
    capturedRef.current = false;
    startXRef.current = e.clientX;
    dxRef.current = 0;
    // NOTE: do NOT capture the pointer here — capturing on pointerdown retargets
    // the eventual `click` to the stage and breaks links/buttons inside slides.
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== pointerIdRef.current) return;
    let dx = e.clientX - startXRef.current;
    if (!capturedRef.current) {
      if (Math.abs(dx) < DRAG_START_PX) return; // not a drag yet
      capturedRef.current = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* pointer already gone — keep tracking via bubbling events */
      }
      setDragging(true);
    }
    // resistance at the ends
    if ((index === 0 && dx > 0) || (index === total - 1 && dx < 0)) dx *= 0.35;
    dxRef.current = dx;
    setDragX(dx);
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== pointerIdRef.current) return;
    pointerIdRef.current = null;
    releasedDxRef.current = dxRef.current;
    if (capturedRef.current) {
      capturedRef.current = false;
      const width = stageRef.current?.clientWidth ?? 1;
      const dx = dxRef.current;
      if (e.type !== "pointercancel" && Math.abs(dx) > width * 0.12) {
        setIndex((i) => clampIndex(i - Math.sign(dx)));
      }
      setDragging(false);
      setDragX(0);
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    }
    dxRef.current = 0;
  };

  // suppress accidental link clicks after a real drag
  const onClickCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (Math.abs(releasedDxRef.current) > 10) {
      e.preventDefault();
      e.stopPropagation();
    }
    releasedDxRef.current = 0;
  };

  const offset = dragging ? dragX : 0;
  const trackTransition = dragging || reduced ? "none" : TRACK_TRANSITION;
  const parallax = reduced ? 0 : Math.max(-14, Math.min(14, -offset * 0.06));

  return (
    <section
      id="prtf"
      aria-roledescription="карусель"
      aria-label="Кейсы — избранное"
      className="runtime relative flex min-h-[100svh] scroll-mt-24 flex-col overflow-hidden"
    >
      <style>{`
        @keyframes csEnter {
          from { transform: translate3d(0, 26px, 0); }
          to { transform: translate3d(0, 0, 0); }
        }
        .cs-enter { animation: csEnter 0.65s ${EASE} both; }
        @media (prefers-reduced-motion: reduce) {
          .cs-enter { animation: none; }
        }
      `}</style>

      {/* backdrop */}
      <div aria-hidden className="runtime-grid pointer-events-none absolute inset-0 opacity-30" />
      <div aria-hidden className="signal-seam absolute inset-x-0 top-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[34rem] w-[34rem] blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(151,71,255,0.18), transparent 70%)" }}
      />

      {/* top row */}
      <header className="relative z-10 flex items-end justify-between gap-4 px-6 pt-8 lg:px-14 lg:pt-10">
        <p className="tech-label text-[#a99fce]">[ кейсы · избранное ]</p>
        <div
          className="flex items-baseline gap-1.5 tabular-nums"
          style={{ fontFamily: "var(--font-display)" }}
          aria-live="polite"
        >
          <span className="text-3xl leading-none text-[#efeaff] md:text-4xl">{pad(index + 1)}</span>
          <span className="text-sm leading-none text-[#554488]">/ {pad(total)}</span>
        </div>
      </header>

      {/* stage */}
      <div
        ref={stageRef}
        className="relative z-[1] flex-1 select-none"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        <div
          className="flex h-full"
          style={{
            transform: `translateX(calc(${-index * 100}% + ${offset}px))`,
            transition: trackTransition,
            willChange: "transform",
          }}
        >
          {slides.map((s, i) => {
            const active = i === index;
            const isHttp = Boolean(s.link && s.link.startsWith("http"));
            return (
              <article
                key={s.name}
                inert={!active}
                aria-hidden={!active}
                aria-label={`кейс ${pad(i + 1)}: ${s.name}`}
                className="grid w-full min-w-full shrink-0 grid-cols-1 items-center gap-8 px-6 py-8 lg:grid-cols-2 lg:gap-14 lg:px-14 lg:py-6"
              >
                {/* LEFT — copy */}
                <div
                  key={`copy-${i}-${active ? "on" : "off"}`}
                  className={active && !reduced ? "cs-enter" : undefined}
                >
                  <span
                    aria-hidden
                    className="block select-none text-[clamp(4rem,9vw,7.5rem)] font-bold leading-none text-[#9747ff] opacity-[0.16]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {pad(i + 1)}
                  </span>
                  <h3
                    className="relative -mt-[0.55em] uppercase leading-[1.05] text-[#efeaff]"
                    style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,5vw,4.5rem)" }}
                  >
                    {s.name}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-[#a99fce] md:text-lg">
                    {s.subtitle}
                  </p>

                  {s.tags && s.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="tech-label rounded-full border border-[#2c2247] px-3 py-1.5 lowercase text-[#a99fce]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {s.services.length > 0 && (
                    <ul className="mt-7 grid max-w-xl grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
                      {s.services.map((sv, k) => (
                        <li
                          key={sv}
                          className="flex items-baseline gap-3 border-b border-[#2c2247] pb-2.5"
                        >
                          <span
                            className="tech-label shrink-0 text-[#9747ff]"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {pad(k + 1)}
                          </span>
                          <span className="text-sm leading-snug text-[#a99fce]">{sv}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {s.link && (
                    <a
                      href={s.link}
                      target={isHttp ? "_blank" : undefined}
                      rel={isHttp ? "noopener noreferrer" : undefined}
                      aria-label={`смотреть проект ${s.name}`}
                      className="signal-grad mt-8 inline-flex h-11 min-h-11 cursor-pointer items-center gap-2 rounded-full px-6 text-sm font-semibold text-[#0e0a1b]"
                      draggable={false}
                    >
                      смотреть проект <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>

                {/* RIGHT — framed image */}
                <div className="relative">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-8 blur-2xl"
                    style={{
                      background:
                        "radial-gradient(closest-side, rgba(151,71,255,0.35), transparent 70%)",
                    }}
                  />
                  <div
                    className="relative p-px"
                    style={{ clipPath: CLIP, background: "rgba(151,71,255,0.35)" }}
                  >
                    <div
                      className="relative aspect-[16/11] overflow-hidden"
                      style={{ clipPath: CLIP, background: "#171029" }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          transform: `translateX(${parallax}px) scale(1.06)`,
                          transition: dragging || reduced ? "none" : TRACK_TRANSITION,
                          willChange: "transform",
                        }}
                      >
                        <Image
                          src={s.image}
                          alt={s.name}
                          fill
                          sizes="(min-width: 1024px) 46vw, 92vw"
                          className="object-cover"
                          draggable={false}
                          priority={i === 0}
                        />
                      </div>
                      <span className="tech-label absolute bottom-3 right-3 rounded-full border border-[#2c2247] bg-[#0e0a1b]/70 px-3 py-1.5 lowercase text-[#a99fce] backdrop-blur-sm">
                        case {pad(i + 1)} / aics archive
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* bottom controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-6 pb-8 lg:px-14 lg:pb-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prev}
            aria-label="предыдущий кейс"
            className="inline-flex h-11 w-11 min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-[#2c2247] text-lg leading-none text-[#efeaff] transition-colors hover:border-[#9747ff] hover:text-[#b57bff]"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="следующий кейс"
            className="inline-flex h-11 w-11 min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-[#2c2247] text-lg leading-none text-[#efeaff] transition-colors hover:border-[#9747ff] hover:text-[#b57bff]"
          >
            →
          </button>
        </div>

        <div className="flex items-center">
          {slides.map((s, i) => (
            <button
              key={s.name}
              type="button"
              onClick={() => go(i)}
              aria-label={`кейс ${pad(i + 1)}: ${s.name}`}
              aria-current={i === index}
              className="group inline-flex h-11 min-h-11 min-w-11 cursor-pointer items-center justify-center px-1"
            >
              <span
                className={
                  i === index
                    ? "signal-grad block h-1 w-10 rounded-full transition-all"
                    : "block h-px w-5 rounded-full bg-[#2c2247] transition-all group-hover:h-0.5 group-hover:bg-[#554488] sm:w-6"
                }
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
