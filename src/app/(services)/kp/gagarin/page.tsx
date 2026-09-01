import type { Metadata } from "next";
import QuizInline from "@/components/QuizInline";
import RevenueBar, { type RevenueSegment } from "@/components/kp/RevenueBar";
import { kpDecisionSteps } from "@/lib/quiz";

/* КП для школы «Гагарин» — учебная платформа на стеке learn.ximi4ka.ru
   (noindex, вне sitemap). Аудитория — преподавательницы гуманитарных наук,
   поэтому осознанные отступления от обычного тона КП: никакого технического
   словаря (нет «базы данных», «развёртывания», «LMS», «SEO») и body 16.5px
   вместо 15px ради читаемости длинных объяснений. Финал — не «напишите в
   телеграм», а квиз-решение: ответы уходят Тихоном в общий поток заявок. */

export const metadata: Metadata = {
  title: "КП для школы «Гагарин» — своя учебная платформа",
  description:
    "Коммерческое предложение AICS-93: учебная платформа для школы русского и английского языка «Гагарин» — механики, педагогический смысл, доходная часть и окупаемость.",
  robots: { index: false, follow: false },
};

const CHIP: React.CSSProperties = {
  clipPath:
    "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
};

const TOC = [
  { id: "what", num: "01", label: "что это такое" },
  { id: "features", num: "02", label: "что умеет платформа" },
  { id: "pedagogy", num: "03", label: "зачем это педагогически" },
  { id: "own", num: "04", label: "своя или аренда" },
  { id: "revenue", num: "05", label: "сколько может приносить" },
  { id: "payback", num: "06", label: "когда окупится" },
  { id: "price", num: "07", label: "стоимость и оплата" },
  { id: "plan", num: "08", label: "как пойдёт работа" },
  { id: "need", num: "09", label: "что нужно от школы" },
];

const FEATURES: { title: string; text: string }[] = [
  {
    title: "Курсы и видеоуроки",
    text: "Материал разбит на курсы и уроки: видео, тексты, картинки. Две линейки — русский и английский. Добавлять уроки может любой преподаватель, программист для этого не нужен.",
  },
  {
    title: "Домашка, которая проверяет себя сама",
    text: "Тесты, задания «соедини пары», «расставь по порядку», ввод ответа словом. Платформа сразу говорит ученику, верно или нет, — вам не нужно проверять это вручную.",
  },
  {
    title: "Очки, награды и рейтинг",
    text: "За каждое задание ученик получает очки. Есть награды за успехи и общий рейтинг школы. Для детей это игра, в которой не хочется отставать от одноклассников.",
  },
  {
    title: "Личный кабинет ученика",
    text: "Что пройдено, что впереди, сколько очков набрано. Прогресс виден и ребёнку, и вам, и родителям.",
  },
  {
    title: "Вход по ссылке, без паролей",
    text: "Ученик получает свою ссылку — нажал и сразу внутри. Никаких «я забыл пароль» и звонков администратору.",
  },
  {
    title: "Кабинет школы",
    text: "Одно место, где вы управляете всем: учениками, курсами, доступами. Плюс раздел со статьями — они помогают школе находиться в Яндексе и Google и приводят новых учеников.",
  },
  {
    title: "Оплата картой на сайте",
    text: "Ученик из другого города может сам оплатить доступ картой. Деньги приходят сразу на счёт школы.",
  },
  {
    title: "Связь через Telegram",
    text: "Ученик привязывает свой Telegram — и школа напоминает о занятиях и домашке там, где дети и так сидят.",
  },
];

