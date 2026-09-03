// English copy for the case showcase block (immersive /en home, #prtf).
// Mirrors src/lib/showcase.ts one-to-one: same order, same slugs, hrefs, image
// paths, accents and wip flags — only human-readable strings are translated.

import type { CaseShowcaseLabels } from "@/components/showcase/CaseShowcase";
import type { ShowcaseCase } from "@/lib/showcase";

/* ---------- component labels ---------- */

export const EN_SHOWCASE_LABELS: CaseShowcaseLabels = {
  eyebrow: "[ cases · selected ]",
  sectionAria: "Cases — selected work",
  carouselRole: "carousel",
  shotSoonDesktop: "desktop · screenshot soon",
  shotSoonMobile: "mobile · screenshot soon",
  bulletsTitle: "what was done:",
  srCasePrefix: "case ",
  caseAriaPrefix: "case",
  caseLink: "View case",
  caseLinkAriaPrefix: "view case",
  prevAria: "previous case",
  nextAria: "next case",
};

/* ---------- cases ---------- */

export const EN_SHOWCASE_CASES: ShowcaseCase[] = [
  {
    title: "XIMI4KA",
    desc: "co-founder to this day; I run the CTO and CMO functions",
    bullets: [
      "naming",
      "brand identity",
      "product design",
      "ERP and operating procedures",
      "marketplace traffic setup",
      "social media marketing",
      "our own online store",
      "our own learning platform",
    ],
    shots: [
      { src: "/assets/cases/ximichka/oge-trainer.png", kind: "desktop", alt: "Ximi4ka — learning platform, exam trainer" },
      { src: "/assets/cases/ximichka/wb-card.jpg", kind: "mobile", alt: "Ximi4ka — kit listing on Wildberries" },
      { src: "/assets/cases/ximichka/wb-app.jpg", kind: "mobile", alt: "Ximi4ka — Wildberries search results" },
      { src: "/assets/cases/ximichka/site.png", kind: "desktop", alt: "Ximi4ka — official online store" },
    ],
    accent: "#9057ff",
    href: "/cases/ximichka",
    wip: true,
  },
  {
    title: "MARTOX",
    desc: "Website for an operator that takes brands into the US market: design, build, generative visuals and leads delivered to Telegram.",
    bullets: [
      "brand identity and visual system",
      "design for the home page and package pages",
      "animated diagram of the product's route",
      "quiz and lead magnet",
      "leads delivered to Telegram",
      "174 automated checks on the live site",
    ],
    shots: [
      { src: "/assets/cases/martox/site-desktop.webp", kind: "desktop", alt: "MARTOX — first screen" },
      { src: "/assets/cases/martox/site-mobile.webp", kind: "mobile", alt: "MARTOX — mobile version" },
      { src: "/assets/cases/martox/menu-mobile.webp", kind: "mobile", alt: "MARTOX — mobile menu" },
      { src: "/assets/cases/martox/steps.webp", kind: "desktop", alt: "MARTOX — the seven stages of market entry" },
    ],
    accent: "#b27f85",
    href: "/cases/martox",
  },
  {
    title: "GO.LD",
    desc: "Website and brand identity for a jewelry loft in Moscow.",
    bullets: [
      "in-depth interview",
      "market research",
      "brand book and logo refresh",
      "website refresh",
    ],
    shots: [
      { src: "/assets/cases/gold/site-desktop.webp", kind: "desktop", alt: "GO.LD — website" },
      { src: "/assets/cases/gold/site-mobile.webp", kind: "mobile", alt: "GO.LD — mobile version" },
    ],
    accent: "#c5ff44",
    href: "/cases/gold",
  },
  {
    title: "PRIDE CLUB",
    desc: "A refresh of both the meaning and the visuals of an education brand.",
    bullets: [
      "expert deep-dive session",
      "market research",
      "brand book and logo refresh",
      "social media redesign",
    ],
    shots: [
      { src: "/assets/tild6563-396__PRIDE_CLUB_-_Google_.png", kind: "desktop", alt: "PRIDE CLUB — website" },
    ],
    accent: "#5ab8ff",
    href: "https://pride-academy.ru",
  },
  {
    title: "HARMONICUM",
    desc: "Rebranding for coach Varvara Kosova.",
    bullets: [
      "expert deep-dive session",
      "brand book and logo refresh",
      "website refresh",
      "presentation redesign",
    ],
    shots: [{ src: "/assets/tild6637-333__Frame_1.png", kind: "desktop", alt: "HARMONICUM — website" }],
    accent: "#ff7050",
    href: "https://varvarakosova.ru",
  },
  {
    title: "CENTER OF LIGHT ACADEMY",
    desc: "Logo, brand identity and landing pages for an education brand.",
    bullets: [
      "research into the business's values",
      "brand identity build-out",
      "main page + landing page template",
      "preparation for the ad launch",
    ],
    shots: [
      { src: "/assets/tild3961-383__image_58.png", kind: "desktop", alt: "Center of Light Academy — website" },
    ],
    accent: "#9747ff",
    href: "https://academy-center-of-light.ru",
  },
  {
    title: "GENIUS CODE",
    desc: "Rebranding, logo and a multi-page platform website.",
    bullets: [
      "in-depth interview",
      "market research",
      "brand book and logo refresh",
      "website refresh",
    ],
    shots: [{ src: "/assets/tild3331-353__noroot.png", kind: "desktop", alt: "GENIUS CODE — website" }],
    accent: "#ffd166",
    href: "https://edu.genius-code.ru",
  },
  {
    title: "ORTHODOCS",
    desc: "PMF analysis, the app concept, logo and screen prototypes.",
    bullets: [
      "survey of 30+ doctors and orthodontists",
      "competitor research in Russia and worldwide",
      "UX storyboard",
      "pitch deck for an investor",
    ],
    shots: [
      { src: "/assets/tild3964-623__Orthodocs_-_Figma.png", kind: "desktop", alt: "ORTHODOCS — prototype" },
    ],
    accent: "#5ab8ff",
  },
  {
    title: "UPLITI",
    desc: "Website for a kitchen manufacturer with a chain of showrooms (formerly inCucina, in business since 2005).",
    bullets: ["corporate website", "catalog and portfolio", "project cost calculator", "showroom booking"],
    shots: [
      { src: "/assets/cases/upliti/site-desktop.webp", kind: "desktop", alt: "Upliti — website" },
      { src: "/assets/cases/upliti/site-mobile.webp", kind: "mobile", alt: "Upliti — mobile version" },
    ],
    accent: "#5ab8ff",
    href: "/cases/upliti",
    wip: true,
  },
  {
    title: "EVOLVER",
    desc: "Manifesto site for the international Mind Evolution project: “In Mind We Trust”.",
    bullets: ["identity", "immersive intro", "English version", "manifesto site"],
    shots: [
      { src: "/assets/cases/evo/site-desktop.webp", kind: "desktop", alt: "EVOLVER — website" },
      { src: "/assets/cases/evo/site-mobile.webp", kind: "mobile", alt: "EVOLVER — mobile version" },
    ],
    accent: "#5ab8ff",
    href: "/cases/evo-center",
    wip: true,
  },
  {
    title: "HST TRANSPORT",
    desc: "English-language corporate website for the logistics company Honest Smart Transportation.",
    bullets: ["corporate website", "service structure", "cases and industries", "b2b tone of voice"],
    shots: [
      { src: "/assets/cases/hst/site-desktop.webp", kind: "desktop", alt: "HST — website" },
      { src: "/assets/cases/hst/site-mobile.webp", kind: "mobile", alt: "HST — mobile version" },
    ],
    accent: "#ff7050",
    href: "/cases/hst-transport",
    wip: true,
  },
  {
    title: "EVGENY GANTSEL",
    desc: "A line of landing pages for the personal brand of a fitness coach and nutritionist.",
    bullets: ["flagship landing page", "video-breakdown landing page", "international version", "personal brand"],
    shots: [
      { src: "/assets/cases/gantsel/steps-ru-desktop.webp", kind: "desktop", alt: "Evgeny Gantsel — program landing page" },
      { src: "/assets/cases/gantsel/video-mobile.webp", kind: "mobile", alt: "Video-breakdown landing page — mobile version" },
      { src: "/assets/cases/gantsel/body7-mobile.webp", kind: "mobile", alt: "7 Steps to Dream Body — mobile version" },
      { src: "/assets/cases/gantsel/body7-desktop.webp", kind: "desktop", alt: "7 Steps to Dream Body — website" },
    ],
    accent: "#9747ff",
    href: "/cases/gantsel",
    wip: true,
  },
];
