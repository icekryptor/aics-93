"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { showcaseCases, type ShowcaseCase, type Shot } from "@/lib/showcase";
import GenerativeCover from "@/components/blog/GenerativeCover";
import PixelDissolve from "./PixelDissolve";

// CaseShowcase — блок «работы» по мокапу Frame 1: стеклянные карточки-кейсы
// (глассморфизм, размытие бэкграунда), слева номер/заголовок/описание/пункты,
// справа сетка скринов (2 деск + 2 моб), сверху-справа pixel-disintegration.
// Фон: цветные круги и пиксельные частицы, движущиеся при скролле с инерцией
// (lerp-задержка) и меньшей скоростью, чем карточки. Механика слайдера
// (drag, бесшовные клоны, reduced-motion) перенесена из прежнего CaseSlider.

const EASE = "cubic-bezier(0.65,0,0.35,1)"; // easeInOut
const TRACK_TRANSITION = `transform 0.75s ${EASE}`;
const DRAG_START_PX = 6;

const pad = (n: number) => String(n).padStart(2, "0");

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* Фон: круги-орбы + пиксельные частицы с лаг-параллаксом              */
/* ------------------------------------------------------------------ */

type Particle = {
  x: number;
  y: number;
  s: number;
  depth: number;
  k: number; // собственная инерция → каждая частица догоняет с своей задержкой
  cur: number;
  phase: number;
  tw: number;
  fl: number;
  fs: number;
  violet: boolean;
};

