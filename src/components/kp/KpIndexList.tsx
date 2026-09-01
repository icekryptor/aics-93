import Link from "next/link";
import KpCopyLink from "@/components/kp/KpCopyLink";
import { kpEntries, KP_STATE_LABEL, KP_STATE_COLOR } from "@/lib/kp/registry";

/* KpIndexList — содержимое индекса готовых КП. Вынесено из страницы, чтобы
   вёрстку можно было проверить в обход пароля (временным маршрутом), не
   вводя пароль в форму. */

export default function KpIndexList() {
  const won = kpEntries.filter((k) => k.state === "won").length;
  const waiting = kpEntries.filter((k) => k.state === "waiting").length;

  return (
    <>
      <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-runtime-ink-soft">
        <span>
          всего: <span className="font-display text-runtime-ink">{kpEntries.length}</span>
        </span>
        <span>
          принято: <span className="font-display text-runtime-ink">{won}</span>
        </span>
        <span>
          ждут ответа: <span className="font-display text-runtime-ink">{waiting}</span>
        </span>
      </p>

      <div className="mt-10 space-y-4">
        {kpEntries.map((k) => (
          <article
            key={k.id}
            className="rounded-2xl px-6 py-6 sm:px-7"
            style={{
              border: "1px solid var(--color-runtime-line)",
              background: "rgba(23,16,41,0.4)",
            }}
          >
            {/* клиент + статус */}
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h2 className="text-[1.15rem] font-semibold leading-snug">{k.client}</h2>
              <span
                className="tech-label inline-flex items-center gap-2 text-[10.5px]"
                style={{ color: KP_STATE_COLOR[k.state] }}
              >
                <span
                  aria-hidden
                  className="size-1.5 rounded-full"
                  style={{ background: KP_STATE_COLOR[k.state] }}
                />
                {KP_STATE_LABEL[k.state]}
              </span>
            </div>

            <p className="mt-2 text-[14.5px] leading-relaxed text-runtime-ink-soft">{k.subject}</p>

            {/* цена / срок / отправлено */}
            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <dt className="tech-label text-[10px] text-runtime-ink-soft">цена</dt>
                <dd className="font-display mt-0.5 text-[1.05rem] leading-none">{k.price}</dd>
              </div>
              <div>
                <dt className="tech-label text-[10px] text-runtime-ink-soft">срок</dt>
                <dd className="mt-0.5 text-[14.5px] leading-none">{k.term}</dd>
              </div>
              <div>
                <dt className="tech-label text-[10px] text-runtime-ink-soft">отправлено</dt>
                <dd className="font-display mt-0.5 text-[14.5px] leading-none">{k.sent}</dd>
              </div>
            </dl>
            {k.priceNote ? (
              <p className="mt-2.5 text-[13px] text-runtime-ink-soft">{k.priceNote}</p>
            ) : null}

            <p className="mt-4 border-t border-runtime-line pt-4 text-[13.5px] leading-relaxed text-runtime-ink-soft">
              {k.status}
            </p>

            {/* виды КП + копирование ссылки */}
            <div className="mt-4 space-y-2.5">
              {k.variants.map((v) => (
                <div key={v.href} className="flex flex-wrap items-center gap-2.5">
                  <Link
                    href={v.href}
                    className="tech-label inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] transition-colors"
                    style={{
                      borderColor: "color-mix(in srgb, var(--color-signal) 45%, transparent)",
                      color: "var(--color-runtime-ink)",
                    }}
                  >
                    {v.label} →
                  </Link>
                  <span className="text-[12.5px] text-runtime-ink-soft">{v.note}</span>
                  <KpCopyLink href={v.href} />
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="hud mt-10 text-[9px] text-runtime-ink-soft/60">
        // новый КП — запись в src/lib/kp/registry.ts, иначе он тут не появится
      </p>
      <Link
        href="/panel"
        className="tech-label mt-6 inline-flex text-[11px] text-runtime-ink-soft transition-colors hover:text-runtime-ink"
      >
        ← реестр проектов
      </Link>
    </>
  );
}
