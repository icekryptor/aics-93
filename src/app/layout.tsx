import type { Metadata } from "next";
import { Unbounded, Inter } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const siteUrl = "https://aistov.space";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ребрендинг и дизайн на миллионы. Сайты, логотипы, брендбук.",
  description:
    "7 лет в дизайне, работа с крупными брендами. 2 года в ведении собственной онлайн-школы с оборотами от 5М. Делаю новый дизайн для брендов, увеличивающих свою долю на рынке — от брендбука до презентаций. Полный ребрендинг + внедрение процессов и команды.",
  keywords: [
    "ребрендинг",
    "брендинг",
    "брендбук",
    "веб-дизайн",
    "разработка сайтов",
    "фирменный стиль",
    "логотип",
    "Василий Аистов",
  ],
  authors: [{ name: "Василий Аистов" }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "AICS-93 · Василий Аистов",
    title: "Ребрендинг и дизайн на миллионы",
    description:
      "Делаю ваш бренд узнаваемым, желаемым и масштабируемым на основе глубокой аналитики и опыта.",
  },
  alternates: { canonical: siteUrl },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${unbounded.variable} ${inter.variable} h-full`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
