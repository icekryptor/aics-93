import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GoalLink from "@/components/system/GoalLink";
import { legal } from "@/lib/content";

/* КП для MARTOX — коммерческое предложение в виде лендинга (noindex, вне
   sitemap). Структура: понимание задачи → структура будущего лендинга с
   подсвеченными рекомендациями → варианты реализации → Гант ×2 → условия →
   работы → следующий шаг. Фото — Higgsfield (nano banana), скрины работ —
   реальные. Кликабельное содержание — якоря. */

export const metadata: Metadata = {
  title: "КП для MARTOX — лендинг выхода брендов на рынок США",
  description:
    "Коммерческое предложение AICS-93: продающий лендинг для MARTOX — структура, рекомендации, два варианта реализации с планом и сроками.",
  robots: { index: false, follow: false },
};

const CHIP: React.CSSProperties = {
  clipPath:
    "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
};

const TOC = [
  { id: "task", num: "01", label: "понимание задачи" },
  { id: "structure", num: "02", label: "структура лендинга + рекомендации" },
  { id: "options", num: "03", label: "варианты реализации" },
  { id: "plan", num: "04", label: "план и сроки · гант" },
  { id: "terms", num: "05", label: "состав и условия" },
  { id: "works", num: "06", label: "работы" },
  { id: "next", num: "07", label: "следующий шаг" },
];

/* блоки будущего лендинга: из ТЗ (kind: tz) и наши рекомендации (kind: rec) */
const STRUCTURE: { kind: "tz" | "rec"; title: string; text: string }[] = [
  {
    kind: "tz",
    title: "Хиро: оффер + два CTA",
    text: "«Выведем ваш бренд на рынок США с готовой инфраструктурой и системой под ключ» + кнопки «Получить стратегию выхода» и «Оценить потенциал бренда». Фон — атмосферный визуал уровня кино (примеры сгенерированы ниже по этой странице).",
  },
  {
    kind: "rec",
    title: "Строка доверия под хиро",
    text: "Цифры и факты MARTOX: сколько брендов выведено, категории, партнёрская сеть, логотипы платформ (Amazon, Shopify, Walmart). Холодный трафик решает за 5 секунд — соцдоказательство должно быть до скролла.",
  },
  {
    kind: "tz",
    title: "«То, на поиск чего уходят месяцы, у нас уже есть» — 7 шагов инфраструктуры",
    text: "Компания и счёт, налоги, аналитика и выбор товара, логистика и таможня, склад, торговая марка, регистрация на платформах. Подача — нумерованный процесс в стиле конвейера: виден путь от нуля до продаж.",
  },
  {
    kind: "tz",
    title: "«Вы уже продаёте на WB и Ozon? Это ваш следующий шаг» — 8 причин рынка США",
    text: "Размер рынка, цена товара, независимость, защита бизнеса, валюта, конкуренция, масштаб, статус бренда. Финал блока: «Wildberries и Ozon дали вам опыт. США дадут масштаб» — выносим крупной строкой.",
  },
  {
    kind: "rec",
    title: "Квиз «Оценить потенциал бренда»",
    text: "Кнопка из хиро получает реальную механику: 4–5 вопросов (категория, оборот на WB/Ozon, маржа, цель) → результат + заявка. Квиз конвертирует холодную аудиторию в 2–3 раза лучше формы — проверено на наших проектах; лиды падают в Telegram команде MARTOX мгновенно.",
  },
  {
    kind: "tz",
    title: "13 способов продаж на рынке США",
    text: "Shopify, Amazon, Etsy, Walmart, TikTok Shop, ритейл, опт, Instagram, инфлюенсеры, контент, аффилиаты, выставки, PR. Рекомендуем интерактивный формат: фильтр «какой канал подходит вашему товару» вместо простыни из 13 абзацев.",
  },
  {
    kind: "rec",
    title: "История одного бренда (кейс)",
    text: "Один разбор пути: товар → инфраструктура → первые продажи, с цифрами и таймлайном. Абстрактные обещания продают хуже, чем один конкретный путь. Если публичных цифр пока нет — формат «как это устроено» на обезличенном примере.",
  },
  {
    kind: "tz",
    title: "Что входит в работу с MARTOX — 6 карточек",
    text: "Стратегия выхода, юридическое оформление, логистика и таможня, склад и фулфилмент, платформы и продажи, маркетинг в США.",
  },
  {
    kind: "tz",
    title: "Пакеты: Ecosystem · Support · Growth",
    text: "Три формата работы с прозрачным составом. Рекомендуем таблицу сравнения с подсветкой среднего пакета — классика, которая работает.",
  },
  {
    kind: "rec",
    title: "FAQ + разметка для поиска и ИИ",
    text: "Частые вопросы (сроки, налоги, риски, платежи) с JSON-LD-разметкой: снимает возражения и даёт расширенный сниппет в Google. Плюс llms.txt — ИИ-ассистенты уже рекомендуют подрядчиков, и MARTOX стоит быть в этих ответах.",
  },
  {
    kind: "rec",
    title: "Лид-магнит: чеклист «Первые 90 дней в США»",
    text: "Чеклист уже есть в составе пакета Ecosystem — его фрагмент отлично работает как магнит: контакт в обмен на PDF. Тёплый вход для тех, кто пока не готов к консультации.",
  },
  {
    kind: "tz",
    title: "CTA: «Готовы обсудить ваш бренд?»",
    text: "Форма заявки на консультацию + рекомендуем альтернативу без формы: «напишите в мессенджер» — часть аудитории конвертируется только так.",
  },
];

