"use client";

import { useState } from "react";
import { reachGoal } from "@/lib/metrika";
import { sendLead } from "@/lib/lead";
import {
  QUIZ_CONTACTS,
  DEFAULT_QUIZ_STEPS,
  type QuizStep,
  BUDGET_MIN,
  BUDGET_MAX,
  BUDGET_STEP,
  fmtRub,
} from "@/lib/quiz";

/* QuizInline — интерактивный квиз-бриф отдельным блоком в конце лендинга
   (вместо контактной формы). Data-driven: лендинг может передать свой набор
   шагов (`steps`); дефолт повторяет дровер (задача/замысел/срок/бюджет/связь).
   Тёмная сцена, стеклянная карточка по канону ДС. Успех — только после
   подтверждённой доставки в Telegram. */

function RowDark({
  active,
  onClick,
  children,
  radio = true,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  radio?: boolean;
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
        className={`grid size-4 shrink-0 place-items-center border ${
          radio ? "rounded-full" : "rounded-[4px]"
        } ${active ? "border-[var(--color-signal)]" : "border-runtime-line"}`}
        aria-hidden
      >
        {active && (
          <span className={`size-2 bg-[var(--color-signal)] ${radio ? "rounded-full" : "rounded-[2px]"}`} />
        )}
      </span>
      {children}
    </button>
  );
}

type Answers = Record<string, string | string[] | [number, number]>;
type OtherText = Record<string, string>;

export default function QuizInline({
  source,
  title = "Соберём вашу задачу за 2 минуты",
  text = "Пять коротких вопросов вместо длинной формы — на выходе бриф, по которому я вернусь с расчётом и планом.",
  steps = DEFAULT_QUIZ_STEPS,
}: {
  source: string;
  title?: string;
  text?: string;
  steps?: QuizStep[];
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState(false);

  const [answers, setAnswers] = useState<Answers>({});
  const [other, setOther] = useState<OtherText>({});
  const [contacts, setContacts] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState("");

  const cur = steps[step];

  const setAnswer = (key: string, v: Answers[string]) => setAnswers((a) => ({ ...a, [key]: v }));
  const toggleMulti = (key: string, v: string) => {
    const arr = (answers[key] as string[] | undefined) ?? [];
    setAnswer(key, arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };
  const toggleContact = (id: string) =>
    setContacts((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const budgetOf = (key: string): [number, number] =>
    (answers[key] as [number, number] | undefined) ?? [150_000, 600_000];

  const submit = async () => {
    if (sending) return;
    setSending(true);
    setSendErr(false);
    const data: Record<string, unknown> = {};
    for (const s of steps) {
      if (s.kind === "contacts") {
        data["способ связи"] = contacts;
        data["контакты"] = contactInfo;
      } else if (s.kind === "budget") {
        const [lo, hi] = budgetOf(s.key);
        data[s.key] = `${fmtRub(lo)} – ${fmtRub(hi)} ₽`;
      } else if (s.kind === "multi") {
        const arr = [...((answers[s.key] as string[] | undefined) ?? [])];
        if (arr.includes("другое") && other[s.key]) {
          arr[arr.indexOf("другое")] = `другое: ${other[s.key]}`;
        }
        data[s.key] = arr;
      } else if (s.kind === "single") {
        const v = (answers[s.key] as string | undefined) ?? "";
        data[s.key] = v === "другое" && other[s.key] ? `другое: ${other[s.key]}` : v;
      } else {
        data[s.key] = (answers[s.key] as string | undefined) ?? "";
      }
    }
    const ok = await sendLead(source, data);
    setSending(false);
    if (ok) {
      reachGoal("lead", { source });
      setDone(true);
    } else {
      setSendErr(true);
    }
  };

  const next = () => (step < steps.length - 1 ? setStep((s) => s + 1) : void submit());
  const back = () => setStep((s) => Math.max(0, s - 1));

  const inputCls =
    "w-full rounded-xl border border-runtime-line bg-[color-mix(in_srgb,var(--color-runtime)_70%,transparent)] px-4 py-3 text-[14px] text-runtime-ink outline-none transition-colors placeholder:text-runtime-ink-soft/60 focus:border-[color-mix(in_srgb,var(--color-signal)_70%,transparent)]";
  const pct = (v: number) => ((v - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

  const renderOtherInput = (key: string, active: boolean) =>
    active ? (
      <input
        value={other[key] ?? ""}
        onChange={(e) => setOther((o) => ({ ...o, [key]: e.target.value }))}
        placeholder="Введите свой вариант"
        aria-label="Свой вариант"
        className={`${inputCls} sm:col-span-2`}
      />
    ) : null;

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
                    шаг {step + 1}/{steps.length} · {cur.key}
                  </p>
                  <div className="flex flex-1 justify-end gap-1.5">
                    {steps.map((_, i) => (
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
                  {cur.title}
                </p>

                {cur.kind === "input" &&
                  (cur.multiline !== false ? (
                    <textarea
                      value={(answers[cur.key] as string | undefined) ?? ""}
                      onChange={(e) => setAnswer(cur.key, e.target.value)}
                      rows={5}
                      placeholder={cur.placeholder}
                      aria-label={cur.title}
                      className={inputCls}
                    />
                  ) : (
                    <input
                      value={(answers[cur.key] as string | undefined) ?? ""}
                      onChange={(e) => setAnswer(cur.key, e.target.value)}
                      placeholder={cur.placeholder}
                      aria-label={cur.title}
                      className={inputCls}
                    />
                  ))}

                {cur.kind === "single" && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[...cur.options, ...(cur.other ? ["другое"] : [])].map((t) => (
                      <RowDark
                        key={t}
                        active={(answers[cur.key] as string | undefined) === t}
                        onClick={() => setAnswer(cur.key, t)}
                      >
                        {t}
                      </RowDark>
                    ))}
                    {renderOtherInput(cur.key, (answers[cur.key] as string | undefined) === "другое")}
                  </div>
                )}

                {cur.kind === "multi" && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[...cur.options, ...(cur.other ? ["другое"] : [])].map((t) => {
                      const arr = (answers[cur.key] as string[] | undefined) ?? [];
                      return (
                        <RowDark key={t} active={arr.includes(t)} onClick={() => toggleMulti(cur.key, t)} radio={false}>
                          {t}
                        </RowDark>
                      );
                    })}
                    {renderOtherInput(
                      cur.key,
                      ((answers[cur.key] as string[] | undefined) ?? []).includes("другое"),
                    )}
                    <p className="text-[11.5px] text-runtime-ink-soft sm:col-span-2">
                      можно выбрать несколько вариантов
                    </p>
                  </div>
                )}

                {cur.kind === "budget" &&
                  (() => {
                    const [bmin, bmax] = budgetOf(cur.key);
                    return (
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
                            onChange={(e) =>
                              setAnswer(cur.key, [
                                Math.min(Number(e.target.value), bmax - BUDGET_STEP),
                                bmax,
                              ])
                            }
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
                            onChange={(e) =>
                              setAnswer(cur.key, [
                                bmin,
                                Math.max(Number(e.target.value), bmin + BUDGET_STEP),
                              ])
                            }
                            className="dual-range"
                            style={{ zIndex: 4 }}
                          />
                        </div>
                        <p className="mt-2 text-[11.5px] text-runtime-ink-soft">
                          шаг 5 000 ₽ · двигайте оба ползунка
                        </p>
                      </div>
                    );
                  })()}

                {cur.kind === "contacts" && (
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
                    {step < steps.length - 1 ? "далее →" : sending ? "отправляю…" : "отправить бриф →"}
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
