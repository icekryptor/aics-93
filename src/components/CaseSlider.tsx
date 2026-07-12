"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
  useRef,
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

export default function CaseSlider() {
  const total = slides.length;
  // infinite track: [last, ...slides, first]; pos 1..total are the real
  // slides, 0 and total+1 are clones that silently snap to the other end
  const extSlides: Project[] = total > 1 ? [slides[total - 1], ...slides, slides[0]] : slides;
  const [pos, setPos] = useState(1);
  const [noTrans, setNoTrans] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [reduced, setReduced] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const capturedRef = useRef(false);
  const startXRef = useRef(0);
  const dxRef = useRef(0);
  const releasedDxRef = useRef(0);

  const displayIdx = (((pos - 1) % total) + total) % total;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // reduced-motion has no transitionend — normalize clone positions directly
  useEffect(() => {
    if (!reduced) return;
    if (pos === 0) setPos(total);
    else if (pos === total + 1) setPos(1);
  }, [pos, reduced, total]);

  // safety net: if transitionend is missed (hidden tab, tab switch mid-slide),
  // normalize the clone position after the transition duration anyway
  useEffect(() => {
    if (pos !== 0 && pos !== total + 1) return;
    const id = window.setTimeout(() => {
      setNoTrans(true);
      setPos(pos === 0 ? total : 1);
    }, 780);
    return () => window.clearTimeout(id);
  }, [pos, total]);

  // re-enable transitions one paint after a silent jump
  useEffect(() => {
    if (!noTrans) return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setNoTrans(false));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [noTrans]);

  const onTrackTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (pos === 0) {
      setNoTrans(true);
      setPos(total);
    } else if (pos === total + 1) {
      setNoTrans(true);
      setPos(1);
    }
  };

  const go = (i: number) => setPos(i + 1);
  const prev = () => setPos((p) => (p <= 0 ? p : p - 1));
  const next = () => setPos((p) => (p >= total + 1 ? p : p + 1));

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
    const dx = e.clientX - startXRef.current;
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
        setPos((p) => Math.max(0, Math.min(total + 1, p - Math.sign(dx))));
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
  const trackTransition = dragging || reduced || noTrans ? "none" : TRACK_TRANSITION;
  const parallax = reduced ? 0 : Math.max(-14, Math.min(14, -offset * 0.06));

  const arrowCls =
    "inline-flex h-11 w-11 min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-[#2c2247] bg-[#0e0a1b]/60 text-lg leading-none text-[#efeaff] backdrop-blur-sm transition-colors hover:border-[#9747ff] hover:text-[#b57bff]";

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

      {/* top row: eyebrow · counter + arrows (top-right) */}
      <header className="relative z-10 flex items-center justify-between gap-4 px-6 pt-7 lg:px-14 lg:pt-8">
        <p className="tech-label text-[#a99fce]">[ кейсы · избранное ]</p>
        <div className="flex items-center gap-4 sm:gap-5">
          <div
            className="flex items-baseline gap-1.5 tabular-nums"
            style={{ fontFamily: "var(--font-display)" }}
            aria-live="polite"
          >
            <span className="text-3xl leading-none text-[#efeaff] md:text-4xl">
              {pad(displayIdx + 1)}
            </span>
            <span className="text-sm leading-none text-[#554488]">/ {pad(total)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={prev} aria-label="предыдущий кейс" className={arrowCls}>
              ←
            </button>
            <button type="button" onClick={next} aria-label="следующий кейс" className={arrowCls}>
              →
            </button>
          </div>
        </div>
      </header>

      {/* stage — each case in its own cut-corner frame; neighbours peek in */}
      <div
        ref={stageRef}
        className="relative z-[1] flex min-h-[62svh] flex-1 select-none py-4 lg:min-h-[68svh] lg:py-5"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        <div
          className="flex w-full items-stretch"
          style={{
            transform: `translateX(calc(6% - ${pos} * 88% + ${offset}px))`,
            transition: trackTransition,
            willChange: "transform",
          }}
          onTransitionEnd={onTrackTransitionEnd}
        >
          {extSlides.map((s, i) => {
            const active = i === pos;
            const realIdx = (((i - 1) % total) + total) % total;
            const isHttp = Boolean(s.link && s.link.startsWith("http"));
            return (
              <article
                key={`${s.name}-${i}`}
                inert={!active}
                aria-hidden={!active}
                aria-label={`кейс ${pad(realIdx + 1)}: ${s.name}`}
                className={`w-[88%] min-w-[88%] shrink-0 px-2 transition-[opacity,transform] duration-700 sm:px-3 ${
                  active ? "opacity-100 scale-100" : "opacity-40 scale-[0.965]"
                }`}
              >
                {/* the case frame */}
                <div
                  className="relative h-full p-px"
                  style={{ clipPath: CLIP, background: "rgba(151,71,255,0.32)" }}
                >
                  <div
                    className="relative h-full"
                    style={{ clipPath: CLIP, background: "rgba(23, 16, 41, 0.55)" }}
                  >
                    <span
                      className="pointer-events-none absolute left-3 top-3 z-10 size-3 border-l border-t border-[rgba(151,71,255,0.6)]"
                      aria-hidden
                    />
                    <span
                      className="pointer-events-none absolute bottom-3 right-3 z-10 size-3 border-b border-r border-[rgba(151,71,255,0.6)]"
                      aria-hidden
                    />
                    <span
                      className="tech-label pointer-events-none absolute right-4 top-3 z-10 hidden text-[9px] text-[#554488] lg:block"
                      aria-hidden
                    >
                      aics · case files
                    </span>

                    <div className="grid h-full grid-cols-1 items-center gap-8 px-6 py-8 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:py-8">
                      {/* LEFT — copy */}
                      <div
                        key={`copy-${i}-${active ? "on" : "off"}`}
                        className={active && !reduced ? "cs-enter" : undefined}
                      >
                        <span
                          aria-hidden
                          className="block select-none text-[clamp(3.4rem,8vw,6.5rem)] font-bold leading-none text-[#9747ff] opacity-[0.16]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {pad(realIdx + 1)}
                        </span>
                        <h3
                          className="relative -mt-[0.55em] uppercase leading-[1.05] text-[#efeaff]"
                          style={{
                            fontSize: "clamp(2rem,4.6vw,4.1rem)",
                          }}
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
                                sizes="(min-width: 1024px) 42vw, 84vw"
                                className="object-cover"
                                draggable={false}
                                priority={i === 1}
                              />
                            </div>
                            <span className="tech-label absolute bottom-3 right-3 rounded-full border border-[#2c2247] bg-[#0e0a1b]/70 px-3 py-1.5 lowercase text-[#a99fce] backdrop-blur-sm">
                              case {pad(realIdx + 1)} / aics archive
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* dots — bottom center */}
      <div className="relative z-10 flex items-center justify-center px-6 pb-7 lg:pb-8">
        {slides.map((s, i) => (
          <button
            key={s.name}
            type="button"
            onClick={() => go(i)}
            aria-label={`кейс ${pad(i + 1)}: ${s.name}`}
            aria-current={i === displayIdx}
            className="group inline-flex h-11 min-h-11 min-w-11 cursor-pointer items-center justify-center px-1"
          >
            <span
              className={
                i === displayIdx
                  ? "signal-grad block h-1 w-10 rounded-full transition-all"
                  : "block h-px w-5 rounded-full bg-[#2c2247] transition-all group-hover:h-0.5 group-hover:bg-[#554488] sm:w-6"
              }
            />
          </button>
        ))}
      </div>
    </section>
  );
}
