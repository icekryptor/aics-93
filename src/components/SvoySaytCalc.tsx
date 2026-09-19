"use client";

import { useState } from "react";
import { reachGoal } from "@/lib/metrika";
import { sendLead } from "@/lib/lead";

/* SvoySaytCalc — форма и расчёт для страницы «свой сайт вместо конструктора».
   Контакт берём до расчёта: два поля цифр и один контакт, результат
   показываем после подтверждённой доставки в Telegram.

   Модель. Считаем только прирост от скорости — владение и возраст дизайна
   в деньги не переводятся. Профиль взят типовой для сайта на конструкторе
   (LCP около 3.5 с, INP свыше 500 мс); это допущение написано под расчётом.

   Лифты не складываются: перемножаются и демпфируются в степени 0.6 —
   один и тот же посетитель уходит один раз, а не дважды. Сверху лежит
   коэффициент реализуемости: сайт не единственный фактор продаж. */

const DAMPING = 0.6;
const LIFT_LCP = { cons: 0.03, base: 0.05, opt: 0.07 }; // Akamai: −7%/с, взято ниже
const LIFT_INP = { cons: 0.1, base: 0.18, opt: 0.25 }; // Contentsquare: 2.5% против 2.0%
const REALIZATION = { cons: 0.5, base: 0.7, opt: 0.9 };

type Key = "cons" | "base" | "opt";
const SCEN: { key: Key; name: string; note: string }[] = [
  { key: "cons", name: "Консервативный", note: "половина эффекта доходит до заявок" },
  { key: "base", name: "Базовый", note: "70% эффекта" },
  { key: "opt", name: "Оптимистичный", note: "90% эффекта" },
];

function lift(k: Key) {
  return (Math.pow((1 + LIFT_LCP[k]) * (1 + LIFT_INP[k]), DAMPING) - 1) * REALIZATION[k];
}

const nf = new Intl.NumberFormat("ru-RU");

