import Link from "next/link";

/* PricingBlock — публичные цены и условия работы. Главный ход отстройки:
   ни один топ рынка не показывает цену и срок на первом касании (COMPETITORS.md
   §1.5/§1.6). Формула карточки — Repina+Depot: цена «от» → состав → срок →
   от чего растёт смета. Серверный компонент, тёмная runtime-секция. */

export type PricingProduct = {
  tag: string;
  title: string;
  price: string;
  term: string;
  items: string[];
  href: string;
};

export type PricingBlockDict = {
  eyebrow: string;
  titlePre: string;
  titleAccent: string;
  titlePost: string;
  subhead: string;
  products: PricingProduct[];
  detailsLink: string;
  terms: string[];
  cta: string;
};

const PRODUCTS: PricingProduct[] = [
  {
    tag: "продукт 01",
    title: "Корпоративный сайт",
    price: "от 1 500 $",
    term: "7–14 дней",
    items: [
      "исследование конкурентов и ЦА, стратегия",
      "дизайн-концепция и дизайн-система",
      "сборка на React / Next.js, бэк — TS / Python",
      "интеграции, E2E-тесты, публикация MVP",
      "передача харнесса и инструкций + месяц поддержки",
    ],
    href: "/services/razrabotka-sajtov",
  },
  {
    tag: "продукт 02",
    title: "Фирменный стиль / айдентика",
    price: "1 500 $",
    term: "10–14 дней",
    items: [
      "распаковка смыслов и аудит текущих решений",
      "дизайн-концепция — вручную, мной",
      "оцифровка системы: лого, цвета, шрифты, компоненты",
      "ключевые визуалы, векторная графика, анимация",
      "брендбук и дизайн-система, живущая в коде",
    ],
    href: "/services/firmennyj-stil",
  },
  {
    tag: "продукт 03",
    title: "Оцифровка и автоматизация процессов",
    price: "от 2 000 $",
    term: "от 14 дней",
    items: [
      "аудит процессов и карта автоматизации",
      "харнесс-система и субагенты под ваши роли",
      "интеграции с CRM и сервисами, дашборды",
      "northstar-документ стратегии и BI-основа",
      "обучение команды и дубликация харнесса у вас",
    ],
    href: "/services/integraciya-ii",
  },
];

const TERMS = [
  "оплата 50 / 50",
  "в белую: договор и расчётный счёт",
  "материальная ответственность за сроки",
  "показатели эффективности — в договоре",
];

const CHIP: React.CSSProperties = {
  clipPath:
    "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
};

const RU_PRICING: PricingBlockDict = {
  eyebrow: "[ пакеты · цены и условия ]",
  titlePre: "Цены — ",
  titleAccent: "до брифа",
  titlePost: ", а не после",
  subhead:
    "Итоговая смета зависит от масштаба и количества проектных часов — считаю её по составу работ и фиксирую в договоре до старта. Базовые ставки открыты:",
  products: PRODUCTS,
  detailsLink: "состав подробно →",
  terms: TERMS,
  cta: "Рассчитать смету",
};

export default function PricingBlock({ dict }: { dict?: Partial<PricingBlockDict> } = {}) {
  const D: PricingBlockDict = { ...RU_PRICING, ...dict };
  return (
    <section id="pricing" className="runtime relative scroll-mt-24 overflow-hidden py-[50px] lg:py-[80px]">
      <div className="runtime-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="signal-seam absolute inset-x-0 top-0" aria-hidden />

      <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="tech-label text-[11px] text-[color-mix(in_srgb,var(--color-signal)_80%,white)]">
            {D.eyebrow}
          </p>
          <h2 className="mt-4 text-[clamp(1.7rem,3.4vw,2.7rem)] font-medium leading-[1.06] tracking-[-0.02em] text-runtime-ink">
            {D.titlePre}<span className="signal-text">{D.titleAccent}</span>{D.titlePost}
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-runtime-ink-soft">
            {D.subhead}
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {D.products.map((p) => (
            <article
              key={p.title}
              className="flex h-full flex-col p-6 sm:p-7"
              style={{
                ...CHIP,
                border: "1px solid var(--color-runtime-line)",
                background: "linear-gradient(180deg, rgba(23,16,41,0.65), rgba(14,10,27,0.35))",
              }}
            >
              <p className="tech-label text-[10px] text-runtime-ink-soft">{p.tag}</p>
              <h3 className="mt-2 text-[1.15rem] font-semibold leading-snug text-runtime-ink">
                {p.title}
              </h3>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-display text-[1.7rem] leading-none tracking-tight text-runtime-ink">
                  {p.price}
                </span>
                <span className="tech-label text-[11px]" style={{ color: "var(--color-signal-cool)" }}>
                  {p.term}
                </span>
              </div>
              <ul className="mt-5 space-y-2">
                {p.items.map((it) => (
                  <li key={it} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-runtime-ink-soft">
                    <span
                      aria-hidden
                      className="mt-[0.62em] h-px w-3.5 shrink-0"
                      style={{ background: "var(--color-signal-2)" }}
                    />
                    {it}
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className="tech-label mt-auto inline-flex w-fit items-center gap-1 pt-5 text-[11px] transition-colors"
                style={{ color: "var(--color-signal-cool)" }}
              >
                {D.detailsLink}
              </Link>
            </article>
          ))}
        </div>

        {/* условия работы */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          {D.terms.map((t) => (
            <span
              key={t}
              className="tech-label rounded-full border border-runtime-line px-4 py-2 text-[11px] text-runtime-ink-soft"
            >
              {t}
            </span>
          ))}
          <a
            href="#upgrade"
            data-magnetic
            data-cursor="route signal"
            className="btn-case ml-auto inline-flex h-11 items-center px-7 text-sm font-semibold"
          >
            {D.cta} <span aria-hidden className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
