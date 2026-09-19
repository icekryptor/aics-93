import type { Metadata } from "next";
import SvoySaytCalc from "@/components/SvoySaytCalc";
import { SITE_URL } from "@/lib/site";

/* /svoy-sayt — публичная страница под рассылку и посевы: три причины уходить
   с конструктора на собственный код, дальше запрос цифр и расчёт прироста
   заявок. Индексируется, в отличие от раздела /kp. */

export const metadata: Metadata = {
  title: "Свой сайт вместо конструктора — три причины и расчёт",
  description:
    "Скорость, владение и возраст дизайна: почему сайт на конструкторе упирается в потолок. Расчёт прироста заявок по вашим цифрам.",
  alternates: { canonical: `${SITE_URL}/svoy-sayt` },
  openGraph: {
    title: "Свой сайт вместо конструктора",
    description: "Три причины и расчёт прироста заявок по вашим цифрам.",
    url: `${SITE_URL}/svoy-sayt`,
    type: "article",
  },
};

type Reason = {
  n: string;
  title: string;
  lead: string;
  facts: string[];
  source?: { text: string; href: string }[];
};

const REASONS: Reason[] = [
  {
    n: "01",
    title: "Скорость",
    lead:
      "Конструктор грузит на каждую страницу общий движок платформы. Страница ждёт чужой код, а не свой.",
    facts: [
      "INP — задержка между нажатием и реакцией интерфейса. Порог Google — 200 мс. На сайтах, собранных конструктором, типично 500–1200 мс: главный поток занят разбором общего бандла.",
      "Конверсия при хорошем INP — 2.5%, при плохом — 2.0%. Выборка 997 сайтов за три месяца.",
      "Каждая лишняя секунда загрузки снижает конверсию примерно на 7%.",
      "На собственном коде страница тянет только то, что ей нужно: критический CSS инлайном, скрипты по требованию, изображения в WebP нужного размера.",
    ],
    source: [
      { text: "Contentsquare — INP и конверсия", href: "https://contentsquare.com/blog/interaction-to-next-paint/" },
      { text: "Akamai — скорость и заказы", href: "https://edmondscommerce.co.uk/research/performance/load-time-impact/" },
    ],
  },
  {
    n: "02",
    title: "Владение",
    lead:
      "Подписка — не главная статья. За три года это порядка 36 000 ₽, и на этом сэкономить не получится.",
    facts: [
      "Исходники, вёрстка и накопленный контент лежат в аккаунте сервиса. Выгрузить можно не всё и не всегда.",
      "Тарифы, лимиты и правила меняются без вашего участия. Решение об уходе платформы с рынка тоже принимается без вас.",
      "Предельная скорость, логика форм и набор интеграций ограничены тем, что разрешает платформа.",
      "На своём коде репозиторий и доступы принадлежат вам: подрядчика можно сменить, не переделывая сайт заново.",
    ],
  },
  {
    n: "03",
    title: "Возраст дизайна",
    lead: "Средний цикл жизни интерфейса — около трёх лет. Это не мода, а смена среды.",
    facts: [
      "Меняются разрешения и пропорции экранов: макет 2022 года на телефоне 2026-го ведёт себя не так, как задумывалось.",
      "Меняются браузерные стандарты и то, что считается нормой взаимодействия.",
      "Меняется сам бизнес: услуги, цены и приоритеты уезжают вперёд, а структура сайта остаётся прежней.",
      "Дату последнего обновления вёрстки можно проверить по веб-архиву — она обычно старше, чем кажется.",
    ],
  },
];

export default function SvoySaytPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-28 pt-16 sm:px-8 sm:pt-24">
      <span
        className="tech-label inline-flex items-center gap-2 text-[0.72rem]"
        style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
      >
        <span className="hud-dot" style={{ display: "inline-block" }} />
        разбор
      </span>

      <h1 className="mt-6 text-[clamp(1.9rem,4.4vw,2.8rem)] font-semibold leading-[1.12] tracking-tight text-runtime-ink">
        Свой сайт вместо <span className="signal-text">конструктора</span>
      </h1>
      <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-runtime-ink-soft">
        Конструктор — нормальный способ быстро выйти в сеть. Проблемы начинаются
        позже и всегда в одних и тех же трёх местах.
      </p>

      <div className="mt-14 space-y-14">
        {REASONS.map((r) => (
          <section key={r.n} className="border-t border-runtime-line pt-8">
            <span className="tech-label text-[11px] text-runtime-ink-soft">{r.n}</span>
            <h2 className="mt-2 text-[23px] font-semibold tracking-tight text-runtime-ink">{r.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-runtime-ink">{r.lead}</p>
            <ul className="mt-4 space-y-2.5">
              {r.facts.map((f) => (
                <li key={f} className="flex gap-3 text-[15px] leading-relaxed text-runtime-ink-soft">
                  <span
                    aria-hidden
                    className="mt-[0.6em] size-[5px] shrink-0 rounded-full"
                    style={{ background: "var(--color-signal)" }}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {r.source && (
              <p className="mt-4 text-[12px] text-runtime-ink-soft">
                Источники:{" "}
                {r.source.map((s, i) => (
                  <span key={s.href}>
                    {i > 0 && " · "}
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 transition-colors hover:text-runtime-ink"
                    >
                      {s.text}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </section>
        ))}
      </div>

      <section id="calc" className="mt-16 border-t border-runtime-line pt-10">
        <h2 className="text-[23px] font-semibold tracking-tight text-runtime-ink">
          Сколько это стоит именно вам
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-runtime-ink-soft">
          Первые две причины общие, а цена у каждого своя. Дайте две цифры из Метрики —
          посчитаю прирост заявок от одной только скорости.
        </p>
        <div className="mt-6">
          <SvoySaytCalc source="svoy_sayt" />
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-runtime-line bg-[rgba(255,255,255,0.02)] p-6 sm:p-8">
        <h2 className="text-[20px] font-semibold tracking-tight text-runtime-ink">
          Перенос и переработка дизайна — 120 000 ₽
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-runtime-ink-soft">
          Срок — 3 рабочих дня с момента получения доступов и утверждения структуры.
          Действующий сайт работает до переключения. В стоимость входит обучение
          маркетолога править контент через ИИ: без вёрстки и без обращения к разработчику.
        </p>
      </section>
    </div>
  );
}
