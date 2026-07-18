import Link from "next/link";
import Footer from "@/components/Footer";
import CursorPro from "@/components/system/CursorPro";
import ZoneLabel from "@/components/services/ZoneLabel";
import { legal } from "@/lib/content";

// Focused dark "runtime" chrome for service pages — cyber-lab identity without
// the homepage's boot/slidedeck/mesh machinery. Keeps the signature cursor.
export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="runtime relative min-h-screen">
      <a
        href="#main"
        className="sr-only left-3 top-3 z-[200] rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed"
      >
        К содержимому
      </a>

      {/* ambient: deep-dark base + faint blueprint grid + violet aura */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 60% at 80% -5%, rgba(151,71,255,0.12), transparent 60%), radial-gradient(60% 50% at 0% 100%, rgba(181,123,255,0.08), transparent 60%), var(--color-runtime)",
        }}
      />
      <div
        aria-hidden
        className="runtime-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.4]"
        style={{
          maskImage: "radial-gradient(120% 80% at 50% 0%, #000 20%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(120% 80% at 50% 0%, #000 20%, transparent 90%)",
        }}
      />

      <CursorPro />

      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-runtime-line/70 bg-[color-mix(in_srgb,var(--color-runtime)_78%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="AICS-93 — на главную" className="flex items-center gap-2.5" data-magnetic>
            <span className="signal-grad grid size-7 place-items-center rounded-[8px] text-[11px] font-bold text-white">
              A
            </span>
            <span className="font-display text-[14px] tracking-tight text-runtime-ink">
              AICS<span className="signal-text">-93</span>
            </span>
            <ZoneLabel />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              data-magnetic
              className="tech-label rounded-full border border-runtime-line px-4 py-2 text-[11px] text-runtime-ink-soft transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_60%,transparent)] hover:text-runtime-ink"
            >
              ← на сайт
            </Link>
            <a
              href="#upgrade"
              data-magnetic
              data-cursor="route signal"
              className="btn-case grid h-8 place-items-center px-4 text-[12px] font-semibold"
            >
              обсудить проект
            </a>
          </div>
        </div>
      </header>

      <main id="main">{children}</main>
      <Footer />
      <span className="sr-only">{legal.telegram}</span>
    </div>
  );
}
