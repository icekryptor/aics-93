import Link from "next/link";
import { getAllServices, type Service } from "@/lib/services";
import GenerativeCover from "@/components/blog/GenerativeCover";
import CardVideo from "@/components/services/CardVideo";

// Services block on the main page — covers are the landing videos
// (fallback: seeded algorithmic art for services without card media).
const ACCENTS = ["#9747ff", "#c856ff", "#5ab8ff", "#c5ff44"];

export type ServicesTeaserDict = {
  eyebrow: string;
  titlePre: string;
  titleAccent: string;
  titlePost: string;
  allLink: string;
  cardTag: string;
  cardMoreOverlay: string;
  cardMore: string;
};

const RU_TEASER: ServicesTeaserDict = {
  eyebrow: "[ услуги · что я делаю ]",
  titlePre: "Собираю ",
  titleAccent: "бренд, сайт и систему",
  titlePost: " на данных и ИИ",
  allLink: "все услуги →",
  cardTag: "услуга",
  cardMoreOverlay: "подробнее →",
  cardMore: "читать далее →",
};

export default function ServicesTeaser({
  dict,
  items,
  basePath = "/services",
}: {
  dict?: Partial<ServicesTeaserDict>;
  items?: Service[];
  basePath?: string;
} = {}) {
  const D: ServicesTeaserDict = { ...RU_TEASER, ...dict };
  const services = items ?? getAllServices();

  return (
    <section id="services" className="relative scroll-mt-24 py-[40px] lg:py-[64px]">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-16">
        <div className="flex items-end justify-between border-b border-line pb-5">
          <div>
            <p className="tech-label text-[11px] text-ink-soft">{D.eyebrow}</p>
            <h2 className="mt-3 text-[clamp(1.55rem,3.4vw,2.9rem)] font-normal leading-tight tracking-[-0.015em] text-ink">
              {D.titlePre}<span className="signal-text">{D.titleAccent}</span>{D.titlePost}
            </h2>
          </div>
          <Link
            href={basePath}
            className="tech-label hidden shrink-0 items-center gap-1.5 text-[12px] text-ink-soft transition-colors hover:text-ink sm:inline-flex"
          >
            {D.allLink}
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {services.map((s, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <Link key={s.slug} href={`${basePath}/${s.slug}`} className="group block">
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_45%,transparent)]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {s.card ? (
                      <CardVideo src={s.card.video} poster={s.card.poster} className="absolute inset-0" />
                    ) : (
                      <GenerativeCover
                        seed={`svc-${s.slug}`}
                        accent={accent}
                        density={1.15}
                        animate
                        className="absolute inset-0"
                      />
                    )}
                    <span
                      className="tech-label absolute left-4 top-4 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[9px]"
                      style={{ color: accent }}
                    >
                      {D.cardTag} {s.order}
                    </span>
                    <span className="tech-label absolute bottom-4 right-4 z-10 text-[10px] text-white/75">
                      {D.cardMoreOverlay}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-[1.25rem] font-normal leading-snug tracking-tight text-ink transition-colors group-hover:text-accent-ink">
                      {s.nav}
                    </h3>
                    <p className="mt-2.5 line-clamp-3 text-[15px] leading-relaxed text-ink-soft">
                      {s.metaDescription}
                    </p>
                    <span className="tech-label mt-2 inline-flex w-fit items-center gap-1 text-[11px] text-accent-ink">
                      {D.cardMore}
                    </span>
                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      {s.hero.stats.slice(0, 3).map((st) => (
                        <span
                          key={st.label}
                          className="tech-label rounded-full border border-line px-3 py-1.5 text-[9.5px] text-ink-soft"
                        >
                          {st.value} · {st.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        <Link
          href={basePath}
          className="tech-label mt-6 inline-flex items-center gap-1.5 text-[12px] text-ink-soft transition-colors hover:text-ink sm:hidden"
        >
          {D.allLink}
        </Link>
      </div>
    </section>
  );
}
