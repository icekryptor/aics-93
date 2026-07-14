"use client";

import { useState } from "react";
import CubeMorph from "./system/CubeMorph";
import { projectTypes } from "@/lib/content";
import { reachGoal } from "@/lib/metrika";
import { sendLead } from "@/lib/lead";

const CUT: React.CSSProperties = {
  clipPath:
    "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)",
};

// ACT V — the invitation. A dark "console" contact form + the Rubik cube that
// morphs into a data network on click (the machine, playful).
export default function ContactConsole() {
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", about: "" });

  const toggle = (t: string) =>
    setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setSendErr(false);
    const ok = await sendLead("контакт-консоль (главная)", {
      "тип проекта": selected,
      "о проекте": form.about,
      имя: form.name,
      "телефон/мессенджер": form.phone,
    });
    setSending(false);
    if (ok) {
      reachGoal("lead", { source: "contact_console", modules: selected.length });
      setDone(true);
    } else {
      setSendErr(true);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-runtime-line bg-[color-mix(in_srgb,var(--color-runtime)_70%,transparent)] px-5 py-4 text-sm text-runtime-ink outline-none transition-colors placeholder:text-runtime-ink-soft/60 focus:border-[color-mix(in_srgb,var(--color-signal)_70%,transparent)]";

  return (
    <section
      id="upgrade"
      className="runtime relative scroll-mt-24 overflow-hidden py-[50px] lg:py-[80px]"
    >
      <div className="runtime-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="signal-seam absolute inset-x-0 top-0" aria-hidden />

      <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6">
        {/* header */}
        <div className="max-w-2xl">
          <p className="tech-label text-[11px] text-[color-mix(in_srgb,var(--color-signal)_80%,white)]">
            [ контакт · установить связь ]
          </p>
          <h2 className="mt-4 text-[clamp(1.7rem,3.4vw,2.7rem)] font-medium leading-[1.06] tracking-[-0.02em] text-runtime-ink">
            Пришлите данные о проекте — <span className="signal-text">обсудим</span> в
            ближайшее время.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-runtime-ink-soft">
            Свяжусь в WhatsApp или Telegram и рассчитаю стоимость вашей задачи в течение 2 часов.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_0.92fr] lg:gap-14">
          {/* form console */}
          <div className="relative bg-[color-mix(in_srgb,var(--color-signal)_28%,transparent)] p-px" style={CUT}>
            <div
              className="relative bg-[color-mix(in_srgb,var(--color-runtime-2)_92%,transparent)] p-6 backdrop-blur-sm sm:p-8"
              style={CUT}
            >
              <span className="pointer-events-none absolute left-3 top-3 size-2.5 border-l border-t border-[color-mix(in_srgb,var(--color-signal)_50%,transparent)]" />
              <span className="pointer-events-none absolute bottom-3 right-3 size-2.5 border-b border-r border-[color-mix(in_srgb,var(--color-signal)_50%,transparent)]" />

              {done ? (
                <div className="py-8 text-center">
                  <p className="tech-label text-[11px] text-[color-mix(in_srgb,var(--color-signal)_85%,white)]">
                    <span className="hud-dot mr-2 inline-block align-middle" />
                    // neural link established
                  </p>
                  <p className="mt-4 font-bold text-2xl text-runtime-ink">
                    Связь <span className="signal-text">установлена</span>.
                  </p>
                  <p className="mx-auto mt-3 max-w-sm text-sm text-runtime-ink-soft">
                    Сигнал получен — отвечу в течение 2 часов. Ваш проект уже в очереди на
                    обработку системой.
                  </p>
                  <p className="hud mt-5 text-[10px] text-runtime-ink-soft/70">
                    packet · {selected.length || 0} modules · status 200 · delivered
                  </p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <p className="tech-label mb-3 text-[11px] text-runtime-ink-soft">
                    [ 01 · тип проекта ]
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => toggle(t)}
                        aria-pressed={selected.includes(t)}
                        className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-colors ${
                          selected.includes(t)
                            ? "signal-grad border-transparent text-white"
                            : "border-runtime-line text-runtime-ink-soft hover:border-[color-mix(in_srgb,var(--color-signal)_55%,transparent)] hover:text-runtime-ink"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <p className="tech-label mb-3 mt-7 text-[11px] text-runtime-ink-soft">
                    [ 02 · данные ]
                  </p>
                  <div className="grid gap-3">
                    <textarea
                      value={form.about}
                      onChange={set("about")}
                      rows={3}
                      aria-label="Коротко о проекте и приблизительный бюджет"
                      placeholder="Коротко о проекте и приблизительный бюджет"
                      className={inputCls}
                    />
                    {/* почта не нужна; телефону/мессенджеру — больше места под подсказку */}
                    <div className="grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
                      <input value={form.name} onChange={set("name")} aria-label="Ваше имя" placeholder="Ваше имя" className={inputCls} />
                      <input
                        value={form.phone}
                        onChange={set("phone")}
                        required
                        aria-label="Телефон или мессенджер"
                        placeholder="Телефон или мессенджер"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    data-magnetic
                    data-cursor="route signal"
                    disabled={sending}
                    className="btn-case mt-6 w-full py-4 text-sm font-semibold disabled:opacity-60 sm:w-auto sm:px-14"
                  >
                    {sending ? "Отправляю…" : <>Обсудить проект <span aria-hidden>→</span></>}
                  </button>
                  {sendErr && (
                    <p className="mt-3 text-[12px] text-[#ff8f73]">
                      не удалось отправить — попробуйте ещё раз или напишите в telegram
                    </p>
                  )}
                  <p className="hud mt-4 text-[9px] text-runtime-ink-soft/60">
                    // данные уходят напрямую оператору · без спама
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* the machine — cube ⇄ network */}
          <div className="relative mx-auto hidden w-full max-w-[540px] lg:block">
            <div className="relative aspect-square">
              <CubeMorph className="absolute inset-0 h-full w-full" />
            </div>
            <p className="tech-label mt-2 text-center text-[10px] text-runtime-ink-soft">
              [ клик — куб ⇄ сеть данных ]
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
