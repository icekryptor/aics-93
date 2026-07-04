import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import JsonLd from "@/components/seo/JsonLd";
import YandexMetrika from "@/components/analytics/YandexMetrika";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, AUTHOR } from "@/lib/site";

// Self-hosted variable Unbounded (latin + cyrillic) — no network at build time.
const unbounded = localFont({
  variable: "--font-unbounded",
  display: "swap",
  src: [{ path: "./fonts/Unbounded-Variable.ttf", weight: "300 700", style: "normal" }],
});

// Neue Haas Grotesk Display — the original site's primary typeface.
const neueHaas = localFont({
  variable: "--font-neue",
  display: "swap",
  src: [
    { path: "./fonts/NeueHaas-ExtraLight.woff", weight: "300", style: "normal" },
    { path: "./fonts/NeueHaas-Roman.woff", weight: "400", style: "normal" },
    { path: "./fonts/NeueHaas-Medium.woff", weight: "500", style: "normal" },
    { path: "./fonts/NeueHaas-Bold.woff", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — AICS-93 · Василий Аистов",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "ребрендинг",
    "брендинг",
    "брендбук",
    "веб-дизайн",
    "разработка сайтов",
    "фирменный стиль",
    "логотип",
    "ИИ в процессах",
    "Василий Аистов",
  ],
  authors: [{ name: AUTHOR.name, url: SITE_URL }],
  creator: AUTHOR.name,
  publisher: AUTHOR.legalName,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Ребрендинг и дизайн на миллионы",
    description:
      "Делаю ваш бренд узнаваемым, желаемым и масштабируемым на основе глубокой аналитики и опыта.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ребрендинг и дизайн на миллионы",
    description:
      "Делаю ваш бренд узнаваемым, желаемым и масштабируемым на основе глубокой аналитики и опыта.",
  },
  alternates: {
    canonical: SITE_URL,
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// Site-wide structured data: the person/brand entity + the site itself. Gives
// search + AI answer engines a stable entity to attribute and cite.
const siteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: AUTHOR.name,
    alternateName: AUTHOR.legalName,
    jobTitle: AUTHOR.jobTitle,
    url: SITE_URL,
    email: `mailto:${AUTHOR.email}`,
    telephone: AUTHOR.phone,
    knowsAbout: [
      "ребрендинг",
      "брендинг",
      "фирменный стиль",
      "веб-дизайн",
      "внедрение ИИ в процессы",
      "дизайн-аналитика",
    ],
    ...(AUTHOR.sameAs.length ? { sameAs: AUTHOR.sameAs } : {}),
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#studio`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    founder: { "@id": `${SITE_URL}/#person` },
    provider: { "@id": `${SITE_URL}/#person` },
    areaServed: "RU",
    priceRange: "$$$",
    email: `mailto:${AUTHOR.email}`,
    telephone: AUTHOR.phone,
    knowsLanguage: ["ru"],
    serviceType: ["Ребрендинг", "Брендбук", "Веб-дизайн", "Айдентика", "Внедрение ИИ в процессы"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "ru-RU",
    publisher: { "@id": `${SITE_URL}/#person` },
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${unbounded.variable} ${neueHaas.variable} h-full`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <JsonLd data={siteJsonLd} />
        <YandexMetrika />
        {children}
      </body>
    </html>
  );
}
