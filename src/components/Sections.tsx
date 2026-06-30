import Image from "next/image";
import Reveal from "./Reveal";
import ScrollHighlight from "./ScrollHighlight";
import GraphCanvas from "./GraphCanvas";
import FrameworkCarousel from "./FrameworkCarousel";
import SalesGears from "./SalesGears";
import {
  assets,
  frameworks,
  reasons,
  aboutFacts,
  aboutStats,
  aboutPhoto,
  bio,
  gantt,
} from "@/lib/content";

const CUT = {
  clipPath:
    "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)",
};

type Seg = { t: string; hl?: boolean };

const INTRO_STATEMENTS: Seg[][] = [
  [
    { t: "Я " },
    { t: "мультидисциплинарный дизайнер", hl: true },
    { t: " с релевантным " },
    { t: "бизнес-опытом", hl: true },
    { t: ", навыками " },
    { t: "маркетинга", hl: true },
    { t: " и создания " },
    { t: "продуктов", hl: true },
    { t: "." },
  ],
  [
    { t: "Моя работа — придать " },
    { t: "привлекательные очертания", hl: true },
    { t: " вашему бизнесу для улучшения его " },
    { t: "ключевых показателей", hl: true },
    { t: "." },
  ],
  [
    { t: "С помощью умелого использования " },
    { t: "ИИ", hl: true },
    { t: " мои руки развязаны, и я соединил " },
    { t: "творчество с машинным анализом", hl: true },
    { t: " для получения " },
    { t: "самых точных результатов", hl: true },
    { t: "." },
  ],
];

// staircase indents (lab-tech "лесенка"); inline animated images can later be
// inserted as extra segments inside each statement.
const INTRO_INDENT = ["", "lg:ml-[14%]", "lg:ml-[28%]"];

export function Intro() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-[30px] sm:px-6 lg:py-[50px]">
      <div className="space-y-9">
        {INTRO_STATEMENTS.map((segs, i) => (
          <ScrollHighlight
            key={i}
            className={`max-w-3xl text-[clamp(1.3rem,2.7vw,2.1rem)] font-normal leading-[1.16] tracking-[-0.01em] text-[#333333] ${INTRO_INDENT[i] ?? ""}`}
          >
            {segs.map((s, j) =>
              s.hl ? (
                <span key={j} className="text-black">
                  {s.t}
                </span>
              ) : (
                <span key={j}>{s.t}</span>
              )
            )}
          </ScrollHighlight>
        ))}
      </div>
    </section>
  );
}

export function Frameworks() {
  return (
    <section id="how" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-[30px] sm:px-6 lg:py-[50px]">
      <Reveal>
        <p className="text-[15px] tracking-tight text-ink-soft">
          Какие фреймворки и методологии я использую:
        </p>
        <h2 className="mt-3 text-[clamp(1.6rem,3.4vw,2.5rem)] font-normal leading-tight tracking-[-0.01em]">
          Работаю на данных, а не на догадках
        </h2>
      </Reveal>

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.9fr_1fr] lg:gap-12">
        <Reveal>
          <FrameworkCarousel />
        </Reveal>
        <Reveal delay={120}>
          <GraphCanvas className="h-[300px] w-full overflow-hidden rounded-[24px] bg-bg-soft/70 backdrop-blur-md sm:h-[420px]" />
        </Reveal>
      </div>
    </section>
  );
}

function HexBadge({ n }: { n: string }) {
  return (
    <span className="relative grid size-16 shrink-0 place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
        <polygon
          points="25,4 75,4 96,50 75,96 25,96 4,50"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="3"
        />
      </svg>
      <span className="font-display text-base font-normal text-ink">{n}</span>
    </span>
  );
}

function ReasonItem({
  n,
  title,
  text,
  align = "left",
}: {
  n: string;
  title: string;
  text: string;
  align?: "left" | "right";
}) {
  return (
    <div className={`max-w-[300px] ${align === "right" ? "text-right" : "text-left"}`}>
      <div className={`flex items-start gap-3 ${align === "right" ? "flex-row-reverse" : ""}`}>
        <HexBadge n={n} />
        <h3 className="mt-1.5 text-lg font-semibold leading-tight tracking-tight">{title}</h3>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">{text}</p>
    </div>
  );
}

