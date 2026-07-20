import Image from "next/image";
import GenerativeCover from "@/components/blog/GenerativeCover";
import AlgoArt from "@/components/services/AlgoArt";
import ChapterNav from "@/components/cases/ChapterNav";
import type { CaseStudy, CaseMedia } from "@/lib/cases";

/* CaseLongread — шаблон кейса-лонгрида: hero с фактами и ролями, липкая
   навигация по главам (desktop), блоки «номер + текст + медиа-сетка».
   Пустой src медиа → генеративный плейсхолдер «[ медиа · скоро ]». */

function MediaSlot({ media, accent, seed }: { media: CaseMedia; accent: string; seed: string }) {
  const frame =
    media.kind === "mobile"
      ? "aspect-[9/16] w-full max-w-[240px]"
      : "aspect-[16/9] w-full";

  return (
    <figure
      className={`relative overflow-hidden rounded-[14px] border border-runtime-line ${frame}`}
      style={{ background: "color-mix(in srgb, var(--color-runtime-2) 92%, transparent)" }}
    >
      {media.src ? (
        media.kind === "video" ? (
          <video
            src={media.src}
            poster={media.poster}
            muted
            loop
            playsInline
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover object-top"
          />
        )
      ) : (
        <>
          <GenerativeCover seed={seed} accent={accent} density={0.9} className="absolute inset-0 opacity-70" />
          <figcaption className="tech-label absolute inset-x-0 bottom-3 text-center text-[10px] text-runtime-ink-soft">
            [ медиа · скоро ]
          </figcaption>
        </>
      )}
    </figure>
  );
}

export default function CaseLongread({ c }: { c: CaseStudy }) {
  return (
    <div className="text-runtime-ink">
      {/* hero */}
      <div className="relative mx-auto w-full max-w-6xl overflow-hidden px-5 pb-14 pt-16 sm:px-8 sm:pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            maskImage: "radial-gradient(58% 68% at 85% 14%, #000 4%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(58% 68% at 85% 14%, #000 4%, transparent 70%)",
          }}
        >
          <AlgoArt seed={`case-${c.slug}`} density={1} className="h-full w-full" />
        </div>

        <div className="relative z-10">
          <span
            className="tech-label inline-flex items-center gap-2 text-[0.72rem]"
            style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
          >
            <span className="hud-dot" style={{ display: "inline-block" }} />
            {c.hero.eyebrow}
          </span>
          <h1 className="mt-6 max-w-3xl text-[clamp(2rem,4.6vw,3.3rem)] font-semibold leading-[1.05] tracking-tight">
            {c.hero.h1}
          </h1>
          <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-runtime-ink-soft">
            {c.hero.subhead}
          </p>

          {/* роли */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="tech-label text-[11px] text-runtime-ink-soft">моя роль:</span>
            {c.hero.roles.map((r) => (
              <span
                key={r}
                className="tech-label rounded-full border border-runtime-line px-3.5 py-1.5 text-[11px] text-runtime-ink-soft"
              >
                {r}
              </span>
            ))}
          </div>

          {/* факты */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {c.hero.facts.map((f) => (
              <div key={f.label} className="border-t border-runtime-line pt-3">
                <p className="font-display text-[1.5rem] leading-none tracking-tight sm:text-[1.7rem]">
                  {f.value}
                </p>
                <p className="mt-2 text-[11.5px] leading-snug text-runtime-ink-soft">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* тело: липкая навигация + главы */}
      <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[230px_1fr] lg:gap-14">
          <ChapterNav items={c.blocks.map((b) => ({ id: b.id, num: b.num, title: b.title }))} />

          <div className="min-w-0 space-y-16 lg:space-y-20">
            {c.blocks.map((b) => (
              <section key={b.id} id={b.id} className="scroll-mt-28">
                <div className="flex items-baseline gap-4">
                  <span
                    className="font-display text-[1.9rem] leading-none tracking-tight sm:text-[2.2rem]"
                    style={{ color: "var(--color-signal-2)" }}
                  >
                    {b.num}
                  </span>
                  <h2 className="text-[clamp(1.25rem,2.4vw,1.7rem)] font-semibold leading-tight tracking-tight">
                    {b.title}
                  </h2>
                </div>

                <div className="mt-4 max-w-2xl space-y-4">
                  {b.text.split("\n\n").map((p, i) => (
                    <p key={i} className="text-[15px] leading-relaxed text-runtime-ink-soft">
                      {p}
                    </p>
                  ))}
                </div>

                {b.media.length > 0 && (
                  <div className="mt-7 flex flex-wrap items-start gap-4">
                    {b.media.map((m, i) => (
                      <div key={i} className={m.kind === "mobile" ? "w-[200px] sm:w-[240px]" : "min-w-[280px] flex-1"}>
                        <MediaSlot media={m} accent={c.accent} seed={`${c.slug}-${b.id}-${i}`} />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
