import type { Metadata } from "next";
import { cookies } from "next/headers";
import PanelGate from "@/components/panel/PanelGate";
import HeroStand from "@/components/panel/HeroStand";
import { tokenFor } from "@/lib/panel-auth";

/* /panel/hero — настроечный стенд мозга хиро (паттерн evo brain-lab):
   ползунки крутят визуал вживую, «запушить» коммитит brain-config.json в
   main через /api/brain-config → автодеплой Vercel. Доступ — кука панели. */

export const metadata: Metadata = {
  title: "Стенд · мозг хиро",
  robots: { index: false, follow: false },
};

export default async function HeroStandPage() {
  const expected = process.env.PANEL_PASSWORD;
  const cookie = (await cookies()).get("aics_panel")?.value;
  const authed = Boolean(expected && cookie === tokenFor(expected));

  return (
    <div className="text-runtime-ink">
      <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-14 sm:px-8">
        <span
          className="tech-label inline-flex items-center gap-2 text-[0.72rem]"
          style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
        >
          <span className="hud-dot" style={{ display: "inline-block" }} />
          harness · стенд хиро
        </span>
        <h1 className="mt-5 text-[clamp(1.6rem,3.4vw,2.3rem)] font-semibold leading-tight tracking-tight">
          Мозг: <span className="signal-text">параметры сцены</span>
        </h1>

        {!authed ? (
          <>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-runtime-ink-soft">
              Закрытый раздел: живая настройка визуала мозга в хиро.
            </p>
            <PanelGate />
          </>
        ) : (
          <HeroStand />
        )}
      </div>
    </div>
  );
}