export function Reasons() {
  // order in data: 0→01 top, 1→02 up-left, 2→03 low-left, 3→04 bottom, 4→05 low-right, 5→06 up-right
  const r = reasons;
  return (
    <section className="mx-auto max-w-7xl px-4 py-[30px] sm:px-6 lg:py-[50px]">
      {/* Mobile / tablet: title + stacked list */}
      <div className="lg:hidden">
        <Reveal>
          <h2 className="font-display text-[clamp(1.6rem,6vw,2.2rem)] font-normal leading-tight tracking-tight">
            6 весомых причин заняться брендингом
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {r.map((x, i) => (
            <Reveal key={x.title} delay={(i % 2) * 70}>
              <ReasonItem n={`0${i + 1}`} title={x.title} text={x.text} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* Desktop: hexagon radial layout */}
      <Reveal className="hidden lg:block">
        <div className="relative mx-auto h-[820px] w-full max-w-[1080px]">
          {/* central hexagon + title */}
          <svg
            viewBox="0 0 460 400"
            className="absolute left-1/2 top-1/2 h-[420px] w-[500px] -translate-x-1/2 -translate-y-1/2"
            aria-hidden
          >
            <polygon
              points="138,6 322,6 454,200 322,394 138,394 6,200"
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="1.5"
            />
          </svg>
          <p className="absolute left-1/2 top-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2 text-center font-display text-[1.7rem] font-normal leading-tight tracking-tight">
            6 весомых причин заняться брендингом
          </p>

          {/* 01 top */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2">
            <ReasonItem n="01" title={r[0].title} text={r[0].text} align="left" />
          </div>
          {/* 02 upper-left */}
          <div className="absolute left-0 top-[28%]">
            <ReasonItem n="02" title={r[1].title} text={r[1].text} align="right" />
          </div>
          {/* 03 lower-left */}
          <div className="absolute left-0 top-[56%]">
            <ReasonItem n="03" title={r[2].title} text={r[2].text} align="right" />
          </div>
          {/* 04 bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <ReasonItem n="04" title={r[3].title} text={r[3].text} align="left" />
          </div>
          {/* 05 lower-right */}
          <div className="absolute right-0 top-[56%]">
            <ReasonItem n="05" title={r[4].title} text={r[4].text} align="left" />
          </div>
          {/* 06 upper-right */}
          <div className="absolute right-0 top-[28%]">
            <ReasonItem n="06" title={r[5].title} text={r[5].text} align="left" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function SalesEngine() {
  return (
    <section id="engine" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-[30px] sm:px-6 lg:py-[50px]">
      <Reveal>
        <h2 className="font-display text-[clamp(1.5rem,4.2vw,2.6rem)] font-semibold uppercase tracking-tight">
          Двигатель продаж бизнеса
        </h2>
      </Reveal>
      <div className="mt-8">
        <SalesGears />
      </div>
    </section>
  );
}

function StatDeco({ kind }: { kind: "rings" | "dots" | "people" }) {
  if (kind === "rings") {
    return (
      <svg viewBox="0 0 120 56" className="h-12 w-auto" aria-hidden>
        <circle cx="28" cy="28" r="24" fill="none" stroke="var(--color-ink)" strokeWidth="2" />
        <circle
          cx="86"
          cy="28"
          r="24"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2"
          strokeDasharray="113"
          strokeDashoffset="38"
          transform="rotate(-90 86 28)"
        />
      </svg>
    );
  }
  if (kind === "dots") {
    return (
      <div
        className="h-12 w-full max-w-[220px]"
        style={{
          backgroundImage: "radial-gradient(var(--color-ink) 1.1px, transparent 1.2px)",
          backgroundSize: "9px 9px",
        }}
      />
    );
  }
  return (
    <Image src={assets.crowd} alt="" width={220} height={40} className="h-9 w-auto opacity-90" />
  );
}

export function About() {
  return (
    <section id="exp" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-[30px] sm:px-6 lg:py-[50px]">
      <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:items-stretch">
        {/* Cut-corner panel: facts + photo */}
        <Reveal>
          <div className="relative bg-ink/30 p-px" style={CUT}>
            <div className="relative h-full bg-bg p-6 sm:p-8" style={CUT}>
              <div className="grid gap-6 md:grid-cols-[1fr_0.82fr] md:gap-8">
                {/* facts */}
                <div>
                  <span className="inline-block rounded-md bg-ink px-4 py-1.5 font-display text-sm tracking-wide text-bg">
                    КТО Я
                  </span>
                  <ul className="mt-6 space-y-5">
                    {aboutFacts.map((f, i) => (
                      <li key={i} className="border-l border-ink/25 pl-4 text-[15px] leading-relaxed">
                        {f.lead && <span className="font-semibold">{f.lead}</span>}
                        {f.rest}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* photo */}
                <div className="relative min-h-[260px] overflow-hidden bg-bg-soft" style={CUT}>
                  <Image
                    src={aboutPhoto}
                    alt="Василий Аистов"
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Stats column */}
        <Reveal delay={120}>
          <div className="flex h-full flex-col justify-between gap-8 lg:gap-6">
            {aboutStats.map((s) => (
              <div key={s.big}>
                <p className="font-display text-[2.6rem] font-normal leading-none tracking-tight">
                  {s.big}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{s.label}</p>
                <div className="mt-3">
                  <StatDeco kind={s.deco} />
                </div>
                {s.sub && <p className="mt-2 text-xs text-ink-soft">{s.sub}</p>}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Gantt() {
  const total = gantt.total;
  return (
    <section className="mx-auto max-w-7xl px-4 py-[30px] sm:px-6 lg:py-[50px]">
      <Reveal>
        <h2 className="font-display text-[clamp(1.5rem,3.6vw,2.4rem)] font-semibold uppercase tracking-tight">
          {gantt.title}
        </h2>
        <p className="mt-2 text-[15px] font-medium text-ink">{gantt.project}</p>
      </Reveal>

      {/* Gantt cascade */}
      <Reveal delay={80} className="mt-10 space-y-6">
        {gantt.phases.map((p) => (
          <div key={p.name}>
            <div className="mb-1.5 flex items-center justify-between text-[15px]">
              <span className="font-medium">{p.name}</span>
              <span className="text-ink-soft">{p.days} {p.days < 5 ? "дня" : "дней"}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-bg-soft">
              <div
                className="h-full rounded-full"
                style={{
                  marginLeft: `${(p.start / total) * 100}%`,
                  width: `${(p.days / total) * 100}%`,
                  background: p.color,
                }}
              />
            </div>
          </div>
        ))}
      </Reveal>

      {/* Card: requirements + budget | team */}
      <Reveal delay={120} className="mt-10">
        <div className="grid gap-10 rounded-[28px] border border-line bg-bg p-7 sm:p-9 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="font-semibold">Требования:</p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-ink-soft">
              {gantt.scope.map((s) => (
                <li key={s} className="flex gap-2.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  {s}
                </li>
              ))}
            </ul>
            <dl className="mt-8 space-y-2.5 text-[15px]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Общая длительность разработки:</dt>
                <dd className="font-medium">{gantt.duration}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Бюджет на разработку:</dt>
                <dd className="font-medium">{gantt.budget}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Бюджет со всеми скидками:</dt>
                <dd className="font-semibold text-accent">{gantt.budgetFinal}</dd>
              </div>
            </dl>
          </div>

          <div>
            <p className="font-semibold">Состав команды</p>
            <ul className="mt-4 space-y-4">
              {gantt.team.map((m) => (
                <li key={m.name + m.role} className="flex items-center gap-3.5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink font-display text-sm text-bg">
                    {m.initial}
                  </span>
                  <span>
                    <span className="block font-semibold">{m.name}</span>
                    <span className="block text-sm text-ink-soft">{m.role}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Bio() {
  return (
    <section className="relative overflow-hidden bg-dark py-[30px] text-bg lg:py-[50px]">
      {/* subtle marble sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(60% 80% at 80% 10%, rgba(139,103,255,0.16), transparent 60%), radial-gradient(50% 60% at 10% 90%, rgba(200,86,255,0.12), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="grid gap-10 sm:grid-cols-3">
            {bio.big.map((b) => (
              <div key={b.label}>
                <p className="font-display text-[clamp(2.6rem,6vw,4.2rem)] font-normal leading-none">
                  {b.value}
                </p>
                <p className="mt-3 text-[13px] uppercase leading-relaxed tracking-wide text-white/55">
                  {b.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={100} className="mt-14 grid max-w-3xl gap-5">
          {bio.paragraphs.map((p) => (
            <p key={p} className="text-[15px] leading-relaxed text-white/75">
              {p}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
