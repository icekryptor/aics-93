import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import PanelGate from "@/components/panel/PanelGate";
import { panelProjects, LINK_KIND_COLOR } from "@/lib/panel";
import { tokenFor } from "@/lib/panel-auth";

/* /panel — harness-панель: приватный реестр проектов и артефактов
   (КП, прототипы, превью). Доступ по паролю (PANEL_PASSWORD в env),
   noindex, вне sitemap. */

export const metadata: Metadata = {
  title: "Harness-панель · проекты",
  robots: { index: false, follow: false },
};

export default async function PanelPage() {
  const expected = process.env.PANEL_PASSWORD;
  const cookie = (await cookies()).get("aics_panel")?.value;
  const authed = Boolean(expected && cookie === tokenFor(expected));

  return (
    <div className="text-runtime-ink">
      <div className="mx-auto w-full max-w-5xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
        <span
          className="tech-label inline-flex items-center gap-2 text-[0.72rem]"
          style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
        >
          <span className="hud-dot" style={{ display: "inline-block" }} />
          harness · панель проектов
        </span>
        <h1 className="mt-6 text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-tight tracking-tight">
          Проекты <span className="signal-text">в работе</span>
        </h1>
        {authed ? (
          <Link
            href="/kp"
            className="tech-label mt-4 inline-flex text-[11px] transition-colors hover:text-runtime-ink"
            style={{ color: "var(--color-signal-2)" }}
          >
            индекс готовых КП →
          </Link>
        ) : null}

        {!authed ? (
          <>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-runtime-ink-soft">
              Закрытый раздел: ссылки на КП, прототипы и превью по клиентам.
            </p>
            <PanelGate />
          </>
        ) : (
          <div className="mt-10 space-y-4">
            {panelProjects.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl px-6 py-6 sm:px-7"
                style={{ border: "1px solid var(--color-runtime-line)", background: "rgba(23,16,41,0.4)" }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <div className="flex items-baseline gap-3">
                    <span className="hud text-[11px]" style={{ color: "var(--color-signal-2)" }}>
                      {p.id}
                    </span>
                    <h2 className="text-[1.15rem] font-semibold leading-snug">
                      {p.client} — {p.title}
                    </h2>
                  </div>
                  <span className="tech-label text-[10.5px] text-runtime-ink-soft">{p.date}</span>
                </div>
                <p className="mt-2 text-[13.5px] text-runtime-ink-soft">{p.status}</p>
                <p className="tech-label mt-1.5 text-[10.5px]" style={{ color: "var(--color-signal-2)" }}>
                  {p.stage}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                      className="tech-label inline-flex items-center gap-2 rounded-full border border-runtime-line px-4 py-2 text-[11px] text-runtime-ink-soft transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_60%,transparent)] hover:text-runtime-ink"
                    >
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full"
                        style={{ background: LINK_KIND_COLOR[l.kind] }}
                      />
                      {l.label} →
                    </a>
                  ))}
                </div>
              </article>
            ))}
            <p className="hud pt-2 text-[9px] text-runtime-ink-soft/60">
              // {panelProjects.length} проект(ов) · доступ по cookie 30 дней · выход — очистить куки
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
