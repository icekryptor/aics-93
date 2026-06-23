import Reveal from "./Reveal";
import GraphCanvas from "./GraphCanvas";
import {
  frameworks,
  reasons,
  salesEngine,
  aboutFacts,
  aboutStats,
  bio,
  gantt,
} from "@/lib/content";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="tech-label inline-flex items-center gap-2 text-xs text-ink-soft">
      <span className="size-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

export function Intro() {
  const statements = [
    "Я мультидисциплинарный дизайнер с релевантным бизнес-опытом, навыками маркетинга и создания продуктов.",
    "Моя работа — придать привлекательные очертания вашему бизнесу для улучшения его ключевых показателей.",
    "С помощью умелого использования ИИ мои руки развязаны, и я соединил творчество с машинным анализом для получения самых точных результатов.",
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="max-w-5xl space-y-10">
        {statements.map((s, i) => (
          <Reveal key={i} delay={i * 80}>
            <p className="text-[clamp(1.4rem,3vw,2.3rem)] font-medium leading-[1.12] tracking-[-0.01em] text-ink">
              {s}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Frameworks() {
  return (
    <section id="how" className="scroll-mt-24 py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
        {/* Left: heading line + 2×2 framework grid */}
        <div>
          <Reveal>
            <p className="text-[15px] tracking-tight text-ink-soft">
              Какие фреймворки и методологии я использую:
            </p>
          </Reveal>
          <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {frameworks.map((f, i) => (
              <Reveal key={f.code} delay={(i % 2) * 80}>
                <article>
                  <span className="tech-label text-xs text-ink-soft">[ {f.n} ]</span>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-accent">{f.code}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {f.full} — {f.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right: framework graph */}
        <Reveal delay={120}>
          <GraphCanvas className="h-[340px] w-full sm:h-[440px] lg:h-[480px]" />
        </Reveal>
      </div>
    </section>
  );
}

export function Reasons() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal>
        <SectionLabel>зачем это бизнесу</SectionLabel>
        <h2 className="mt-3 font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-semibold tracking-tight">
          6 весомых причин<br className="hidden sm:block" /> заняться брендингом
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r, i) => (
          <Reveal key={r.title} delay={i * 60}>
            <article className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-bg p-6 transition-colors hover:border-accent/40">
              <span className="grid size-10 place-items-center rounded-full bg-gradient-accent text-bg">
                <span className="tech-label text-sm">0{i + 1}</span>
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold leading-snug">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{r.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function SalesEngine() {
  return (
    <section className="bg-dark py-16 text-bg lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="tech-label text-xs text-white/50">двигатель продаж бизнеса</p>
          <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-semibold tracking-tight">
            Всё работает на один результат — <span className="text-gradient">собственный сайт</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {salesEngine.nodes.map((n, i) => (
            <Reveal key={n} delay={i * 50}>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="tech-label text-sm text-accent">0{i + 1}</span>
                <span className="text-sm font-medium">{n}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6">
          <div className="rounded-2xl bg-gradient-accent p-6 text-center">
            <p className="font-display text-xl font-semibold text-bg">{salesEngine.center}</p>
            <p className="mt-1 text-sm text-bg/80">центр экосистемы, где вы управляете KPI</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="exp" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <Reveal>
          <SectionLabel>кто я</SectionLabel>
          <ul className="mt-6 space-y-5">
            {aboutFacts.map((f) => (
              <li key={f} className="flex gap-3 text-[15px] leading-relaxed">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <div className="grid gap-4 sm:grid-cols-3">
            {aboutStats.map((s) => (
              <div
                key={s.big}
                className="rounded-[var(--radius-card)] border border-line bg-bg-soft/50 p-5 text-center"
              >
                <p className="font-display text-2xl font-bold text-gradient">{s.big}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Gantt() {
  const maxDays = Math.max(...gantt.phases.map((p) => p.days));
  return (
    <section className="bg-bg-soft/50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionLabel>прозрачная смета</SectionLabel>
          <h2 className="mt-3 font-display text-[clamp(1.5rem,3.2vw,2.3rem)] font-semibold tracking-tight">
            {gantt.title}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-ink-soft">{gantt.project}</p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div className="rounded-[var(--radius-card)] border border-line bg-bg p-6">
              <div className="space-y-4">
                {gantt.phases.map((p, i) => (
                  <div key={p.name}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-ink-soft">{p.days} дн.</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-bg-soft">
                      <div
                        className="h-full rounded-full bg-gradient-accent"
                        style={{
                          width: `${(p.days / maxDays) * 100}%`,
                          marginLeft: `${(i * 12)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-ink-soft">
                {gantt.scope.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="text-accent">→</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex h-full flex-col gap-4">
              <div className="rounded-[var(--radius-card)] border border-line bg-bg p-6">
                <p className="text-xs uppercase tracking-wide text-ink-soft">Состав команды</p>
                <ul className="mt-3 space-y-3">
                  {gantt.team.map((m) => (
                    <li key={m.name} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-ink-soft">{m.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[var(--radius-card)] bg-dark p-6 text-bg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Длительность</span>
                  <span className="font-semibold">{gantt.duration}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-white/60 text-sm">Бюджет</span>
                  <span className="text-white/40 line-through">{gantt.budget}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm">Со скидками</span>
                  <span className="font-display text-2xl font-bold text-gradient">{gantt.budgetFinal}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Bio() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal>
        <div className="grid gap-6 sm:grid-cols-3">
          {bio.big.map((b) => (
            <div key={b.label}>
              <p className="font-display text-[clamp(2.4rem,6vw,4rem)] font-bold leading-none text-gradient">
                {b.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{b.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal delay={100} className="mt-12 grid max-w-3xl gap-5">
        {bio.paragraphs.map((p) => (
          <p key={p} className="text-[15px] leading-relaxed text-ink-soft">
            {p}
          </p>
        ))}
      </Reveal>
    </section>
  );
}