type Phase = { name: string; days: number; start: number; color: string };
const GANTT_1: { total: number; phases: Phase[] } = {
  total: 14,
  phases: [
    { name: "Бриф · аудит смыслов и ТЗ", days: 1, start: 0, color: "#ff3d92" },
    { name: "Исследование ЦА и конкурентов · стратегия", days: 2, start: 1, color: "#d94fe6" },
    { name: "Харнесс и обучение субагентов", days: 1, start: 3, color: "#b15cff" },
    { name: "Дизайн-концепция (вручную)", days: 2, start: 4, color: "#9747ff" },
    { name: "Дизайн-система · прототип", days: 2, start: 6, color: "#8b67ff" },
    { name: "Сборка страницы · квиз · интеграции", days: 4, start: 8, color: "#7a7bff" },
    { name: "E2E-тесты · деплой", days: 2, start: 12, color: "#5fd9f5" },
  ],
};
const GANTT_2: { total: number; phases: Phase[] } = {
  total: 24,
  phases: [
    { name: "Бриф · исследование · стратегия", days: 4, start: 0, color: "#ff3d92" },
    { name: "Харнесс · дизайн-концепция", days: 4, start: 4, color: "#d94fe6" },
    { name: "Дизайн-система · прототипы страниц", days: 4, start: 8, color: "#9747ff" },
    { name: "Сборка главной · квиз · интеграции", days: 4, start: 12, color: "#8b67ff" },
    { name: "Раздел «13 каналов» — генерация страниц", days: 4, start: 16, color: "#7a7bff" },
    { name: "SEO-контур · пакеты · финальные тесты", days: 4, start: 20, color: "#5fd9f5" },
  ],
};

