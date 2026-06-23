"use client";

import { useState } from "react";
import { projectTypes } from "@/lib/content";

export default function QuoteForm() {
  const [done, setDone] = useState(false);
  const [phone, setPhone] = useState("");
  const [tg, setTg] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (t: string) =>
    setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // STUB: backend not wired yet. Logs payload; replace with /api/lead later.
    console.log("[lead]", { phone, tg, projectTypes: selected });
    setDone(true);
  };

  return (
    <section id="upgrade" className="scroll-mt-24 bg-dark py-16 text-bg lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="tech-label text-xs text-accent">контакты</span>
          <h2 className="mt-3 font-display text-[clamp(1.7rem,4vw,2.8rem)] font-semibold tracking-tight">
            Узнайте стоимость
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60">
            Свяжемся с вами в WhatsApp или Telegram и рассчитаем стоимость реализации вашей задачи
            в течение 2 часов.
          </p>
        </div>

        {done ? (
          <div className="mt-10 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.04] p-10 text-center">
            <p className="font-display text-xl font-semibold">Заявка принята ✦</p>
            <p className="mt-2 text-sm text-white/60">
              Спасибо! Я свяжусь с вами в ближайшее время. (Форма работает в демо-режиме —
              отправка пока не подключена.)
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
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
                      ? "border-transparent bg-gradient-accent text-bg"
                      : "border-white/15 text-white/70 hover:border-white/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs text-white/50">Ваш номер телефона</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 ___ ___-__-__"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/30 focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="text-xs text-white/50">Ваш Телеграм</span>
                <input
                  type="text"
                  value={tg}
                  onChange={(e) => setTg(e.target.value)}
                  placeholder="@username"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/30 focus:border-accent"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-gradient-accent py-3.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.01]"
            >
              Узнать стоимость
            </button>
            <p className="mt-3 text-center text-[11px] text-white/40">
              Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
