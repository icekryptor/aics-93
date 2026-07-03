import Link from "next/link";
import Footer from "@/components/Footer";
import { legal } from "@/lib/content";

// Calm reading chrome for the blog — brand colours, no immersive boot/cursor.
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* ambient: static soft mesh via CSS (light, unobtrusive) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 0%, rgba(151,71,255,0.06), transparent 70%), radial-gradient(50% 45% at 100% 20%, rgba(90,184,255,0.05), transparent 70%), var(--color-bg)",
        }}
      />
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="AICS-93 — на главную" className="flex items-center gap-2.5">
            <span className="signal-grad grid size-7 place-items-center rounded-[8px] text-[11px] font-bold text-white">
              A
            </span>
            <span className="font-display text-[14px] tracking-tight text-ink">
              AICS<span className="signal-text">-93</span>
            </span>
            <span className="tech-label ml-1 hidden text-[10px] text-ink-soft sm:inline">/ журнал</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="tech-label rounded-full border border-line px-4 py-2 text-[11px] text-ink-soft transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_55%,transparent)] hover:text-ink"
            >
              ← на сайт
            </Link>
            <a
              href="/#upgrade"
              className="signal-grad grid h-8 place-items-center rounded-full px-4 text-[12px] font-semibold text-white transition-transform hover:scale-105"
            >
              КП
            </a>
          </div>
        </div>
      </header>

      <main className="min-h-[70svh]">{children}</main>
      <Footer />
      {/* keep telegram reachable for crawlers/legal parity */}
      <span className="sr-only">{legal.telegram}</span>
    </>
  );
}
