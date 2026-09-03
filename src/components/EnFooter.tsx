import Link from "next/link";
import { enChrome } from "@/lib/en/content";
import { legal } from "@/lib/content";

// Compact footer of the English section — shared by the /en runtime chrome
// and the immersive /en homepage.
export default function EnFooter() {
  return (
    <footer className="runtime border-t border-runtime-line/70 py-10">
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
  );
}