export default function SvoySaytCalc({ source = "svoy_sayt" }: { source?: string }) {
  const [clicks, setClicks] = useState("");
  const [cr, setCr] = useState("");
  const [contact, setContact] = useState("");
  const [site, setSite] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const nClicks = Number(clicks.replace(/\s/g, "")) || 0;
  const nCr = Number(cr.replace(",", ".")) || 0;
  const valid = nClicks > 0 && nCr > 0 && nCr <= 100 && contact.trim().length > 2;

  const leadsNow = (nClicks * nCr) / 100;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || state === "sending") return;
    setState("sending");
    reachGoal("calc_submit", { source });

    const ok = await sendLead(source, {
      контакт: contact.trim(),
      сайт: site.trim() || "—",
      "кликов в месяц": nClicks,
      "конверсия в лида, %": nCr,
      "лидов сейчас в месяц": Math.round(leadsNow),
      "прирост лидов, консервативно": Math.round(leadsNow * lift("cons")),
      "прирост лидов, базовый": Math.round(leadsNow * lift("base")),
    });

    if (ok) {
      setState("done");
      reachGoal("calc_lead", { source });
    } else {
      setState("error");
    }
  }

  const field =
    "w-full rounded-xl border border-runtime-line bg-[rgba(255,255,255,0.02)] px-4 py-3 text-[15px] " +
    "text-runtime-ink outline-none transition-colors placeholder:text-runtime-ink-soft/60 " +
    "focus:border-[color-mix(in_srgb,var(--color-signal)_60%,transparent)]";
  const label = "tech-label mb-2 block text-[11px] text-runtime-ink-soft";

  if (state === "done") {
    const lNow = leadsNow;
    return (
      <div className="rounded-2xl border border-runtime-line bg-[rgba(255,255,255,0.02)] p-6 sm:p-8">
        <span className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
          расчёт по вашим цифрам
        </span>
        <p className="mt-4 text-[15px] leading-relaxed text-runtime-ink-soft">
          Сейчас {nf.format(nClicks)} кликов в месяц при конверсии {nCr}% дают{" "}
          <span className="text-runtime-ink">{nf.format(Math.round(lNow))} заявок в месяц</span>.
          Ниже — сколько добавит приведение скорости в пороги Core Web Vitals.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-[14px] [font-variant-numeric:tabular-nums]">
            <thead>
              <tr>
                {["Сценарий", "Конверсия", "Заявок в месяц", "За год"].map((h, i) => (
                  <th
                    key={h}
                    className={`tech-label border-b border-runtime-line px-2 py-3 text-[11px] font-normal text-runtime-ink-soft ${
                      i === 0 ? "text-left" : "text-right"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCEN.map((s) => {
                const l = lift(s.key);
                const add = lNow * l;
                return (
                  <tr key={s.key} className={s.key === "cons" ? "bg-[rgba(255,255,255,0.03)]" : ""}>
                    <td className="border-b border-runtime-line px-2 py-3 text-runtime-ink">
                      {s.name}
                      <span className="mt-0.5 block text-[12px] text-runtime-ink-soft">{s.note}</span>
                    </td>
                    <td className="border-b border-runtime-line px-2 py-3 text-right text-runtime-ink">
                      +{(l * 100).toFixed(1)}%
                    </td>
                    <td className="border-b border-runtime-line px-2 py-3 text-right text-runtime-ink">
                      +{nf.format(Math.round(add))}
                    </td>
                    <td className="border-b border-runtime-line px-2 py-3 text-right text-runtime-ink">
                      +{nf.format(Math.round(add * 12))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-[13px] leading-relaxed text-runtime-ink-soft">
          Расчёт сделан для типичного сайта на конструкторе: отрисовка главного блока около
          3.5 с при пороге 2.5 с, отклик на нажатие свыше 500 мс при пороге 200 мс. Если ваш
          сайт быстрее — прирост будет меньше. Точные значения по вашему адресу я замерю
          и пришлю вместе с разбором.
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-runtime-ink-soft">
          Заявка ушла. Вернусь с замером скорости вашего сайта и расчётом на фактических данных.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-runtime-line bg-[rgba(255,255,255,0.02)] p-6 sm:p-8">
      <span className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
        расчёт по вашим цифрам
      </span>
      <h3 className="mt-3 text-[20px] font-semibold tracking-tight text-runtime-ink">
        Две цифры — и покажу, сколько заявок добавит скорость
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-runtime-ink-soft">
        Обе есть в Метрике: посещаемость за месяц и конверсия в целевое действие.
        Оценка приблизительная, без гарантий.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="c-clicks">
            кликов в месяц
          </label>
          <input
            id="c-clicks"
            className={field}
            inputMode="numeric"
            placeholder="5000"
            value={clicks}
            onChange={(e) => setClicks(e.target.value)}
          />
        </div>
        <div>
          <label className={label} htmlFor="c-cr">
            конверсия в лида, %
          </label>
          <input
            id="c-cr"
            className={field}
            inputMode="decimal"
            placeholder="2.5"
            value={cr}
            onChange={(e) => setCr(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="c-contact">
            почта или телеграм
          </label>
          <input
            id="c-contact"
            className={field}
            placeholder="@username или mail@company.ru"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <div>
          <label className={label} htmlFor="c-site">
            адрес сайта — необязательно
          </label>
          <input
            id="c-site"
            className={field}
            placeholder="example.ru"
            value={site}
            onChange={(e) => setSite(e.target.value)}
          />
        </div>
      </div>

      {/* honeypot: боты заполняют, люди не видят */}
      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] size-0 opacity-0"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
      />

      <button
        type="submit"
        disabled={!valid || state === "sending"}
        data-magnetic
        className="btn-case mt-6 grid h-11 w-full place-items-center px-6 text-[14px] font-semibold disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        {state === "sending" ? "отправляю…" : "показать расчёт"}
      </button>

      {state === "error" && (
        <p className="mt-3 text-[13px] text-[var(--color-destructive)]">
          Не удалось отправить. Напишите в телеграм — посчитаю вручную.
        </p>
      )}

      <p className="mt-4 text-[12px] leading-relaxed text-runtime-ink-soft">
        Оставляя контакт, вы соглашаетесь на обработку данных для ответа на заявку.
        Расчёт придёт на экран сразу после отправки.
      </p>
    </form>
  );
}
