"use client";

import Script from "next/script";
import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Яндекс.Метрика. Счётчик + отслеживание виртуальных переходов (SPA): при
// клиентской навигации между роутами Метрика сама хит не шлёт, поэтому шлём
// вручную на смену pathname/query.
const YM_ID = 110384489;

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

function PageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const first = useRef(true);

  useEffect(() => {
    // init уже отправил первый хит — пропускаем самый первый прогон,
    // чтобы не задваивать посадочную страницу.
    if (first.current) {
      first.current = false;
      return;
    }
    if (typeof window === "undefined" || !window.ym) return;
    const qs = searchParams?.toString();
    window.ym(YM_ID, "hit", pathname + (qs ? `?${qs}` : ""));
  }, [pathname, searchParams]);

  return null;
}

export default function YandexMetrika() {
  // В dev не грузим — иначе локальные визиты попадут в статистику.
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}', 'ym');
        ym(${YM_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});`}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YM_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
      <Suspense fallback={null}>
        <PageViews />
      </Suspense>
    </>
  );
}