const PEDAGOGY: { lead: string; text: string }[] = [
  {
    lead: "Язык учится регулярностью, а не длительностью",
    text: "Пятнадцать минут практики каждый день дают больше, чем два часа раз в неделю. Занятие в школе бывает 1–2 раза в неделю — платформа удерживает ученика в языке все остальные дни.",
  },
  {
    lead: "Главная беда домашки — её не делают",
    text: "Очки, награды и рейтинг дают ребёнку ту самую мотивацию, которой не хватает. Ученик заходит «добить очки» — и незаметно для себя повторяет материал.",
  },
  {
    lead: "Ошибка видна сразу",
    text: "Не через неделю на следующем занятии, когда всё уже забылось, а в ту же секунду. Так материал закрепляется намного быстрее.",
  },
  {
    lead: "Преподаватель занимается преподаванием",
    text: "Тесты и упражнения платформа проверяет сама. Время учителя уходит на то, что машине не доверишь: речь, разбор, живое занятие.",
  },
  {
    lead: "Родитель видит, за что платит",
    text: "Не абстрактные слова на собрании, а конкретные пройденные уроки и очки ребёнка. Семье, которая видит результат, гораздо труднее бросить школу.",
  },
  {
    lead: "Каждый идёт в своём темпе",
    text: "Сильные ученики уходят вперёд и не скучают, а тем, кому нужно время, платформа даёт спокойно повторять.",
  },
];

const COMPARE: { row: string; own: string; rent: string }[] = [
  { row: "Платёж", own: "80 000 ₽ один раз", rent: "от 5 000–30 000 ₽ каждый месяц, всегда" },
  { row: "Имя", own: "Только ваше: адрес, логотип, оформление", rent: "Чужой сервис, ваш логотип сверху" },
  { row: "Плата за учеников", own: "Нет — хоть 30, хоть 3000", rent: "Чем больше учеников, тем дороже тариф" },
  {
    row: "Курсы и данные",
    own: "Ваши. Всё, что вы наполнили, принадлежит школе",
    rent: "Живут у сервиса; уйти оттуда — большая боль",
  },
  {
    row: "Очки и рейтинг",
    own: "Встроены и проверены на настоящих школьниках",
    rent: "Обычно нет или за доплату",
  },
];

const SEGMENTS: RevenueSegment[] = [
  {
    label: "Надбавка к абонементу",
    amount: 20_000,
    color: "var(--color-signal)",
    ink: "#ffffff",
    note: "40 учеников платят на 500 ₽ в месяц больше за доступ к платформе. Для родителей это понятная ценность: ребёнок занимается и между уроками.",
  },
  {
    label: "Онлайн-ученики",
    amount: 20_000,
    color: "#5fd9f5",
    ink: "#0b1e33",
    note: "10 учеников из других районов и городов платят по 2 000 ₽ в месяц. Аудитория не нужна, расписание не нужно — уроки уже записаны.",
  },
  {
    label: "Интенсивы и марафоны",
    amount: 10_000,
    color: "#c5ff44",
    ink: "#302055",
    note: "Летние онлайн-курсы и марафоны перед экзаменами. Школа зарабатывает даже в мёртвый сезон, когда аудитории пустуют.",
  },
  {
    label: "Удержание учеников",
    amount: 9_000,
    color: "var(--color-signal-cool)",
    ink: "#302055",
    note: "Ребёнок, который копит очки и стоит в рейтинге, реже бросает школу. Всего два не ушедших ученика — это 9 000 ₽ выручки, которая не исчезла.",
  },
];

const PAYBACK: { when: string; month: string; back: string }[] = [
  { when: "…только надбавка к абонементу", month: "20 000 ₽", back: "4 месяца" },
  { when: "…только онлайн-ученики", month: "20 000 ₽", back: "4 месяца" },
  { when: "…только удержание", month: "9 000 ₽", back: "9 месяцев" },
  { when: "…надбавка и онлайн вместе", month: "40 000 ₽", back: "2 месяца" },
];

const STAGES: { title: string; dur: string; text: string }[] = [
  {
    title: "Запускаем вашу копию",
    dur: "3–5 дней",
    text: "Платформа открывается на вашем адресе. Убираем всё, что относилось к химии, — остаётся чистая учебная основа.",
  },
  {
    title: "Настраиваем под языки",
    dur: "4–6 дней",
    text: "Приспосабливаем упражнения под русский и английский: проверку письменных ответов, языковые типы заданий. Настраиваем выдачу доступов ученикам.",
  },
  {
    title: "Оформляем в стиле «Гагарина»",
    dur: "3–4 дня",
    text: "Логотип, цвета, тексты — платформа выглядит как продукт школы, а не как чужой сервис. Плюс красивая главная страница для новых учеников.",
  },
  {
    title: "Подключаем оплату и обучаем",
    dur: "3–5 дней",
    text: "Настраиваем приём оплаты картой на счёт школы. Проводим созвон с командой: как добавлять курсы и учеников, как смотреть прогресс. Передаём все доступы и простую инструкцию.",
  },
];

