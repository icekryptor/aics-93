"use client";

import { useState } from "react";
import { reachGoal } from "@/lib/metrika";
import { sendLead } from "@/lib/lead";
import {
  QUIZ_TASKS,
  QUIZ_DEADLINES,
  QUIZ_CONTACTS,
  QUIZ_STEPS,
  QUIZ_HEADINGS,
  BUDGET_MIN,
  BUDGET_MAX,
  BUDGET_STEP,
  fmtRub,
} from "@/lib/quiz";

/* QuizInline — интерактивный квиз-бриф отдельным блоком в конце лендинга
   (вместо контактной формы). Тёмная сцена, стеклянная карточка по канону
   дизайн-системы; тот же 5-шаговый мастер, что и в дровере (общий конфиг
   в lib/quiz). Успех — только после подтверждённой доставки в Telegram. */

function RowDark({
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
      className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-2.5 text-left text-[14px] transition-colors ${
        active
          ? "border-[color-mix(in_srgb,var(--color-signal)_70%,transparent)] bg-[rgba(151,71,255,0.12)] text-runtime-ink"
          : "border-runtime-line text-runtime-ink-soft hover:border-[color-mix(in_srgb,var(--color-signal)_45%,transparent)] hover:text-runtime-ink"
      }`}
    >
      <span
        className={`grid size-4 shrink-0 place-items-center rounded-full border ${
          active ? "border-[var(--color-signal)]" : "border-runtime-line"
        }`}
        aria-hidden
      >
        {active && <span className="size-2 rounded-full bg-[var(--color-signal)]" />}
      </span>
      {children}
    </button>
  );
}

export default function QuizInline({
  source,
  title = "Соберём вашу задачу за 2 минуты",
  text = "Пять коротких вопросов вместо длинной формы — на выходе бриф, по которому я вернусь с расчётом и планом.",
}: {
  source: string;
  title?: string;
  text?: string;
}) {
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

  const toggleContact = (id: string) =>
    setContacts((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const submit = async () => {
    if (sending) return;
    setSending(true);
    setSendErr(false);
    const taskV = task === "другое" ? `другое: ${taskOther}` : task;
    const ok = await sendLead(source, {
      задача: taskV,
      замысел: idea,
      срок: deadline === "другое" ? `другое: ${deadlineOther}` : deadline,
      бюджет: `${fmtRub(bmin)} – ${fmtRub(bmax)} ₽`,
      "способ связи": contacts,
      контакты: contactInfo,
    });
    setSending(false);
    if (ok) {
      reachGoal("lead", { source, task: taskV });
      setDone(true);
    } else {
      setSendErr(true);
    }
  };

  const next = () => (step < QUIZ_STEPS.length - 1 ? setStep((s) => s + 1) : void submit());
  const back = () => setStep((s) => Math.max(0, s - 1));

  const inputCls =
    "w-full rounded-xl border border-runtime-line bg-[color-mix(in_srgb,var(--color-runtime)_70%,transparent)] px-4 py-3 text-[14px] text-runtime-ink outline-none transition-colors placeholder:text-runtime-ink-soft/60 focus:border-[color-mix(in_srgb,var(--color-signal)_70%,transparent)]";
  const pct = (v: number) => ((v - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

  return (
    <section id="upgrade" className="runtime relative scroll-mt-24 overflow-hidden py-[50px] lg:py-[80px]">
      <div className="runtime-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="signal-seam absolute inset-x-0 top-0" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* лево: заголовок + смысл */}
          <div className="lg:sticky lg:top-24">
            <p className="tech-label text-[11px] text-[color-mix(in_srgb,var(--color-signal)_80%,white)]">
              [ квиз · 2 минуты вместо формы ]
            </p>
            <h2 className="mt-4 text-[clamp(1.7rem,3.4vw,2.7rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-runtime-ink">
              {title}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-runtime-ink-soft">{text}</p>
            <p className="hud mt-6 text-[9px] text-runtime-ink-soft/60">
              // данные уходят напрямую оператору · без спама
            </p>
          </div>

          {/* право: стеклянная карточка мастера */}
          <div className="rounded-[25px_55px_55px_5px] bg-white/[0.06] p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.14)_inset] sm:p-8">
            {done ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-center">
                <span className="signal-grad grid size-12 place-items-center rounded-full text-white">✓</span>
                <p className="text-lg font-bold text-runtime-ink">Бриф отправлен</p>
                <p className="max-w-sm text-[13.5px] text-runtime-ink-soft">
                  Разберу задачу и вернусь с расчётом в течение 2 часов.
                </p>
              </div>
            ) : (
              <>
                {/* progress */}
                <div className="flex items-center justify-between gap-4">
                  <p className="tech-label text-[11px] text-runtime-ink-soft">
                    шаг {step + 1}/{QUIZ_STEPS.length} · {QUIZ_STEPS[step]}
                  </p>
                  <div className="flex flex-1 justify-end gap-1.5">
                    {QUIZ_STEPS.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1 w-8 rounded-full transition-colors ${
                          i <= step ? "bg-[var(--color-signal)]" : "bg-runtime-line"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="mb-5 mt-5 text-[1.15rem] font-bold leading-snug tracking-tight text-runtime-ink">
                  {QUIZ_HEADINGS[step]}
                </p>

                {step === 0 && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {QUIZ_TASKS.map((t) => (
                      <RowDark key={t} active={task === t} onClick={() => setTask(t)}>
                        {t}
                      </RowDark>
                    ))}
                    {task === "другое" && (
                      <input
                        value={taskOther}
                        onChange={(e) => setTaskOther(e.target.value)}
                        placeholder="Опишите задачу"
                        aria-label="Опишите задачу"
                        className={`${inputCls} sm:col-span-2`}
                      />
                    )}
                  </div>
                )}

                {step === 1 && (
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    rows={6}
                    placeholder="Пара предложений: какой процесс хотите оцифровать, что болит"
                    aria-label="Замысел проекта"
                    className={inputCls}
                  />
                )}

                {step === 2 && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {QUIZ_DEADLINES.map((d) => (
                      <RowDark key={d} active={deadline === d} onClick={() => setDeadline(d)}>
                        {d}
                      </RowDark>
                    ))}
                    {deadline === "другое" && (
                      <input
                        value={deadlineOther}
                        onChange={(e) => setDeadlineOther(e.target.value)}
                        placeholder="Укажите срок"
                        aria-label="Укажите срок"
                        className={`${inputCls} sm:col-span-2`}
                      />
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <div className="flex items-center justify-between text-[13px] font-medium text-runtime-ink">
                      <span>от {fmtRub(bmin)} ₽</span>
                      <span>
                        до {fmtRub(bmax)}
                        {bmax === BUDGET_MAX ? "+" : ""} ₽
                      </span>
                    </div>
                    <div className="relative mt-4 h-5">
                      <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-runtime-line" />
                      <div
                        className="signal-grad absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                        style={{ left: `${pct(bmin)}%`, right: `${100 - pct(bmax)}%` }}
                      />
                      <input
                        type="range"
                        min={BUDGET_MIN}
                        max={BUDGET_MAX}
                        step={BUDGET_STEP}
                        value={bmin}
                        aria-label="Бюджет от"
                        onChange={(e) => setBmin(Math.min(Number(e.target.value), bmax - BUDGET_STEP))}
                        className="dual-range"
                        style={{ zIndex: bmin > BUDGET_MAX - BUDGET_STEP * 2 ? 5 : 3 }}
                      />
                      <input
                        type="range"
                        min={BUDGET_MIN}
                        max={BUDGET_MAX}
                        step={BUDGET_STEP}
                        value={bmax}
                        aria-label="Бюджет до"
                        onChange={(e) => setBmax(Math.max(Number(e.target.value), bmin + BUDGET_STEP))}
                        className="dual-range"
                        style={{ zIndex: 4 }}
                      />
                    </div>
                    <p className="mt-2 text-[11.5px] text-runtime-ink-soft">
                      шаг 5 000 ₽ · двигайте оба ползунка
                    </p>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {QUIZ_CONTACTS.map((c) =>
                        c.disabled ? (
                          <span key={c.id} className="group relative">
                            <button
                              type="button"
                              disabled
                              aria-disabled
                              className="cursor-not-allowed rounded-full border border-runtime-line px-3.5 py-2 text-[12.5px] text-runtime-ink-soft/40 line-through"
                            >
                              {c.label}
                            </button>
                            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-44 -translate-x-1/2 rounded-lg bg-[var(--color-runtime-2)] px-2.5 py-1.5 text-center text-[10px] leading-snug text-runtime-ink group-hover:block">
                              {c.tip}
                            </span>
                          </span>
                        ) : (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => toggleContact(c.id)}
                            aria-pressed={contacts.includes(c.id)}
                            className={`cursor-pointer rounded-full border px-3.5 py-2 text-[12.5px] transition-colors ${
                              contacts.includes(c.id)
                                ? "signal-grad border-transparent text-white"
                                : "border-runtime-line text-runtime-ink-soft hover:border-[color-mix(in_srgb,var(--color-signal)_55%,transparent)] hover:text-runtime-ink"
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

                {sendErr && (
                  <p className="mt-4 text-[12px] text-[#ff8f73]">
                    не удалось отправить — попробуйте ещё раз или напишите в telegram
                  </p>
                )}

                <div className="mt-6 flex items-center gap-3">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={back}
                      className="btn-case-glass tech-label px-5 py-3 text-[11px] text-runtime-ink"
                    >
                      назад
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={next}
                    disabled={sending}
                    className="btn-case flex-1 py-3 text-[14px] font-semibold disabled:opacity-60"
                  >
                    {step < QUIZ_STEPS.length - 1 ? "далее →" : sending ? "отправляю…" : "отправить бриф →"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
