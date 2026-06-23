import Image from "next/image";
import { assets, legal, nav } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-full border border-ink/15">
                <Image src={assets.gear} alt="" width={20} height={20} className="size-5" />
              </span>
              <Image src={assets.wordmark} alt="AICS-93" width={80} height={20} className="h-[16px] w-auto" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Дизайн и решения, вдохновлённые системой и логикой.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="text-sm text-ink-soft transition-colors hover:text-ink">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="space-y-1.5 text-sm text-ink-soft">
            <p className="font-medium text-ink">{legal.name}</p>
            <p>{legal.inn}</p>
            <p>{legal.ogrn}</p>
            <p>
              <a href={`tel:${legal.phoneHref}`} className="hover:text-ink">{legal.phone}</a>
            </p>
            <p>
              <a href={`mailto:${legal.email}`} className="hover:text-ink">{legal.email}</a>
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-5">
            <a href="#" className="hover:text-ink">Политика конфиденциальности</a>
            <a href="#" className="hover:text-ink">Договор оферты</a>
          </div>
          <p>© {new Date().getFullYear()} AICS-93 · Василий Аистов</p>
        </div>
      </div>
    </footer>
  );
}
