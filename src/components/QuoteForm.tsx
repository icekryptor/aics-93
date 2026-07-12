"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { projectTypes, assets } from "@/lib/content";
import { reachGoal } from "@/lib/metrika";

export default function QuoteForm() {
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", about: "" });
  const [experience, setExperience] = useState(false);

  useEffect(() => {
    setExperience(document.documentElement.hasAttribute("data-experience"));
  }, []);

  const toggle = (t: string) =>
    setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // STUB: backend not wired yet. Replace with POST /api/lead → Telegram.
    console.log("[lead]", { ...form, projectTypes: selected });
    reachGoal("lead", { source: "quote_form", modules: selected.length });
    setDone(true);
  };

  const inputCls =
    "w-full rounded-2xl border border-white/15 bg-transparent px-5 py-4 text-sm outline-none transition-colors placeholder:text-white/35 focus:border-accent";

  return (
    <section id="upgrade" className="relative scroll-mt-24 overflow-hidden bg-dark py-[30px] text-bg lg:py-[50px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="max-w-xl text-[clamp(1.6rem,3.4vw,2.4rem)] font-medium leading-tight tracking-tight">
              Пришлите данные о проекте, и мы свяжемся с вами для обсуждения в ближайшее время
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
              Свяжемся в WhatsApp или Telegram и рассчитаем стоимость вашей задачи в течение 2 часов.
            </p>

            {done ? (
              experience ? (
                <div className="mt-8 overflow-hidden rounded-[28px] border border-[color-mix(in_srgb,var(--color-signal)_35%,transparent)] bg-white/[0.03] p-10 signal-glow">
                  <p className="tech-label text-[11px] text-[color-mix(in_srgb,var(--color-signal)_85%,white)]">
                    <span className="hud-dot mr-2 inline-block align-middle" />
                    // neural link established
                  </p>
                  <p className="mt-4 font-bold text-2xl">
                    Связь <span className="signal-text">установлена</span>.
                  </p>
                  <p className="mt-2 max-w-sm text-sm text-white/55">
                    Сигнал получен — отвечу в течение 2 часов. Ваш проект уже в очереди на обработку системой.
                  </p>
                  <p className="hud mt-5 text-[10px] text-white/40">
                    packet · {selected.length || 0} modules · status 200 · demo mode
                  </p>
                </div>
              ) : (
                <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-10 text-center">
                  <p className="font-bold text-xl">Заявка принята ✦</p>
                  <p className="mt-2 text-sm text-white/55">
                    Спасибо! Свяжусь с вами в ближайшее время. (Демо-режим — отправка пока не подключена.)
                  </p>
                </div>
              )
            ) : (
              <form onSubmit={submit} className="mt-8">
                <p className="mb-3 text-sm font-medium">Какой тип проекта вы хотите заказать?</p>
                <div className="flex flex-wrap gap-2">
                  {projectTypes.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => toggle(t)}
                      aria-pressed={selected.includes(t)}
                      className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${
                        selected.includes(t)
                          ? "border-transparent bg-gradient-accent text-white"
                          : "border-white/15 text-white/70 hover:border-white/40"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="mt-5 grid gap-3">
                  <textarea
                    value={form.about}
                    onChange={set("about")}
                    rows={3}
                    aria-label="Коротко о проекте и приблизительный бюджет"
                    placeholder="Коротко о проекте и приблизительный бюджет"
                    className={inputCls}
                  />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input value={form.name} onChange={set("name")} aria-label="Ваше имя" placeholder="Ваше имя" className={inputCls} />
                    <input
                      value={form.phone}
                      onChange={set("phone")}
                      required
                      aria-label="Телефон или мессенджер"
                      placeholder="Телефон или мессенджер"
                      className={inputCls}
                    />
                    <input
                      value={form.email}
                      onChange={set("email")}
                      type="email"
                      aria-label="Ваша почта"
                      placeholder="Ваша почта"
                      className={inputCls}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-5 w-full rounded-2xl bg-gradient-accent py-4 text-sm font-semibold text-white transition-transform hover:scale-[1.01] sm:w-auto sm:px-16"
                >
                  Обсудить проект
                </button>
              </form>
            )}
          </div>

          {/* rocket */}
          <div className="relative mx-auto hidden aspect-square w-full max-w-[420px] lg:block">
            <Image src={assets.rocket} alt="" fill sizes="420px" className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
