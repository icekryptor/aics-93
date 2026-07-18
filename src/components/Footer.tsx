import Image from "next/image";
import { assets, legal, nav } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-dark py-14 text-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          {/* legal */}
          <div>
            <div className="flex items-center gap-2.5">
              <Image src={assets.gear} alt="" width={28} height={28} className="size-7 invert" />
              <Image src={assets.wordmark} alt="AICS-93" width={90} height={22} className="h-[16px] w-auto invert" />
            </div>
            <div className="mt-5 flex gap-5 text-sm">
              <a href="#" className="text-gradient font-medium">Политика конфиденциальности</a>
              <a href="#" className="text-gradient font-medium">Договор оферты</a>
            </div>
            <div className="mt-5 space-y-1 text-sm text-white/60">
              <p className="text-white/85">{legal.name}</p>
              <p>{legal.inn}</p>
              <p>{legal.ogrn}</p>
              <p>
                Телефон: <a href={`tel:${legal.phoneHref}`} className="hover:text-white">{legal.phone}</a>
              </p>
              <p>
                e-mail: <a href={`mailto:${legal.email}`} className="hover:text-white">{legal.email}</a>
              </p>
            </div>
          </div>

          {/* nav */}
          <nav className="flex flex-col gap-y-3 lg:order-2">
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {nav.map((n) => (
                <a key={n.href} href={n.href} className="text-sm text-white/60 transition-colors hover:text-white">
                  {n.label}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {[
                { label: "Услуги", href: "/services" },
                { label: "Решения", href: "/solutions" },
                { label: "Журнал", href: "/blog" },
              ].map((n) => (
                <a key={n.href} href={n.href} className="text-sm text-white/60 transition-colors hover:text-white">
                  {n.label}
                </a>
              ))}
            </div>
          </nav>

          {/* socials */}
          <div className="flex gap-3 lg:order-3">
            <a
              href={legal.telegram}
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className="grid size-10 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-white" aria-hidden>
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.05-1.99 1.93c-.23.23-.42.42-.83.42z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="grid size-10 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-white" strokeWidth="1.8" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" className="fill-white stroke-none" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40">
          <p>© {new Date().getFullYear()} AICS-93 · Василий Аистов</p>
          <a href="/ai" className="transition-colors hover:text-white/70">
            Hey AI, learn about us →
          </a>
        </div>
      </div>
    </footer>
  );
}
