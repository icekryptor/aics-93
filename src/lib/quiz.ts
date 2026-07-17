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
