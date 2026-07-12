"use client";

import { useEffect, useState } from "react";
import { reachGoal } from "@/lib/metrika";

/**
 * QuizPanel — right-side brief drawer (320px) that pushes the page content
 * left (via `html.quiz-open .quiz-shift`). Opens from a sticky centre-right
 * tab. A single scrollable form (no glitchy slide-by-slide). Submit is a stub
 * (logs + fires the Metrika `lead` goal), like the other forms.
 */

const TASKS = ["ребрендинг", "разработка сайта", "разработка сервиса", "маркетинговая консультация", "другое"];
const DEADLINES = ["как можно скорее", "7-14 дней", "14-28 дней", "1-3 месяца", "другое"];
const CONTACTS: { id: string; label: string; disabled?: boolean; tip?: string }[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telegram", label: "Telegram" },
  { id: "email", label: "Почта" },
  { id: "fb", label: "Facebook" },
  { id: "max", label: "МАКС", disabled: true, tip: "этой фигнёй мы никогда не будем пользоваться" },
];

const BMIN = 0;
const BMAX = 1_000_000;
const BSTEP = 5000;
const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

function Row({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl border px-4 py-2.5 text-left text-[13px] transition-colors ${
        active ? "border-accent bg-accent/[0.07] text-ink" : "border-line text-ink-soft hover:border-accent/50"
      }`}
    >
      <span
        className={`grid size-4 shrink-0 place-items-center rounded-full border ${active ? "border-accent" : "border-line"}`}
        aria-hidden
      >
        {active && <span className="size-2 rounded-full bg-accent" />}
      </span>
      {children}
    </button>
  );
}

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="mb-3 flex gap-2 text-[13px] font-medium text-ink">
      <span className="tech-label text-[11px] text-accent-ink">{n}</span>
      {children}
    </p>
  );
}

export default function QuizPanel() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  const [task, setTask] = useState("");
  const [taskOther, setTaskOther] = useState("");
  const [idea, setIdea] = useState("");
  const [deadline, setDeadline] = useState("");
  const [deadlineOther, setDeadlineOther] = useState("");
  const [bmin, setBmin] = useState(150_000);
  const [bmax, setBmax] = useState(600_000);
  const [contacts, setContacts] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState("");

  // deep-link / CTA: /?quiz=1 opens the brief
  useEffect(() => {
    try {
      if (new URLSearchParams(window.location.search).get("quiz") === "1") setOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("quiz-open", open);
    return () => document.documentElement.classList.remove("quiz-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  const toggleContact = (id: string) =>
    setContacts((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      task: task === "другое" ? `другое: ${taskOther}` : task,
      idea,
      deadline: deadline === "другое" ? `другое: ${deadlineOther}` : deadline,
      budget: [bmin, bmax],
      contacts,
      contactInfo,
    };
    // STUB: backend not wired yet — replace with POST /api/lead → Telegram.
    console.log("[quiz]", payload);
    reachGoal("lead", { source: "quiz", task: payload.task });
    setDone(true);
  };

  const inputCls =
    "w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-accent/70";

  const pct = (v: number) => ((v - BMIN) / (BMAX - BMIN)) * 100;

  return (
    <>
      {/* sticky centre-right tab */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="quiz-panel"
        className="quiz-tab signal-grad fixed top-1/2 z-[71] flex -translate-y-1/2 flex-col items-center gap-2 rounded-l-2xl py-4 pl-3 pr-2.5 text-white shadow-[0_8px_28px_-10px_rgba(103,3,255,0.7)] transition-[right,opacity] duration-[420ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
        style={{ right: "var(--quiz-tab-right, 0px)" }}
      >
        <svg viewBox="0 0 24 24" className={`size-4 transition-transform ${open ? "" : "rotate-180"}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[11px] font-semibold tracking-[0.18em]" style={{ writingMode: "vertical-rl" }}>
          {open ? "закрыть" : "бриф · 2 мин"}
        </span>
      </button>

      {/* drawer */}
      <aside
        id="quiz-panel"
        aria-label="Бриф на проект"
        aria-hidden={!open}
        className="fixed inset-y-0 right-0 z-[70] flex w-[320px] max-w-[86vw] flex-col border-l border-line bg-bg shadow-[-16px_0_48px_-24px_rgba(48,32,85,0.5)] transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* header */}
        <div className="flex items-start justify-between border-b border-line px-5 py-4">
          <div>
            <p className="tech-label text-[11px] text-ink-soft">[ бриф · 5 вопросов ]</p>
            <h3 className="mt-1 font-display text-[1.15rem] font-normal leading-tight tracking-tight text-ink">
              Рассчитаю ваш проект
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Закрыть"
            className="grid size-8 shrink-0 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:text-ink"
          >
            ✕
          </button>
        </div>

        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="signal-grad grid size-12 place-items-center rounded-full text-white">✓</span>
            <p className="font-display text-xl text-ink">Бриф отправлен</p>
            <p className="text-[13px] text-ink-soft">Разберу задачу и вернусь с расчётом в течение 2 часов.</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="tech-label mt-2 rounded-full border border-line px-5 py-2 text-[11px] text-ink-soft transition-colors hover:text-ink"
            >
              закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex-1 overflow-y-auto px-5 py-5">
            {/* Q1 */}
            <fieldset className="mb-7">
              <Label n="01">Какая у вас задача?</Label>
              <div className="grid gap-2">
                {TASKS.map((t) => (
                  <Row key={t} active={task === t} onClick={() => setTask(t)}>
                    {t}
                  </Row>
                ))}
              </div>
              {task === "другое" && (
                <input
                  value={taskOther}
                  onChange={(e) => setTaskOther(e.target.value)}
                  placeholder="Опишите задачу"
                  aria-label="Опишите задачу"
                  className={`${inputCls} mt-2`}
                />
              )}
            </fieldset>

            {/* Q2 */}
            <fieldset className="mb-7">
              <Label n="02">Коротко — какой замысел хотите реализовать?</Label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={4}
                placeholder="Пара предложений о проекте"
                aria-label="Замысел проекта"
                className={inputCls}
              />
            </fieldset>

            {/* Q3 */}
            <fieldset className="mb-7">
              <Label n="03">Какой у вас срок на реализацию?</Label>
              <div className="grid gap-2">
                {DEADLINES.map((d) => (
                  <Row key={d} active={deadline === d} onClick={() => setDeadline(d)}>
                    {d}
                  </Row>
                ))}
              </div>
              {deadline === "другое" && (
                <input
                  value={deadlineOther}
                  onChange={(e) => setDeadlineOther(e.target.value)}
                  placeholder="Укажите срок"
                  aria-label="Укажите срок"
                  className={`${inputCls} mt-2`}
                />
              )}
            </fieldset>

            {/* Q4 — dual budget slider */}
            <fieldset className="mb-7">
              <Label n="04">Диапазон бюджета</Label>
              <div className="flex items-center justify-between text-[12px] font-medium text-ink">
                <span>от {fmt(bmin)} ₽</span>
                <span>до {fmt(bmax)}{bmax === BMAX ? "+" : ""} ₽</span>
              </div>
              <div className="relative mt-3 h-5">
                <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-line" />
                <div
                  className="signal-grad absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                  style={{ left: `${pct(bmin)}%`, right: `${100 - pct(bmax)}%` }}
                />
                <input
                  type="range"
                  min={BMIN}
                  max={BMAX}
                  step={BSTEP}
                  value={bmin}
                  aria-label="Бюджет от"
                  onChange={(e) => setBmin(Math.min(Number(e.target.value), bmax - BSTEP))}
                  className="dual-range"
                  style={{ zIndex: bmin > BMAX - BSTEP * 2 ? 5 : 3 }}
                />
                <input
                  type="range"
                  min={BMIN}
                  max={BMAX}
                  step={BSTEP}
                  value={bmax}
                  aria-label="Бюджет до"
                  onChange={(e) => setBmax(Math.max(Number(e.target.value), bmin + BSTEP))}
                  className="dual-range"
                  style={{ zIndex: 4 }}
                />
              </div>
              <p className="mt-2 text-[11px] text-ink-soft">шаг 5 000 ₽</p>
            </fieldset>

            {/* Q5 — contact */}
            <fieldset className="mb-6">
              <Label n="05">Удобный способ связи</Label>
              <div className="flex flex-wrap gap-2">
                {CONTACTS.map((c) =>
                  c.disabled ? (
                    <span key={c.id} className="group relative">
                      <button
                        type="button"
                        disabled
                        aria-disabled
                        className="cursor-not-allowed rounded-full border border-line px-3.5 py-2 text-[12px] text-ink-soft/45 line-through"
                      >
                        {c.label}
                      </button>
                      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-40 -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-center text-[10px] leading-snug text-white group-hover:block">
                        {c.tip}
                      </span>
                    </span>
                  ) : (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleContact(c.id)}
                      aria-pressed={contacts.includes(c.id)}
                      className={`rounded-full border px-3.5 py-2 text-[12px] transition-colors ${
                        contacts.includes(c.id)
                          ? "signal-grad border-transparent text-white"
                          : "border-line text-ink-soft hover:border-accent/50 hover:text-ink"
                      }`}
                    >
                      {c.label}
                    </button>
                  ),
                )}
              </div>
              <textarea
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                rows={2}
                placeholder="Ваши контакты: телефон, @ник, почта…"
                aria-label="Контактные данные"
                className={`${inputCls} mt-3`}
              />
            </fieldset>

            <button
              type="submit"
              className="signal-grad w-full rounded-xl py-3.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.01]"
            >
              Отправить бриф →
            </button>
            <p className="mt-3 text-center text-[10px] text-ink-soft/70">Отвечу в течение 2 часов · без спама</p>
          </form>
        )}
      </aside>
    </>
  );
}
