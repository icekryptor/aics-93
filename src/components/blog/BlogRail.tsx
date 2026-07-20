import GoalLink from "@/components/system/GoalLink";
import { legal } from "@/lib/content";

/* BlogRail — правая колонка статьи (4 из 12 колонок): липкие баннеры,
   едущие со скроллом. Два оффера: подписка на тг-канал и расчёт проекта.
   Тёмные карточки на светлой теме блога — фирменный контраст. */

export default function BlogRail() {
  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      {/* тг-канал */}
      <div className="overflow-hidden rounded-2xl bg-[#17121f] p-6">
        <p className="tech-label text-[10px] text-white/50">телеграм-канал</p>
        <p className="mt-2 text-[1.05rem] font-semibold leading-snug text-white">
          Канал <span className="font-display">AICS-93</span>
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/60">
          Инсайты из IT и ИИ-сфер для развития бизнеса — простым языком.
        </p>
        <GoalLink
          goal="tg_subscribe"
          goalParams={{ source: "blog_rail" }}
          href={legal.telegramChannel}
          target="_blank"
          rel="noreferrer"
          className="btn-case mt-5 inline-flex h-11 items-center px-6 text-sm font-semibold"
        >
          Подписаться →
        </GoalLink>
      </div>

      {/* расчёт проекта */}
      <div
        className="overflow-hidden rounded-2xl p-6"
        style={{
          background:
            "radial-gradient(120% 140% at 88% 0%, rgba(151,71,255,0.28), transparent 60%), #17121f",
        }}
      >
        <p className="tech-label text-[10px] text-white/50">сайт под ключ</p>
        <p className="mt-2 text-[1.05rem] font-semibold leading-snug text-white">
          Сайт за 7–14 дней — <span className="font-display">от 1 500 $</span>
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/60">
          Смета по составу работ — фиксируется в договоре до старта. Разбор и вилка цены
          в течение 24 часов.
        </p>
        <GoalLink
          goal="kp_click"
          goalParams={{ source: "blog_rail" }}
          href="/#upgrade"
          className="btn-case mt-5 inline-flex h-11 items-center px-6 text-sm font-semibold"
        >
          Рассчитать проект →
        </GoalLink>
      </div>
    </div>
  );
}
