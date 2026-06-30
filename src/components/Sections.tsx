import Reveal from "./Reveal";
import ScrollHighlight from "./ScrollHighlight";
import GraphCanvas from "./GraphCanvas";
import FrameworkCarousel from "./FrameworkCarousel";
import SalesGears from "./SalesGears";
import AboutMe from "./AboutMe";
import ReasonsLedger from "./ReasonsLedger";
import { frameworks, bio, gantt } from "@/lib/content";

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

export function Reasons() {
  return <ReasonsLedger />;
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

export function About() {
  return <AboutMe />;
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
