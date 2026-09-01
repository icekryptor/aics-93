// Общий конфиг квиза-брифа: используется дровером (QuizPanel) и
// инлайн-блоком на лендингах (QuizInline). Меняешь здесь — меняется везде.

export const QUIZ_TASKS = [
  "ребрендинг",
  "разработка сайта",
  "разработка сервиса",
  "интеграция ИИ / оцифровка",
  "маркетинговая консультация",
  "другое",
];

export const QUIZ_DEADLINES = ["как можно скорее", "7-14 дней", "14-28 дней", "1-3 месяца", "другое"];

export type QuizContact = { id: string; label: string; disabled?: boolean; tip?: string };
export const QUIZ_CONTACTS: QuizContact[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telegram", label: "Telegram" },
  { id: "email", label: "Почта" },
  { id: "fb", label: "Facebook" },
  { id: "max", label: "МАКС", disabled: true, tip: "этой фигнёй мы никогда не будем пользоваться" },
];

export const QUIZ_STEPS = ["задача", "замысел", "срок", "бюджет", "связь"];

export const QUIZ_HEADINGS = [
  "Какая у вас задача?",
  "Коротко — какой замысел хотите реализовать?",
  "Какой у вас срок на реализацию?",
  "Определите диапазон бюджета",
  "Удобный способ связи",
];

export const BUDGET_MIN = 0;
export const BUDGET_MAX = 1_000_000;
export const BUDGET_STEP = 5000;

export const fmtRub = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

/* --- data-driven шаги для инлайн-квиза (QuizInline) ---
   Лендинг может передать свой набор шагов; дефолт повторяет дровер. */

export type QuizStep =
  | { kind: "input"; key: string; title: string; placeholder?: string; multiline?: boolean }
  | { kind: "single"; key: string; title: string; options: string[]; other?: boolean }
  | { kind: "multi"; key: string; title: string; options: string[]; other?: boolean }
  | { kind: "budget"; key: string; title: string }
  | { kind: "contacts"; key: string; title: string };

export const DEFAULT_QUIZ_STEPS: QuizStep[] = [
  {
    kind: "single",
    key: "задача",
    title: "Какая у вас задача?",
    options: QUIZ_TASKS.filter((t) => t !== "другое"),
    other: true,
  },
  {
    kind: "input",
    key: "замысел",
    title: "Коротко — какой замысел хотите реализовать?",
    placeholder: "Пара предложений о проекте",
    multiline: true,
  },
  {
    kind: "single",
    key: "срок",
    title: "Какой у вас срок на реализацию?",
    options: QUIZ_DEADLINES.filter((d) => d !== "другое"),
    other: true,
  },
  { kind: "budget", key: "бюджет", title: "Определите диапазон бюджета" },
  { kind: "contacts", key: "связь", title: "Удобный способ связи" },
];

/* --- квиз-решение для КП (kpDecisionSteps) ---
   Дефолтная механика финала любого КП: вместо «напишите в телеграм» клиент
   отвечает по шагам, ответы уходят Тихоном в тот же поток заявок. Вопросы
   про формат и сроки задаёт само КП, хвост (что уточнить + связь) общий. */
export function kpDecisionSteps(opts: {
  /** Что решает клиент: вариант, пакет, формат. */
  choice: { key: string; title: string; options: string[] };
  /** Когда стартуем — свои варианты или дефолтные. */
  start?: { key: string; title: string; options: string[] };
  /** Доп. шаги КП перед хвостом (например, «какие предметы»). */
  extra?: QuizStep[];
}): QuizStep[] {
  const start = opts.start ?? {
    key: "когда стартуем",
    title: "Когда удобно начать?",
    options: ["как можно скорее", "в течение 2 недель", "в следующем месяце", "пока только обсуждаем"],
  };
  return [
    { kind: "single", other: true, ...opts.choice },
    { kind: "single", other: true, ...start },
    ...(opts.extra ?? []),
    {
      kind: "input",
      key: "вопросы",
      title: "Что осталось непонятным или вызывает сомнения?",
      placeholder: "Любой вопрос по предложению — отвечу до начала работы",
      multiline: true,
    },
    { kind: "contacts", key: "связь", title: "Как с вами связаться?" },
  ];
}