const NEED = [
  "Логотип и фирменные цвета. Если их нет — предложим варианты.",
  "Адрес сайта. Если у школы уже есть сайт, платформа станет его частью — например, learn.ваш-сайт.ru.",
  "Данные для приёма оплаты картой: подключим ЮKassa или похожий сервис на счёт школы.",
  "Курсы и видео вы добавляете сами — на обучающем созвоне покажем, как. Это сделано специально: наполнять платформу сможет любой преподаватель, без программиста и без нас.",
];

/* эмблема школы: орбита + звезда. Набросок в фирменной палитре —
   если школа пришлёт свой логотип, меняем на него. */
function GagarinMark() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden className="shrink-0">
      <circle cx="28" cy="28" r="25" fill="none" stroke="var(--color-signal-2)" strokeWidth="1.5" />
      <path
        d="M 10 41 A 27 27 0 0 1 43 11"
        fill="none"
        stroke="var(--color-signal-cool)"
        strokeWidth="1.5"
        strokeDasharray="3 5"
        opacity="0.75"
      />
      <path
        d="M28 13 L31.4 24.6 L43 28 L31.4 31.4 L28 43 L24.6 31.4 L13 28 L24.6 24.6 Z"
        fill="var(--color-signal)"
      />
      <circle cx="43" cy="11" r="2.8" fill="#5fd9f5" />
    </svg>
  );
}