function Gantt({ label, note, data }: { label: string; note: string; data: { total: number; phases: Phase[] } }) {
  return (
    <div
      className="overflow-hidden rounded-2xl px-6 py-7 sm:px-8"
      style={{ border: "1px solid var(--color-runtime-line)", background: "rgba(23,16,41,0.4)" }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="tech-label text-[0.7rem]" style={{ color: "var(--color-signal-2)" }}>
          {label}
        </p>
        <p className="text-[0.85rem] text-runtime-ink-soft">{note}</p>
      </div>
      <div className="mt-6 space-y-5">
        {data.phases.map((p) => (
          <div key={p.name}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-[0.88rem]">
              <span className="font-medium text-runtime-ink">{p.name}</span>
              <span className="shrink-0 text-runtime-ink-soft">
                {p.days} {p.days === 1 ? "день" : p.days < 5 ? "дня" : "дней"}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[rgba(151,71,255,0.1)]">
              <div
                className="h-full rounded-full"
                style={{
                  marginLeft: `${(p.start / data.total) * 100}%`,
                  width: `${(p.days / data.total) * 100}%`,
                  background: p.color,
                  boxShadow: `0 0 12px ${p.color}55`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="hud mt-5 text-[9px] text-runtime-ink-soft/60">
        // итого ≈ {data.total} дней · этапы идут каскадом
      </p>
    </div>
  );
}

const WORKS: { name: string; url: string; img: string }[] = [
  { name: "ximi4ka.ru", url: "https://ximi4ka.ru", img: "/assets/kp/works/ximi4ka.jpg" },
  { name: "rings-master.ru", url: "https://rings-master.ru/", img: "/assets/kp/works/rings-master.jpg" },
  { name: "upliti.ru", url: "https://upliti.ru/", img: "/assets/kp/works/upliti.jpg" },
  { name: "evo.center", url: "https://evo.center/", img: "/assets/kp/works/evo-center.jpg" },
  { name: "hst-transport.net", url: "https://hst-transport.net/", img: "/assets/kp/works/hst-transport.jpg" },
  { name: "eugene-hantsel.ru", url: "https://eugene-hantsel.ru/", img: "/assets/kp/works/eugene-hantsel.jpg" },
  { name: "evgeniigantsel.com", url: "https://evgeniigantsel.com/", img: "/assets/kp/works/evgeniigantsel.jpg" },
  { name: "body7steps.com", url: "https://body7steps.com/", img: "/assets/kp/works/body7steps.jpg" },
];

const INCLUDED = [
  "исследование конкурентов и ЦА, маркетинговая стратегия",
  "дизайн-концепция (вручную) и дизайн-система",
  "сборка на React / Next.js — лёгкий код без CMS и подписок",
  "квиз, формы, доставка лидов в Telegram / CRM",
  "аналитика: Метрика с целями, SEO/GEO-контур, JSON-LD",
  "E2E-тесты, публикация MVP, месяц поддержки",
  "передача харнесса, инструкций и обучение команды",
];

const TERMS = [
  "оплата 50 / 50",
  "в белую: договор и расчётный счёт",
  "материальная ответственность за сроки",
  "показатели эффективности — в договоре",
];

export default function KpMartoxPage() {
  return (
    <div className="text-runtime-ink">
      {/* ---------- hero ---------- */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/assets/kp/port.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(14,10,27,0.55) 0%, rgba(14,10,27,0.75) 60%, var(--color-runtime) 100%)",
            }}
          />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-20 sm:px-8 sm:pt-28">
          <span
            className="tech-label inline-flex items-center gap-2 text-[0.72rem]"
            style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
          >
            <span className="hud-dot" style={{ display: "inline-block" }} />
            коммерческое предложение · aics-93 → martox
          </span>
          <h1 className="mt-6 max-w-3xl text-[clamp(2rem,4.6vw,3.3rem)] font-semibold leading-[1.05] tracking-tight">
            Лендинг для <span className="signal-text">MARTOX</span>: страница, которая продаёт
            выход брендов на рынок США
          </h1>
          <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-runtime-ink-soft">
            По вашему ТЗ и прототипу — продающая страница в фирменном стиле MARTOX: структура
            под холодный и тёплый трафик, квиз-механика, доставка лидов в мессенджер. Ниже —
            разбор структуры, наши рекомендации, два варианта реализации и план по дням.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {["сроки: от 7 дней", "бюджет: от 1 500 $", "лендинг или многостраничник", "24 июля 2026"].map((c) => (
              <span
                key={c}
                className="tech-label rounded-full border border-runtime-line bg-black/30 px-3.5 py-1.5 text-[11px] text-runtime-ink-soft"
              >
                {c}
              </span>
            ))}
          </div>

          {/* содержание — кликабельное */}
          <nav aria-label="Содержание" className="mt-10 max-w-3xl">
            <p className="tech-label text-[0.68rem] text-runtime-ink-soft">[ содержание ]</p>
            <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {TOC.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className="group flex items-baseline gap-2.5 rounded-[3px] px-2 py-1.5 transition-colors hover:bg-white/[0.05]"
                >
                  <span className="hud text-[10px]" style={{ color: "var(--color-signal-2)" }}>
                    {t.num}
                  </span>
                  <span className="tech-label text-[12.5px] text-runtime-ink-soft transition-colors group-hover:text-runtime-ink">
                    {t.label}
                  </span>
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
        {/* ---------- 01 задача ---------- */}
        <section id="task" className="scroll-mt-28 pt-14">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 01 · понимание задачи ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            MARTOX выводит бренды из России и СНГ в США. Странице нужно продавать это — а не
            рассказывать об этом
          </h2>
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]">
            <div className="space-y-4 text-[15px] leading-relaxed text-runtime-ink-soft">
              <p>
                Продукт — готовая инфраструктура для работы в США: компания и счёт, налоги,
                логистика, склад, торговая марка, платформы продаж. Аудитория — селлеры
                Wildberries и Ozon с работающим продуктом: у них уже есть всё для выхода,
                кроме инфраструктуры.
              </p>
              <p>
                Цель страницы — заявка на консультацию и стратегию выхода. Контент готов
                (ТЗ закрывает все блоки), прототип отрисован в Figma. Наша задача — довести
                это до продающей страницы: усилить структуру, добавить механики захвата лида
                и собрать быстро и без потери качества.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["контент: готов (ТЗ)", "прототип: Figma", "cta: заявка на консультацию", "тон: экспертный, без воды"].map((c) => (
                  <span
                    key={c}
                    className="tech-label rounded-full border border-runtime-line px-3.5 py-1.5 text-[11px] text-runtime-ink-soft"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <figure className="relative overflow-hidden rounded-[18px] border border-runtime-line">
              <Image
                src="/assets/kp/skyline.jpg"
                alt="Ночной Нью-Йорк — рынок, на который MARTOX выводит бренды"
                width={1376}
                height={768}
                sizes="(min-width: 1024px) 480px, 100vw"
                className="h-auto w-full"
              />
              <figcaption className="tech-label absolute bottom-3 left-4 text-[10px] text-white/60">
                визуал: примеры атмосферы для будущего лендинга
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ---------- 02 структура ---------- */}
        <section id="structure" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 02 · структура будущего лендинга ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Все блоки вашего ТЗ — плюс то, что мы{" "}
            <span style={{ color: "var(--color-signal-cool)" }}>рекомендуем добавить</span>
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-runtime-ink-soft">
            Порядок — по логике принятия решения посетителем. Подсвеченные карточки — наши
            рекомендации сверх ТЗ: каждая с обоснованием, все обсуждаемы и не влияют на базовую
            смету критично.
          </p>

          <div className="mt-9 space-y-3">
            {STRUCTURE.map((b, i) => {
              const rec = b.kind === "rec";
              return (
                <div
                  key={b.title}
                  className="relative p-5 sm:p-6"
                  style={{
                    ...CHIP,
                    border: rec
                      ? "1px solid color-mix(in srgb, var(--color-signal-cool) 55%, transparent)"
                      : "1px solid var(--color-runtime-line)",
                    background: rec
                      ? "radial-gradient(120% 160% at 0% 0%, rgba(95,217,245,0.10), transparent 55%), rgba(23,16,41,0.5)"
                      : "rgba(23,16,41,0.35)",
                  }}
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <span
                      className="hud shrink-0 text-[11px]"
                      style={{ color: rec ? "var(--color-signal-cool)" : "var(--color-signal-2)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[1.05rem] font-semibold leading-snug">{b.title}</h3>
                    {rec && (
                      <span
                        className="tech-label rounded-full px-3 py-1 text-[10px] font-semibold"
                        style={{ background: "var(--color-signal-cool)", color: "#0b1e33" }}
                      >
                        рекомендуем добавить
                      </span>
                    )}
                  </div>
                  <p className="mt-2.5 max-w-3xl pl-8 text-[14px] leading-relaxed text-runtime-ink-soft">
                    {b.text}
                  </p>
                </div>
              );
            })}
          </div>

          <figure className="relative mt-8 overflow-hidden rounded-[18px] border border-runtime-line">
            <Image
              src="/assets/kp/warehouse.jpg"
              alt="Фулфилмент-инфраструктура — атмосфера блока «7 шагов»"
              width={1376}
              height={768}
              sizes="(min-width: 1024px) 1080px, 100vw"
              className="h-auto w-full"
            />
            <figcaption className="tech-label absolute bottom-3 left-4 text-[10px] text-white/60">
              визуал для блока «инфраструктура» — сгенерирован под этот проект, стиль обсуждаем
            </figcaption>
          </figure>
        </section>

        {/* ---------- 03 варианты ---------- */}
        <section id="options" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 03 · варианты реализации ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Два пути: быстрый запуск или платформа под трафик
          </h2>
          <div className="mt-9 grid gap-5 lg:grid-cols-2">
            {/* вариант 1 */}
            <article
              className="flex h-full flex-col p-6 sm:p-7"
              style={{
                ...CHIP,
                border: "1px solid color-mix(in srgb, var(--color-signal) 50%, transparent)",
                background: "radial-gradient(120% 140% at 88% 0%, rgba(151,71,255,0.16), transparent 60%), rgba(23,16,41,0.5)",
              }}
            >
              <p className="tech-label text-[10px] text-runtime-ink-soft">вариант 01 · рекомендуем для старта</p>
              <h3 className="mt-2 text-[1.3rem] font-semibold leading-snug">Лендинг</h3>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-display text-[1.6rem] leading-none tracking-tight">от 1 500 $</span>
                <span className="tech-label text-[11px]" style={{ color: "var(--color-signal-cool)" }}>
                  7–14 дней
                </span>
              </div>
              <ul className="mt-5 space-y-2 text-[13.5px] leading-relaxed text-runtime-ink-soft">
                {[
                  "одна страница: все блоки ТЗ + рекомендации выше",
                  "квиз «оценить потенциал бренда» + формы → лиды в Telegram",
                  "фирменный стиль MARTOX, атмосферные визуалы",
                  "аналитика с целями, базовое SEO и разметка",
                  "быстрый запуск: можно лить рекламу через 2 недели",
                ].map((li) => (
                  <li key={li} className="flex items-start gap-2.5">
                    <span aria-hidden className="mt-[0.62em] h-px w-3.5 shrink-0" style={{ background: "var(--color-signal-2)" }} />
                    {li}
                  </li>
                ))}
              </ul>
            </article>
            {/* вариант 2 */}
            <article
              className="flex h-full flex-col p-6 sm:p-7"
              style={{
                ...CHIP,
                border: "1px solid var(--color-runtime-line)",
                background: "rgba(23,16,41,0.4)",
              }}
            >
              <p className="tech-label text-[10px] text-runtime-ink-soft">вариант 02 · для органического роста</p>
              <h3 className="mt-2 text-[1.3rem] font-semibold leading-snug">Многостраничник</h3>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-display text-[1.6rem] leading-none tracking-tight">смета по составу</span>
                <span className="tech-label text-[11px]" style={{ color: "var(--color-signal-cool)" }}>
                  ≈ 24 дня
                </span>
              </div>
              <ul className="mt-5 space-y-2 text-[13.5px] leading-relaxed text-runtime-ink-soft">
                {[
                  "всё из варианта 1 — как главная страница",
                  "раздел «13 каналов продаж»: отдельная SEO-страница под каждый канал",
                  "страницы пакетов Ecosystem / Support / Growth",
                  "блог под запросы «выход на рынок США», «продавать на Amazon» — органический трафик без аукциона",
                  "генерация страниц по дизайн-системе — новые добавляются за часы",
                ].map((li) => (
                  <li key={li} className="flex items-start gap-2.5">
                    <span aria-hidden className="mt-[0.62em] h-px w-3.5 shrink-0" style={{ background: "var(--color-signal-2)" }} />
                    {li}
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <p className="mt-5 max-w-3xl text-[13.5px] leading-relaxed text-runtime-ink-soft">
            Честная рекомендация: стартовать с варианта 1 — проверить оффер и рекламные связки,
            затем апгрейд до варианта 2 на той же дизайн-системе, без переделки с нуля. Смета
            варианта 2 фиксируется после выбора состава страниц.
          </p>
        </section>

        {/* ---------- 04 гант ---------- */}
        <section id="plan" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 04 · план и сроки ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            По дням — от брифа до продакшена
          </h2>
          <div className="mt-9 grid gap-5 xl:grid-cols-2">
            <Gantt label="вариант 01 · лендинг" note="запуск за 7–14 дней" data={GANTT_1} />
            <Gantt label="вариант 02 · многостраничник" note="запуск ≈ 24 дня" data={GANTT_2} />
          </div>
          <p className="mt-5 text-[13.5px] leading-relaxed text-runtime-ink-soft">
            Сроки — обязательство, а не оценка: ответственность за них прописывается в договоре.
            Скорость даёт ИИ-конвейер: агенты закрывают исследование, генерацию и вёрстку,
            дизайн-концепцию делаю вручную, каждую строку перед продакшеном проверяю сам.
          </p>
        </section>

        {/* ---------- 05 условия ---------- */}
        <section id="terms" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 05 · состав и условия ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Что входит в любую из смет
          </h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <ul className="space-y-2.5 text-[15px] leading-relaxed text-runtime-ink-soft">
              {INCLUDED.map((li) => (
                <li key={li} className="flex items-start gap-3">
                  <span aria-hidden className="mt-[0.65em] h-px w-4 shrink-0" style={{ background: "var(--color-signal-2)" }} />
                  {li}
                </li>
              ))}
            </ul>
            <div>
              <p className="tech-label text-[0.68rem] text-runtime-ink-soft">[ условия работы ]</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {TERMS.map((t) => (
                  <span key={t} className="tech-label rounded-full border border-runtime-line px-4 py-2 text-[11px] text-runtime-ink-soft">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-[13.5px] leading-relaxed text-runtime-ink-soft">
                Итоговая смета = масштаб × проектные часы. Считается по составу работ и
                фиксируется в договоре до старта — без «финализаций» отдельной строкой потом.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- 06 работы ---------- */}
        <section id="works" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 06 · работы ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Живые проекты — можно кликнуть и посмотреть
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WORKS.map((w) => (
              <a key={w.url} href={w.url} target="_blank" rel="noreferrer" className="group block">
                <figure
                  className="overflow-hidden rounded-[14px] border border-runtime-line transition-colors group-hover:border-[color-mix(in_srgb,var(--color-signal)_60%,transparent)]"
                  style={{ background: "rgba(23,16,41,0.4)" }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={w.img}
                      alt={w.name}
                      fill
                      sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 100vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="flex items-center justify-between px-4 py-3">
                    <span className="tech-label text-[11px] text-runtime-ink-soft">{w.name}</span>
                    <span className="text-runtime-ink-soft transition-transform group-hover:translate-x-1">→</span>
                  </figcaption>
                </figure>
              </a>
            ))}
          </div>
          <p className="mt-5 text-[13.5px] text-runtime-ink-soft">
            Подробный разбор флагманского проекта —{" "}
            <Link href="/cases/ximichka" className="underline decoration-dotted underline-offset-4" style={{ color: "var(--color-signal-cool)" }}>
              кейс «Химичка»: два года от идеи до экосистемы
            </Link>
            .
          </p>
        </section>

        {/* ---------- 07 next ---------- */}
        <section id="next" className="scroll-mt-28 pt-16">
          <div
            className="signal-glow relative overflow-hidden p-8 sm:p-10"
            style={{
              ...CHIP,
              border: "1px solid rgba(151,71,255,0.35)",
              background:
                "radial-gradient(120% 140% at 88% 0%, rgba(151,71,255,0.16), transparent 60%), rgba(23,16,41,0.6)",
            }}
          >
            <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
              [ 07 · следующий шаг ]
            </p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.4rem,2.8vw,2rem)] font-semibold leading-tight tracking-tight">
              Выбираем вариант — фиксирую смету и дату запуска
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-runtime-ink-soft">
              Напишите в Telegram «MARTOX» — вернусь со сметой по выбранному варианту и планом
              в течение 24 часов. Вопросы по структуре и рекомендациям — обсудим голосом или
              в переписке, как удобнее.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <GoalLink
                goal="tg_click"
                goalParams={{ source: "kp_martox" }}
                href={legal.telegram}
                target="_blank"
                rel="noreferrer"
                className="btn-case inline-flex h-12 items-center px-8 text-sm font-semibold"
              >
                Написать в Telegram →
              </GoalLink>
              <a
                href={`tel:${legal.phoneHref}`}
                className="inline-flex h-12 items-center rounded-full border border-runtime-line px-7 text-sm text-runtime-ink transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_60%,transparent)]"
              >
                {legal.phone}
              </a>
            </div>
            <p className="hud mt-5 text-[9px] text-runtime-ink-soft/60">
              // кп подготовлено 24.07.2026 · aics-93 · василий аистов
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
