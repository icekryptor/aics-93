import Link from "next/link";
import CursorPro from "@/components/system/CursorPro";
import GoalLink from "@/components/system/GoalLink";
import SetDocumentLang from "@/components/system/SetDocumentLang";
import { enChrome } from "@/lib/en/content";
import { legal } from "@/lib/content";

// English section chrome — same dark "runtime" identity as the services zone
// (see (services)/layout.tsx), with EN labels, an EN footer and a RU switch.
export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="runtime relative min-h-screen">
      <SetDocumentLang lang="en" />
      <a
        href="#main"
        className="sr-only left-3 top-3 z-[200] rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed"
      >
        {enChrome.skip}
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
          <Link href="/en" aria-label="AICS-93 — English home" className="flex items-center gap-2.5" data-magnetic>
            <span className="signal-grad grid size-7 place-items-center rounded-[8px] text-[11px] font-bold text-white">
              A
            </span>
            <span className="font-display text-[14px] tracking-tight text-runtime-ink">
              AICS<span className="signal-text">-93</span>
            </span>
            <span className="tech-label ml-1 hidden text-[10px] text-runtime-ink-soft sm:inline">
              / en
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/en/services"
              data-magnetic
              className="tech-label hidden rounded-full px-3 py-2 text-[11px] text-runtime-ink-soft transition-colors hover:text-runtime-ink sm:inline-block"
            >
              services
            </Link>
            <Link
              href="/en/operator"
              data-magnetic
              className="tech-label hidden rounded-full px-3 py-2 text-[11px] text-runtime-ink-soft transition-colors hover:text-runtime-ink sm:inline-block"
            >
              operator
            </Link>
            <Link
              href="/"
              data-magnetic
              className="tech-label rounded-full border border-runtime-line px-4 py-2 text-[11px] text-runtime-ink-soft transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_60%,transparent)] hover:text-runtime-ink"
            >
              RU
            </Link>
            <GoalLink
              goal="kp_click"
              goalParams={{ source: "en_nav" }}
              href="#upgrade"
              data-magnetic
              data-cursor="route signal"
              className="btn-case grid h-8 place-items-center px-4 text-[12px] font-semibold"
            >
              {enChrome.discuss}
            </GoalLink>
          </nav>
        </div>
      </header>

      <main id="main">{children}</main>

      {/* compact EN footer */}
      <footer className="border-t border-runtime-line/70 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {enChrome.footerNav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-sm text-runtime-ink-soft transition-colors hover:text-runtime-ink"
              >
                {n.label}
              </Link>
            ))}
            <a
              href={legal.telegram}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-runtime-ink-soft transition-colors hover:text-runtime-ink"
            >
              Telegram
            </a>
            <a
              href={`mailto:${legal.email}`}
              className="text-sm text-runtime-ink-soft transition-colors hover:text-runtime-ink"
            >
              {legal.email}
            </a>
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-runtime-line/50 pt-5 text-xs text-runtime-ink-soft/70">
            <p>© {new Date().getFullYear()} {enChrome.copyright}</p>
            <a href="/ai" className="transition-colors hover:text-runtime-ink">
              {enChrome.heyAi}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
