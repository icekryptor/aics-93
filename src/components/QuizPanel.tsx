"use client";

import { useEffect, useState } from "react";
import { reachGoal } from "@/lib/metrika";
import { sendLead } from "@/lib/lead";
import { legal } from "@/lib/content";

/**
 * QuizPanel — right-side brief drawer (320px) that pushes the page content left
 * (`html.quiz-open .quiz-shift`). Opens from a sticky centre-right tab. A
 * 5-step wizard (no scrolling slides). The panel is split: top 2/3 the brief,
 * bottom 1/3 a Telegram-subscribe banner. Submit is a stub (logs + Metrika
 * `lead` goal). Native cursor is restored over the panel (see globals.css).
 */

import {
  QUIZ_TASKS as TASKS,
  QUIZ_DEADLINES as DEADLINES,
  QUIZ_CONTACTS as CONTACTS,
  QUIZ_STEPS as STEPS,
  QUIZ_HEADINGS,
  BUDGET_MIN as BMIN,
  BUDGET_MAX as BMAX,
  BUDGET_STEP as BSTEP,
  fmtRub as fmt,
} from "@/lib/quiz";

function Row({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
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

export default function QuizPanel() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState(false);

  const [task, setTask] = useState("");
  const [taskOther, setTaskOther] = useState("");
  const [idea, setIdea] = useState("");
  const [deadline, setDeadline] = useState("");
  const [deadlineOther, setDeadlineOther] = useState("");
  const [bmin, setBmin] = useState(150_000);
  const [bmax, setBmax] = useState(600_000);
  const [contacts, setContacts] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState("");

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

  const submit = async () => {
    if (sending) return;
    setSending(true);
    setSendErr(false);
    const taskV = task === "другое" ? `другое: ${taskOther}` : task;
    const ok = await sendLead("квиз-бриф", {
      задача: taskV,
      замысел: idea,
      срок: deadline === "другое" ? `другое: ${deadlineOther}` : deadline,
      бюджет: `${fmt(bmin)} – ${fmt(bmax)} ₽`,
      "способ связи": contacts,
      контакты: contactInfo,
    });
    setSending(false);
    if (ok) {
      reachGoal("lead", { source: "quiz", task: taskV });
      setDone(true);
    } else {
      setSendErr(true);
    }
  };

  const next = () => (step < STEPS.length - 1 ? setStep((s) => s + 1) : void submit());
  const back = () => setStep((s) => Math.max(0, s - 1));

  const inputCls =
    "w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-accent/70";
  const pct = (v: number) => ((v - BMIN) / (BMAX - BMIN)) * 100;

  const heading = (
    <p className="mb-4 text-[1.05rem] font-bold leading-snug tracking-tight text-ink">
      {QUIZ_HEADINGS[step]}
    </p>
  );

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
        className="quiz-panel fixed inset-y-0 right-0 z-[70] flex w-[320px] max-w-[86vw] flex-col border-l border-line bg-bg shadow-[-16px_0_48px_-24px_rgba(48,32,85,0.5)] transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* ---------- BRIEF (top 2/3) ---------- */}
        <div className="flex min-h-0 flex-[2] flex-col">
          {/* header */}
          <div className="flex items-center justify-between px-5 pb-3 pt-4">
            <p className="tech-label text-[11px] text-ink-soft">
              бриф · шаг {done ? STEPS.length : step + 1}/{STEPS.length}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
              className="grid size-8 shrink-0 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:text-ink"
            >
              ✕
            </button>
          </div>

          {/* progress dots */}
          {!done && (
            <div className="flex gap-1.5 px-5 pb-1">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-accent" : "bg-line"}`}
                />
              ))}
            </div>
          )}

          {done ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="signal-grad grid size-12 place-items-center rounded-full text-white">✓</span>
              <p className="font-bold text-lg text-ink">Бриф отправлен</p>
              <p className="text-[12.5px] text-ink-soft">Разберу задачу и вернусь с расчётом в течение 2 часов.</p>
            </div>
          ) : (
            <>
              {/* step content */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {heading}

                {step === 0 && (
                  <div className="grid gap-2">
                    {TASKS.map((t) => (
                      <Row key={t} active={task === t} onClick={() => setTask(t)}>
                        {t}
                      </Row>
                    ))}
                    {task === "другое" && (
                      <input
                        value={taskOther}
                        onChange={(e) => setTaskOther(e.target.value)}
                        placeholder="Опишите задачу"
                        aria-label="Опишите задачу"
                        className={`${inputCls} mt-1`}
                      />
                    )}
                  </div>
                )}

                {step === 1 && (
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    rows={6}
                    placeholder="Пара предложений о проекте"
                    aria-label="Замысел проекта"
                    className={inputCls}
                  />
                )}

                {step === 2 && (
                  <div className="grid gap-2">
                    {DEADLINES.map((d) => (
                      <Row key={d} active={deadline === d} onClick={() => setDeadline(d)}>
                        {d}
                      </Row>
                    ))}
                    {deadline === "другое" && (
                      <input
                        value={deadlineOther}
                        onChange={(e) => setDeadlineOther(e.target.value)}
                        placeholder="Укажите срок"
                        aria-label="Укажите срок"
                        className={`${inputCls} mt-1`}
                      />
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div>
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
                    <p className="mt-2 text-[11px] text-ink-soft">шаг 5 000 ₽ · двигайте оба ползунка</p>
                  </div>
                )}

                {step === 4 && (
                  <div>
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
                      rows={3}
                      placeholder="Ваши контакты: телефон, @ник, почта…"
                      aria-label="Контактные данные"
                      className={`${inputCls} mt-3`}
                    />
                  </div>
                )}
              </div>

              {/* nav */}
              {sendErr && (
                <p className="px-5 pb-1 text-[11px] leading-snug text-[#e35b3d]">
                  не удалось отправить — попробуйте ещё раз или напишите в telegram
                </p>
              )}
              <div className="flex items-center gap-2 border-t border-line px-5 py-3">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={back}
                    className="btn-case-glass-dark tech-label px-4 py-2.5 text-[11px] text-ink-soft hover:text-ink"
                  >
                    назад
                  </button>
                )}
                <button
                  type="button"
                  onClick={next}
                  disabled={sending}
                  className="btn-case flex-1 py-2.5 text-[13px] font-semibold disabled:opacity-60"
                >
                  {step < STEPS.length - 1 ? "далее →" : sending ? "отправляю…" : "отправить бриф →"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* ---------- TELEGRAM BANNER (bottom 1/3) ---------- */}
        <div className="flex min-h-0 flex-[1] flex-col justify-center gap-2 border-t border-line bg-ink px-5 py-4 text-white">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="size-5 fill-white" aria-hidden>
              <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.05-1.99 1.93c-.23.23-.42.42-.83.42z" />
            </svg>
            <span className="tech-label text-[10px] text-white/60">телеграм-канал</span>
          </div>
          <p className="text-[0.98rem] font-bold leading-snug">
            Разбираю бренд, ИИ и дизайн — <span className="signal-text">коротко и по делу</span>
          </p>
          <p className="text-[11.5px] leading-snug text-white/55">Кейсы, приёмы и мысли из практики. Без спама.</p>
          <a
            href={legal.telegramChannel}
            target="_blank"
            rel="noreferrer"
            onClick={() => reachGoal("tg_subscribe", { source: "quiz" })}
            className="btn-case mt-1 inline-flex w-fit items-center px-5 py-2 text-[12px] font-semibold"
          >
            Подписаться →
          </a>
        </div>
      </aside>
    </>
  );
}