function BackdropFX({ hostRef }: { hostRef: React.RefObject<HTMLElement | null> }) {
  const orbA = useRef<HTMLDivElement | null>(null);
  const orbB = useRef<HTMLDivElement | null>(null);
  const orbC = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rng = mulberry32(0x517a93);

    let W = 1;
    let H = 1;
    let raf = 0;
    let running = false;
    let intersecting = true;
    let last = 0;
    let t = 0;

    // скорости кругов — заметно меньше скорости контента, знаки разные
    const SPEED = [-0.11, 0.075, -0.05];
    const LERP = 0.055; // инерция — круги «доезжают» после остановки скролла
    const cur = [0, 0, 0];

    const parts: Particle[] = Array.from({ length: 46 }, () => ({
      x: rng(),
      y: rng(),
      s: 1 + rng() * 2.4,
      depth: 0.35 + rng() * 0.85,
      k: 0.02 + rng() * 0.035,
      cur: 0,
      phase: rng() * Math.PI * 2,
      tw: 0.4 + rng() * 0.9,
      fl: 2 + rng() * 5,
      fs: 0.15 + rng() * 0.3,
      violet: rng() < 0.32,
    }));

    function drawParticles() {
      ctx!.clearRect(0, 0, W, H);
      for (const p of parts) {
        const x = p.x * W + Math.sin(t * p.fs + p.phase) * p.fl;
        const y = p.y * H + p.cur + Math.cos(t * p.fs * 0.8 + p.phase) * p.fl * 0.6;
        const a = 0.08 + 0.5 * (0.5 + 0.5 * Math.sin(t * p.tw + p.phase * 1.7));
        ctx!.fillStyle = p.violet
          ? `rgba(181,123,255,${a.toFixed(3)})`
          : `rgba(239,234,255,${(a * 0.8).toFixed(3)})`;
        ctx!.fillRect(x, y, p.s, p.s);
      }
    }

    function frame(now: number) {
      if (last === 0) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;

      const top = host!.getBoundingClientRect().top;
      for (let i = 0; i < 3; i++) cur[i] += (top * SPEED[i] - cur[i]) * LERP;
      if (orbA.current) orbA.current.style.transform = `translate3d(0, ${cur[0].toFixed(2)}px, 0)`;
      if (orbB.current) orbB.current.style.transform = `translate3d(0, ${cur[1].toFixed(2)}px, 0)`;
      if (orbC.current) orbC.current.style.transform = `translate3d(0, ${cur[2].toFixed(2)}px, 0)`;

      for (const p of parts) p.cur += (top * -0.09 * p.depth - p.cur) * p.k;
      drawParticles();

      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    }
    function sync() {
      if (intersecting && !document.hidden && !reduced) start();
      else stop();
    }

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = host!.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      t = 1;
      drawParticles(); // статичный кадр (reduced-motion / до первого rAF)
    }

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(
      (es) => {
        intersecting = es[0]?.isIntersecting ?? true;
        sync();
      },
      { threshold: 0.03 }
    );
    io.observe(host);
    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);

    resize();
    sync();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [hostRef]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* розовый круг — верх-право (как в мокапе) */}
      <div
        ref={orbA}
        className="absolute -right-[11%] -top-[20%] size-[26rem] rounded-full opacity-75 sm:size-[38rem]"
        style={{
          background: "linear-gradient(205deg, #ff9ad5 0%, #ff3d9c 55%, #d316ff 100%)",
          willChange: "transform",
        }}
      />
      {/* фиолетовый круг — низ-лево, частично под карточкой */}
      <div
        ref={orbB}
        className="absolute -bottom-[20%] -left-[12%] size-[24rem] rounded-full opacity-75 sm:size-[34rem]"
        style={{
          background: "linear-gradient(25deg, #6703ff 0%, #9747ff 60%, #c856ff 100%)",
          willChange: "transform",
        }}
      />
      {/* малый мягкий круг — центр-лево */}
      <div
        ref={orbC}
        className="absolute left-[5%] top-[38%] size-36 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle at 40% 35%, #efeaff 0%, rgba(239,234,255,0) 70%)",
          willChange: "transform",
        }}
      />
      {/* пиксельные частицы */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Скрины кейса                                                        */
/* ------------------------------------------------------------------ */

function ShotCell({
  shot,
  accent,
  seed,
  className,
  priority,
}: {
  shot: Shot;
  accent: string;
  seed: string;
  className?: string;
  priority?: boolean;
}) {
  // по Figma: радиус 10px; деск-скрины с фиолетовой рамкой, мобильные — с тенью
  const frame =
    shot.kind === "desktop"
      ? "border border-[#9057ff]/80"
      : "shadow-[0_10px_25px_rgba(0,0,0,0.5)]";
  return (
    <div
      className={`relative overflow-hidden rounded-[10px] bg-[#150e28] ${frame} ${className ?? ""}`}
    >
      {shot.src ? (
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="(min-width: 1024px) 30vw, 88vw"
          className="object-cover object-top"
          draggable={false}
          priority={priority}
        />
      ) : (
        <>
          <GenerativeCover seed={seed} accent={accent} className="absolute inset-0" />
          <span className="tech-label absolute bottom-2 right-2 rounded-md border border-white/15 bg-black/40 px-2 py-1 text-[9px] text-white/70 backdrop-blur-sm">
            {shot.kind === "mobile" ? "моб · скрин скоро" : "деск · скрин скоро"}
          </span>
        </>
      )}
    </div>
  );
}

function ShotsGrid({
  c,
  idx,
  parallax,
  animate,
  priority,
}: {
  c: ShowcaseCase;
  idx: number;
  parallax: number;
  animate: boolean;
  priority: boolean;
}) {
  const shots = c.shots.slice(0, 4);
  const four = shots.length >= 4;
  return (
    <div
      style={{
        transform: `translateX(${parallax}px)`,
        transition: animate ? TRACK_TRANSITION : "none",
        willChange: "transform",
      }}
    >
      {four ? (
        // сетка Figma: деск:моб = 4:1 по ширине, ряды 0.87:1, общий блок ≈13/12
        <div className="grid aspect-[13/12] grid-cols-5 grid-rows-[0.87fr_1fr] gap-3 sm:gap-3.5">
          {shots.map((s, i) => (
            <ShotCell
              key={i}
              shot={s}
              accent={c.accent}
              seed={`${c.title}-${i}`}
              className={s.kind === "desktop" ? "col-span-4" : "col-span-1"}
              priority={priority && i === 0}
            />
          ))}
        </div>
      ) : (
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 blur-2xl"
            style={{
              background: `radial-gradient(closest-side, ${c.accent}40, transparent 70%)`,
            }}
          />
          <ShotCell
            shot={shots[0]}
            accent={c.accent}
            seed={`${c.title}-0`}
            className="aspect-[16/11]"
            priority={priority}
          />
        </div>
      )}
      <span className="sr-only">кейс {pad(idx + 1)}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Слайдер                                                             */
/* ------------------------------------------------------------------ */

export default function CaseShowcase() {
  const slides = showcaseCases;
  const total = slides.length;
  // бесшовный трек: [последний, ...слайды, первый]; 1..total — реальные,
  // 0 и total+1 — клоны, тихо перескакивающие на другой конец
  const extSlides: ShowcaseCase[] = total > 1 ? [slides[total - 1], ...slides, slides[0]] : slides;
  const [pos, setPos] = useState(1);
  const [noTrans, setNoTrans] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [reduced, setReduced] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
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

  // reduced-motion не даёт transitionend — нормализуем клоны напрямую
  useEffect(() => {
    if (!reduced) return;
    if (pos === 0) setPos(total);
    else if (pos === total + 1) setPos(1);
  }, [pos, reduced, total]);

  // страховка: если transitionend потерян (скрытая вкладка) — нормализуем по таймеру
  useEffect(() => {
    if (pos !== 0 && pos !== total + 1) return;
    const id = window.setTimeout(() => {
      setNoTrans(true);
      setPos(pos === 0 ? total : 1);
    }, 820);
    return () => window.clearTimeout(id);
  }, [pos, total]);

  // вернуть transition через кадр после тихого прыжка
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

  const prev = () => setPos((p) => (p <= 0 ? p : p - 1));
  const next = () => setPos((p) => (p >= total + 1 ? p : p + 1));

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (pointerIdRef.current !== null) return;
    pointerIdRef.current = e.pointerId;
    capturedRef.current = false;
    startXRef.current = e.clientX;
    dxRef.current = 0;
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== pointerIdRef.current) return;
    const dx = e.clientX - startXRef.current;
    if (!capturedRef.current) {
      if (Math.abs(dx) < DRAG_START_PX) return;
      capturedRef.current = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* pointer уже ушёл — продолжаем по всплывающим событиям */
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

  // погасить случайный клик по ссылке после реального драга
  const onClickCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (Math.abs(releasedDxRef.current) > 10) {
      e.preventDefault();
      e.stopPropagation();
    }
    releasedDxRef.current = 0;
  };

  const offset = dragging ? dragX : 0;
  const trackTransition = dragging || reduced || noTrans ? "none" : TRACK_TRANSITION;
  const shotParallax = reduced ? 0 : Math.max(-12, Math.min(12, -offset * 0.05));

  // градиентные круги-стрелки (Ellipse1 из Figma)
  const arrowCls =
    "inline-flex h-14 w-14 min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full text-xl leading-none text-white transition-transform hover:scale-105";
  const arrowStyle: React.CSSProperties = {
    background: "linear-gradient(140deg, #9a6bff 0%, #6d34e8 55%, #4c1fb0 100%)",
    boxShadow: "0 14px 30px -12px rgba(103,3,255,0.65)",
  };

  return (
    <section
      id="prtf"
      ref={sectionRef}
      aria-roledescription="карусель"
      aria-label="Кейсы — избранное"
      className="runtime relative flex min-h-[100svh] scroll-mt-24 flex-col overflow-hidden bg-[#120e22]"
    >
      <style>{`
        @keyframes csEnter {
          from { transform: translate3d(0, 26px, 0); }
          to { transform: translate3d(0, 0, 0); }
        }
        .cs-enter { animation: csEnter 0.7s ${EASE} both; }
        @media (prefers-reduced-motion: reduce) {
          .cs-enter { animation: none; }
        }
      `}</style>

      {/* фон: круги + частицы (инерционный параллакс) */}
      <BackdropFX hostRef={sectionRef} />

      {/* верх: глазок */}
      <header className="relative z-10 flex items-center justify-between gap-4 px-6 pt-7 lg:px-14 lg:pt-8">
        <p className="tech-label text-[#b3a8d9]">[ кейсы · избранное ]</p>
      </header>

      {/* сцена — карточки; соседние подглядывают с краёв */}
      <div
        ref={stageRef}
        className="relative z-[1] flex min-h-[62svh] flex-1 select-none items-center py-4 lg:py-5"
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
          {extSlides.map((c, i) => {
            const active = i === pos;
            const realIdx = (((i - 1) % total) + total) % total;
            const isHttp = Boolean(c.href && c.href.startsWith("http"));
            return (
              <article
                key={`${c.title}-${i}`}
                inert={!active}
                aria-hidden={!active}
                aria-label={`кейс ${pad(realIdx + 1)}: ${c.title}`}
                className={`w-[88%] min-w-[88%] shrink-0 px-2 transition-[opacity,transform] duration-700 sm:px-3 ${
                  active ? "opacity-100 scale-100" : "opacity-40 scale-[0.965]"
                }`}
                style={{ transitionTimingFunction: "cubic-bezier(0.65,0,0.35,1)" }}
              >
                {/* стеклянная карточка — тёмное стекло #261645 (Figma), размывает круги позади */}
                <div className="relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-[#261645]/45 shadow-[0_50px_100px_-50px_rgba(0,0,0,0.7)] backdrop-blur-xl lg:rounded-[40px]">
                  <div className="grid h-full grid-cols-1 items-center gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.08fr] lg:gap-12 lg:p-12">
                    {/* ЛЕВО — номер, заголовок, описание, пункты, CTA */}
                    <div
                      key={`copy-${i}-${active ? "on" : "off"}`}
                      className={active && !reduced ? "cs-enter" : undefined}
                    >
                      {/* номер — Neue Haas Bold 200px/1360, белый 10% (по Figma) */}
                      <span
                        aria-hidden
                        className="block select-none font-bold leading-none text-white/10 text-[clamp(4rem,10.5vw,9.5rem)]"
                      >
                        {pad(realIdx + 1)}
                      </span>
                      <h3
                        className="-mt-[0.45em] max-w-xl uppercase leading-[1.04] tracking-[0.05em] text-[#f2edff]"
                        style={{ fontSize: "clamp(1.9rem,4.2vw,3.5rem)" }}
                      >
                        {c.title}
                      </h3>
                      <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/75">
                        {c.desc}
                      </p>

                      {/* внутренняя стеклянная панель со списком */}
                      <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md sm:p-6">
                        <p className="text-[16px] font-normal text-white/90">что было сделано:</p>
                        {/* заполнение по колонкам, как в мокапе (полколонки слева, полсправа) */}
                        <ul
                          className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 sm:[grid-auto-flow:column]"
                          style={{ gridTemplateRows: `repeat(${Math.ceil(c.bullets.length / 2)}, auto)` }}
                        >
                          {c.bullets.map((b) => (
                            <li
                              key={b}
                              className="flex items-start gap-3 text-[16px] leading-snug text-white/85"
                            >
                              <span
                                aria-hidden
                                className="mt-[6px] block size-0 shrink-0 border-y-[5.5px] border-l-[9px] border-y-transparent"
                                style={{ borderLeftColor: c.accent }}
                              />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {c.href && (
                        <a
                          href={c.href}
                          target={isHttp ? "_blank" : undefined}
                          rel={isHttp ? "noopener noreferrer" : undefined}
                          aria-label={`весь кейс ${c.title} — подробнее`}
                          draggable={false}
                          className="mt-6 inline-flex h-[54px] min-h-11 cursor-pointer items-center rounded-[16px] border border-white/15 bg-white/[0.08] px-9 text-[16px] font-bold text-white backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/[0.13]"
                        >
                          Весь кейс — подробнее
                        </a>
                      )}
                    </div>

                    {/* ПРАВО — wip-бейдж с pixel disintegration + сетка скринов */}
                    <div className="flex flex-col gap-5">
                      {c.wip && (
                        // по Figma: рамка white/50, радиус 5px, без заливки, текст Bold
                        <div className="hidden items-center gap-4 self-end rounded-[5px] border border-white/50 px-4 py-3 md:flex">
                          <span className="text-[15px] font-bold leading-[1.25] text-white">
                            work in
                            <br />
                            progress
                          </span>
                          <PixelDissolve className="h-[56px] w-[250px]" seed={0x93 + realIdx} rows={6} cols={26} />
                        </div>
                      )}
                      <ShotsGrid
                        c={c}
                        idx={realIdx}
                        parallax={shotParallax}
                        animate={!dragging && !reduced}
                        priority={i === 1}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* низ-лево: стрелки + счётчик (по мокапу) */}
      <div className="relative z-10 flex items-center gap-5 px-6 pb-8 lg:px-14">
        <div className="flex items-center gap-3">
          <button type="button" onClick={prev} aria-label="предыдущий кейс" className={arrowCls} style={arrowStyle}>
            ←
          </button>
          <button type="button" onClick={next} aria-label="следующий кейс" className={arrowCls} style={arrowStyle}>
            →
          </button>
        </div>
        <div className="flex items-baseline gap-1.5 font-bold tabular-nums" aria-live="polite">
          <span className="text-2xl leading-none text-[#efeaff]">{pad(displayIdx + 1)}</span>
          <span className="text-sm leading-none text-white/35">/ {pad(total)}</span>
        </div>
      </div>
    </section>
  );
}
