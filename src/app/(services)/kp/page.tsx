import type { Metadata } from "next";
import { cookies } from "next/headers";
import PanelGate from "@/components/panel/PanelGate";
import KpIndexList from "@/components/kp/KpIndexList";
import { tokenFor } from "@/lib/panel-auth";

/* /kp — внутренний индекс готовых КП: что собрано, за сколько, что с ним
   сейчас и ссылки на все виды. Закрыт паролем панели (тот же PANEL_PASSWORD):
   сами КП noindex, но публично достижимы по ссылке, а сводка с ценами всех
   клиентов в одном месте открытой быть не должна. */

export const metadata: Metadata = {
  title: "Готовые КП · индекс",
  robots: { index: false, follow: false },
};

export default async function KpIndexPage() {
  const expected = process.env.PANEL_PASSWORD;
  const cookie = (await cookies()).get("aics_panel")?.value;
  const authed = Boolean(expected && cookie === tokenFor(expected));

  return (
    <div className="text-runtime-ink">
      <div className="mx-auto w-full max-w-3xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
        <span
          className="tech-label inline-flex items-center gap-2 text-[0.72rem]"
          style={{ color: "var(--color-signal-2)", letterSpacing: "0.22em" }}
        >
          <span className="hud-dot" style={{ display: "inline-block" }} />
          harness · индекс кп
        </span>
        <h1 className="mt-6 text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-tight tracking-tight">
          Готовые <span className="signal-text">КП</span>
        </h1>

        {!authed ? (
          <>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-runtime-ink-soft">
              Закрытый раздел: собранные предложения, цены и ссылки для отправки.
            </p>
            <PanelGate />
          </>
        ) : (
          <KpIndexList />
        )}
      </div>
    </div>
  );
}
