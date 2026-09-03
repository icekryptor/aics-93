/* EngineBlock — «как работает ИИ-движок»: механика скорости и цены.
   Отстройка и от агентств (никто не объясняет, откуда 7–14 дней), и от
   нейро-конструкторов (мы не генерим шаблон — собираем по дизайн-системе).
   Серверный компонент: терминальная карточка на CSS, без канвасов.
   Тайминги фаз согласованы с Гантом лендинга сайтов (lib/services.ts). */

export type EngineBlockDict = {
  eyebrow: string;
  titlePre: string;
  titleAccent: string;
  subhead: string;
  roles: string[];
  honestPre: string;
  honestStrong: string;
  honestPost: string;
  log: { cmd?: boolean; text: string; when: string }[];
  logFooter: string;
};

const LOG: { cmd?: boolean; text: string; when: string }[] = [
  { cmd: true, text: "pipeline.start — бриф · распаковка смыслов · аудит", when: "день 0–1" },
  { text: "исследование конкурентов и ЦА → стратегия", when: "дни 1–3" },
  { text: "харнесс-система · обучение субагентов на BI", when: "дни 3–4" },
  { text: "дизайн-концепция — вручную, мной", when: "дни 4–6" },
  { text: "оцифровка дизайн-системы · прототип", when: "дни 6–8" },
  { text: "сборка: react/next.js · ts/python/postgres", when: "дни 8–12" },
  { cmd: true, text: "deploy MVP --prod · E2E-тесты", when: "день 7–14 ✓" },
];

const ROLES = ["аналитик", "копирайтер", "дизайнер", "разработчик"];

const RU_ENGINE: EngineBlockDict = {
  eyebrow: "[ движок · механика скорости ]",
  titlePre: "Как один инженер делает ",
  titleAccent: "работу четверых",
  subhead:
    "Агенты компилируют данные брифа и маркетингового анализа, дизайн-система генерирует страницы по фирменному стилю, интеграции стыкуются через читаемые API. Поэтому 7–14 дней и бюджет до 70% ниже — это не скидка, а другая себестоимость производства.",
  roles: ROLES,
  honestPre: "Это не генератор шаблонов: движок собирает по вашей дизайн-системе, а ",
  honestStrong: "каждую строку перед продакшеном проверяю я",
  honestPost: ". Если задачу быстрее решит конструктор — скажу об этом ещё на брифе.",
  log: LOG,
  logFooter:
    "ревью каждой строки — вручную · после запуска: харнесс заказчику + месяц поддержки",
};

export default function EngineBlock({ dict }: { dict?: Partial<EngineBlockDict> } = {}) {
  const D: EngineBlockDict = { ...RU_ENGINE, ...dict };
  return (
    <section id="engine" className="runtime relative scroll-mt-24 overflow-hidden py-[50px] lg:py-[80px]">
      <div className="runtime-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="signal-seam absolute inset-x-0 top-0" aria-hidden />

      <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          {/* тезис */}
          <div>
            <p className="tech-label text-[11px] text-[color-mix(in_srgb,var(--color-signal)_80%,white)]">
              {D.eyebrow}
            </p>
            <h2 className="mt-4 text-[clamp(1.7rem,3.4vw,2.7rem)] font-medium leading-[1.06] tracking-[-0.02em] text-runtime-ink">
              {D.titlePre}<span className="signal-text">{D.titleAccent}</span>
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-runtime-ink-soft">
              {D.subhead}
            </p>

            {/* 1 = 4: роли, которые закрывает движок */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="font-display text-[1.35rem] leading-none text-runtime-ink">1 = 4</span>
              <span aria-hidden className="mx-1 h-4 w-px bg-runtime-line" />
              {D.roles.map((r) => (
                <span
                  key={r}
                  className="tech-label rounded-full border border-runtime-line px-3 py-1.5 text-[11px] text-runtime-ink-soft"
                >
                  {r}
                </span>
              ))}
            </div>

            {/* честная плашка — анти-хайп */}
            <div
              className="mt-7 max-w-lg border-l-2 pl-4"
              style={{ borderColor: "var(--color-signal-cool)" }}
            >
              <p className="text-[13.5px] leading-relaxed text-runtime-ink-soft">
                {D.honestPre}
                <span className="text-runtime-ink">{D.honestStrong}</span>
                {D.honestPost}
              </p>
            </div>
          </div>

          {/* терминал движка */}
          <div
            className="overflow-hidden rounded-[14px] border border-runtime-line"
            style={{ background: "color-mix(in srgb, var(--color-runtime-2) 92%, transparent)" }}
          >
            {/* строка заголовка */}
            <div className="flex items-center gap-2 border-b border-runtime-line px-5 py-3">
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <span key={c} className="size-2.5 rounded-full" style={{ background: c, opacity: 0.75 }} />
              ))}
              <span className="hud ml-2 text-[10px] text-runtime-ink-soft" style={{ textTransform: "none" }}>
                aics-93 · engine.log
              </span>
            </div>

            <div className="space-y-3 px-5 py-5 sm:px-6">
              {D.log.map((l) => (
                <div key={l.text} className="flex items-baseline justify-between gap-4">
                  <p
                    className="hud min-w-0 text-[11.5px] leading-relaxed"
                    style={{ textTransform: "none", color: l.cmd ? "var(--color-signal-cool)" : "var(--color-runtime-ink)" }}
                  >
                    <span aria-hidden className="mr-2 opacity-60">{l.cmd ? "$" : "▸"}</span>
                    {l.text}
                  </p>
                  <span className="hud shrink-0 text-[10px] text-runtime-ink-soft" style={{ textTransform: "none" }}>{l.when}</span>
                </div>
              ))}
              {/* сквозная строка ревью + курсор */}
              <div className="mt-1 border-t border-runtime-line/60 pt-3">
                <p className="hud text-[11.5px] leading-relaxed text-runtime-ink-soft" style={{ textTransform: "none" }}>
                  <span aria-hidden className="mr-2 opacity-60">∞</span>
                  {D.logFooter}
                  <span aria-hidden className="hud-dot ml-2 inline-block align-middle" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