export default function KpGagarinPage() {
  return (
    <div className="text-runtime-ink">
      {/* ---------- hero ---------- */}
      <div className="relative overflow-hidden">
        <div className="runtime-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-20 sm:px-8 sm:pt-28">
          <span
            className="tech-label inline-flex items-center gap-2 text-[0.72rem]"
            style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
          >
            <span className="hud-dot" style={{ display: "inline-block" }} />
            коммерческое предложение · aics-93 → школа «гагарин»
          </span>

          <div className="mt-7 flex items-center gap-4">
            <GagarinMark />
            <div>
              <p className="font-display text-[20px] font-semibold tracking-[0.06em] text-runtime-ink">
                ГАГАРИН
              </p>
              <p className="tech-label text-[11.5px] text-runtime-ink-soft">
                школа русского и английского языка
              </p>
            </div>
          </div>

          <h1 className="mt-8 max-w-3xl text-[clamp(2rem,4.6vw,3.3rem)] font-semibold leading-[1.05] tracking-tight">
            Своя учебная платформа для школы <span className="signal-text">«Гагарин»</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[1.07rem] leading-relaxed text-runtime-ink-soft">
            Сайт, где ваши ученики смотрят уроки, делают интерактивную домашку и соревнуются за
            очки — под вашим именем и в вашей полной собственности. Один раз сделали — и он
            работает на школу годами.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {["80 000 ₽ — можно частями", "2–3 недели", "френдли-прайс", "1 сентября 2026"].map((c) => (
              <span
                key={c}
                className="tech-label rounded-full border border-runtime-line bg-black/30 px-3.5 py-1.5 text-[11px] text-runtime-ink-soft"
              >
                {c}
              </span>
            ))}
          </div>

          {/* содержание */}
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
        {/* ---------- 01 что это ---------- */}
        <section id="what" className="scroll-mt-28 pt-14">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 01 · что это такое ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Такая же платформа, как та, что вам понравилась — только ваша и про языки
          </h2>
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.15fr_1fr]">
            <div className="space-y-4 text-[16.5px] leading-relaxed text-runtime-ink-soft">
              <p>
                Вы видели платформу <span className="text-runtime-ink">learn.ximi4ka.ru</span> — на
                ней каждый день занимаются школьники, которые готовятся к экзамену по химии. Это не
                макет и не картинка, а живой, проверенный на настоящих учениках продукт.
              </p>
              <p>
                Предложение простое: мы делаем{" "}
                <span className="text-runtime-ink">такую же платформу для «Гагарина»</span> — со
                своим адресом в интернете, в вашем оформлении и с вашими предметами: русским и
                английским. Наполнять её курсами вы сможете сами, без программистов — это так же
                просто, как написать документ в Google Docs.
              </p>
              <p>
                Главное отличие от готовых сервисов «в аренду»:{" "}
                <span className="text-runtime-ink">платформа принадлежит вам</span>. Никаких
                ежемесячных платежей за пользование и никаких доплат за количество учеников.
              </p>
            </div>
            <div
              className="p-5 sm:p-6"
              style={{ ...CHIP, border: "1px solid var(--color-runtime-line)", background: "rgba(23,16,41,0.4)" }}
            >
              <p className="tech-label text-[0.68rem]" style={{ color: "var(--color-signal-2)" }}>
                [ откуда берётся скорость ]
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-runtime-ink-soft">
                Обычно такую платформу делают с нуля полгода. Здесь основа{" "}
                <span className="text-runtime-ink">уже построена и обкатана</span> — курсы, домашка,
                очки, кабинеты, оплата. Мы не изобретаем механику заново, а приспосабливаем готовую
                под русский и английский язык.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-runtime-ink-soft">
                Поэтому и срок — недели вместо месяцев, и цена — в разы ниже разработки с нуля.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- 02 что умеет ---------- */}
        <section id="features" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 02 · что умеет платформа ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Восемь механик, которые уже работают
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-5 sm:p-6"
                style={{
                  borderRadius: "20px",
                  border: "1px solid var(--color-runtime-line)",
                  background: "rgba(23,16,41,0.4)",
                }}
              >
                <h3 className="text-[17px] font-semibold leading-snug text-runtime-ink">{f.title}</h3>
                <p className="mt-2.5 text-[15.5px] leading-relaxed text-runtime-ink-soft">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 03 педагогика ---------- */}
        <section id="pedagogy" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 03 · зачем это педагогически ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Платформа не заменяет преподавателя. Она забирает то, что мешает преподавать
          </h2>
          <div className="mt-8 grid gap-x-10 gap-y-6 lg:grid-cols-2">
            {PEDAGOGY.map((p) => (
              <div key={p.lead} className="border-l-2 pl-5" style={{ borderColor: "var(--color-signal)" }}>
                <p className="text-[16.5px] font-semibold leading-snug text-runtime-ink">{p.lead}</p>
                <p className="mt-2 text-[15.5px] leading-relaxed text-runtime-ink-soft">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 04 своя или аренда ---------- */}
        <section id="own" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 04 · своя или аренда ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Почему своя платформа, а не готовый сервис за подписку
          </h2>
          <div
            className="mt-8 overflow-x-auto"
            style={{
              borderRadius: "20px",
              border: "1px solid var(--color-runtime-line)",
              background: "rgba(23,16,41,0.4)",
            }}
          >
            <table className="w-full min-w-[640px] border-collapse text-[15.5px]">
              <thead>
                <tr>
                  <th className="w-[150px] border-b border-runtime-line px-5 py-4 text-left" />
                  <th className="border-b border-runtime-line px-5 py-4 text-left">
                    <span className="tech-label text-[11.5px]" style={{ color: "var(--color-signal-2)" }}>
                      своя платформа · это предложение
                    </span>
                  </th>
                  <th className="border-b border-runtime-line px-5 py-4 text-left">
                    <span className="tech-label text-[11.5px] text-runtime-ink-soft">
                      аренда готового сервиса
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((c) => (
                  <tr key={c.row}>
                    <td className="border-b border-runtime-line px-5 py-4 align-top text-runtime-ink-soft">
                      {c.row}
                    </td>
                    <td className="border-b border-runtime-line px-5 py-4 align-top text-runtime-ink">
                      {c.own}
                    </td>
                    <td className="border-b border-runtime-line px-5 py-4 align-top text-runtime-ink-soft">
                      {c.rent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-3xl text-[15.5px] leading-relaxed text-runtime-ink-soft">
            Единственный постоянный расход — техническое обслуживание сайта:{" "}
            <span className="text-runtime-ink">примерно 0–2 000 ₽ в месяц</span>, и эти деньги идут
            напрямую техническим сервисам, без нашей наценки. Пока учеников немного, это чаще всего
            вообще бесплатно.
          </p>
        </section>

        {/* ---------- 05 доходная часть ---------- */}
        <section id="revenue" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 05 · сколько может приносить ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Платформа — не расход, а новый продукт школы
          </h2>
          <p className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-runtime-ink-soft">
            Вот из чего складывается её месячный доход. Цифры нарочно скромные — подставьте свои.
          </p>
          <div className="mt-8">
            <RevenueBar
              segments={SEGMENTS}
              caption="Это четыре независимых источника: любой из них работает сам по себе, а вместе они складываются в общую сумму. Начать можно с одного — например, только с надбавки к абонементу."
            />
          </div>
        </section>

        {/* ---------- 06 окупаемость ---------- */}
        <section id="payback" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 06 · когда окупится ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Даже если сработает только один источник
          </h2>
          <div
            className="mt-8 overflow-x-auto"
            style={{
              borderRadius: "20px",
              border: "1px solid var(--color-runtime-line)",
              background: "rgba(23,16,41,0.4)",
            }}
          >
            <table className="w-full min-w-[560px] border-collapse text-[15.5px]">
              <thead>
                <tr>
                  <th className="border-b border-runtime-line px-5 py-4 text-left">
                    <span className="tech-label text-[11.5px] text-runtime-ink-soft">если работает…</span>
                  </th>
                  <th className="border-b border-runtime-line px-5 py-4 text-left">
                    <span className="tech-label text-[11.5px] text-runtime-ink-soft">доход в месяц</span>
                  </th>
                  <th className="border-b border-runtime-line px-5 py-4 text-left">
                    <span className="tech-label text-[11.5px] text-runtime-ink-soft">80 000 ₽ вернутся через</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {PAYBACK.map((p) => (
                  <tr key={p.when}>
                    <td className="border-b border-runtime-line px-5 py-4 align-top text-runtime-ink-soft">
                      {p.when}
                    </td>
                    <td className="font-display border-b border-runtime-line px-5 py-4 align-top font-semibold text-runtime-ink">
                      {p.month}
                    </td>
                    <td
                      className="font-display border-b border-runtime-line px-5 py-4 align-top font-semibold"
                      style={{ color: "#5fd9f5" }}
                    >
                      {p.back}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-3xl text-[15.5px] leading-relaxed text-runtime-ink-soft">
            Даже самый скромный вариант возвращает вложение в пределах учебного года. А платформа
            остаётся у школы навсегда и продолжает приносить деньги без новых вложений.
          </p>
        </section>

        {/* ---------- 07 цена ---------- */}
        <section id="price" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 07 · стоимость и оплата ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            80 000 ₽ — окончательная цена, без скрытых доплат
          </h2>

          <div
            className="mt-8 p-6 sm:p-8"
            style={{
              borderRadius: "25px 55px 55px 5px",
              border: "1px solid rgba(151,71,255,0.35)",
              background:
                "radial-gradient(120% 140% at 88% 0%, rgba(151,71,255,0.16), transparent 60%), rgba(23,16,41,0.6)",
            }}
          >
            <p className="font-display text-[clamp(2.2rem,6vw,3.4rem)] font-semibold leading-none text-runtime-ink">
              80 000 ₽
            </p>
            <p className="mt-5 max-w-2xl text-[16.5px] leading-relaxed text-runtime-ink-soft">
              Это дружеская цена. Разработка такой платформы с нуля стоит на рынке{" "}
              <span className="text-runtime-ink">400–800 тысяч рублей</span>, а аренда похожего
              сервиса — <span className="text-runtime-ink">60–120 тысяч в год, каждый год</span>.
              Здесь основа уже построена и проверена в работе — вы платите только за то, чтобы
              приспособить её под вашу школу.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div
              className="p-6"
              style={{
                borderRadius: "20px",
                border: "1px solid rgba(151,71,255,0.45)",
                background: "rgba(23,16,41,0.5)",
              }}
            >
              <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
                [ вариант 1 ]
              </p>
              <h3 className="mt-3 text-[18px] font-semibold text-runtime-ink">
                Два платежа по 40 000 ₽
              </h3>
              <ul className="mt-4 space-y-2.5 text-[15.5px] leading-relaxed text-runtime-ink-soft">
                <li>
                  <span className="font-display font-semibold text-runtime-ink">40 000 ₽</span> — когда
                  начинаем работу
                </li>
                <li>
                  <span className="font-display font-semibold text-runtime-ink">40 000 ₽</span> — когда
                  сдаём готовую платформу
                </li>
              </ul>
            </div>
            <div
              className="p-6"
              style={{
                borderRadius: "20px",
                border: "1px solid var(--color-runtime-line)",
                background: "rgba(23,16,41,0.4)",
              }}
            >
              <p className="tech-label text-[11px] text-runtime-ink-soft">[ вариант 2 ]</p>
              <h3 className="mt-3 text-[18px] font-semibold text-runtime-ink">
                Четыре платежа по 20 000 ₽
              </h3>
              <ul className="mt-4 space-y-2.5 text-[15.5px] leading-relaxed text-runtime-ink-soft">
                <li>
                  <span className="font-display font-semibold text-runtime-ink">20 000 ₽</span> — когда
                  начинаем работу
                </li>
                <li>
                  <span className="font-display font-semibold text-runtime-ink">20 000 ₽</span> —
                  платформа открылась на вашем адресе
                </li>
                <li>
                  <span className="font-display font-semibold text-runtime-ink">20 000 ₽</span> —
                  упражнения и оформление «Гагарина» готовы
                </li>
                <li>
                  <span className="font-display font-semibold text-runtime-ink">20 000 ₽</span> —
                  сдача: оплата картой работает, команда обучена
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- 08 план ---------- */}
        <section id="plan" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 08 · как пойдёт работа ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Четыре шага, 2–3 недели
          </h2>
          <div className="mt-8">
            {STAGES.map((s, i) => (
              <div
                key={s.title}
                className="grid grid-cols-[46px_1fr] gap-5 border-b border-runtime-line py-6 last:border-b-0"
              >
                <span
                  className="font-display grid size-[38px] place-items-center rounded-[3px] text-[14px] font-semibold"
                  style={
                    i < 2
                      ? { background: "var(--color-signal)", color: "#ffffff" }
                      : { background: "#5fd9f5", color: "#302055" }
                  }
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-[17.5px] font-semibold text-runtime-ink">{s.title}</h3>
                    <span className="tech-label text-[12px]" style={{ color: "#5fd9f5" }}>
                      · {s.dur}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-[15.5px] leading-relaxed text-runtime-ink-soft">
                    {s.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 09 что нужно от школы ---------- */}
        <section id="need" className="scroll-mt-28 pt-16">
          <p className="tech-label text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            [ 09 · что нужно от школы ]
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
            Четыре вещи — и мы стартуем
          </h2>
          <ul className="mt-8 grid max-w-3xl gap-4">
            {NEED.map((n) => (
              <li key={n} className="grid grid-cols-[20px_1fr] gap-4">
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className="mt-[3px]">
                  <path
                    d="M4 10.5l4 4 8-9"
                    fill="none"
                    stroke="#5fd9f5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[16px] leading-relaxed text-runtime-ink-soft">{n}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ---------- квиз вместо формы: ответы уходят Тихоном ---------- */}
      <QuizInline
        source="kp_gagarin"
        title="Ответьте на четыре вопроса — и я подготовлю договор"
        text="Вместо переписки: выберите вариант оплаты и срок, задайте свои вопросы. Ответы придут мне сразу, вернусь с договором и планом в тот же день."
        steps={kpDecisionSteps({
          choice: {
            key: "вариант оплаты",
            title: "Какой вариант оплаты удобнее?",
            options: ["два платежа по 40 000 ₽", "четыре платежа по 20 000 ₽"],
          },
          extra: [
            {
              kind: "multi",
              key: "предметы на старте",
              title: "С каких предметов начнём наполнение?",
              options: ["русский язык", "английский язык", "оба сразу", "подготовка к ОГЭ / ЕГЭ"],
            },
            {
              kind: "single",
              key: "оплата учеников",
              title: "Как ученики будут получать доступ?",
              options: [
                "школа выдаёт доступы сама",
                "ученики платят онлайн на сайте",
                "и то, и другое",
                "пока не решили",
              ],
            },
          ],
        })}
      />
    </div>
  );
}
