// English copy for the /en section — home, services chrome, operator, contact.
// Mirrors the RU sources (lib/content.ts, PricingBlock) with strategy ToV:
// numbers over epithets, first person, honest mechanics — no agency clichés.

import type { ServiceDetailLabels } from "@/components/services/ServiceDetail";
import type { ContactConsoleDict } from "@/components/ContactConsole";

/* ---------- ServiceDetail section labels ---------- */

export const EN_SERVICE_LABELS: ServiceDetailLabels = {
  numberLocale: "en-US",
  priceFrom: "from ",
  priceNote:
    "· the final quote depends on scope and project hours — fixed in the contract before we start. 50/50 payment, deadlines backed by penalties on my side.",
  modulesEyebrow: "what gets digitized",
  modulesTitle: "Modules your system is assembled from",
  valuePropsEyebrow: "why this approach",
  valuePropsTitle: "Why it's faster, leaner and more alive than classic development",
  howEyebrow: "how it works",
  videoAlt: "The AI core assembling website interfaces",
  processEyebrow: "how we work",
  processTitle: "From brief to analytics support — one transparent pipeline",
  ganttEyebrow: "sample estimate · gantt",
  ganttTotal: (total) => `// total ≈ ${total} days · phases run in cascade`,
  formatDays: (d) => `${d} ${d === 1 ? "day" : "days"}`,
  comparisonEyebrow: "comparison",
  comparisonDefaultPrefix: "Classic studio vs",
  comparisonClassicLabel: "classic studio",
  deliverablesEyebrow: "what you get",
  deliverablesTitle: "Not just a website — a working asset with support",
  bankEyebrow: "solution bank",
  bizCasesEyebrow: "business cases",
  faqEyebrow: "faq",
  faqTitle: "Answering the questions that matter",
  trainingEyebrow: "training",
  stageCaptions: ["data", "prototype", "build"],
  evolutionStages: ["meaning", "concept", "style"],
  evolutionCaption: "[ click — next stage of evolution ]",
  evolutionAria:
    "Brand evolution: meaning → concept → style (particles: DNA → cells → unicorn)",
};

/* ---------- Contact console ---------- */

export const EN_PROJECT_TYPES = [
  "Landing page",
  "Multi-page website",
  "E-commerce store",
  "Custom web app",
  "Brand identity (logo, visual system)",
  "Brand identity + website",
  "UX/UI design only",
  "Design system",
];

export const enContactDict = (source: string): ContactConsoleDict => ({
  source,
  eyebrow: "[ contact · establish link ]",
  titlePre: "Send your project details — ",
  titleAccent: "let's talk",
  titlePost: " shortly.",
  subtitle: "I'll reach out on WhatsApp or Telegram with a quote for your task within 2 hours.",
  doneTitlePre: "Link ",
  doneTitleAccent: "established",
  doneText:
    "Signal received — I'll reply within 2 hours. Your project is already queued for processing.",
  step1: "[ 01 · project type ]",
  step2: "[ 02 · your details ]",
  projectTypes: EN_PROJECT_TYPES,
  aboutPlaceholder: "A few words about the project and a rough budget",
  namePlaceholder: "Your name",
  phonePlaceholder: "Phone or messenger",
  sending: "Sending…",
  submit: "Discuss the project",
  sendError: "couldn't send — try again or message me on Telegram",
  noFormPre: "No forms needed: ",
  noFormLink: "message me on Telegram",
  noFormPost:
    " with “site review” — I'll come back with a structure and a price range within 24 hours.",
  nextSteps: ["task review", "structure & price range", "plan & kickoff"],
  hudNote: "// your data goes straight to the operator · no spam",
  cubeCaption: "[ click — cube ⇄ data network ]",
});

/* ---------- /en home ---------- */

export const enHome = {
  eyebrow: "aics-93 · ai-powered studio",
  h1Pre: "One engineer + an AI engine — ",
  h1Accent: "agency output",
  h1Post: " without the agency",
  subhead:
    "I build websites, brand identities and web apps for small and mid-size businesses. An AI production pipeline does the work of four specialists; I design the strategy and verify every line before it ships.",
  stats: [
    { value: "7–14 days", label: "from brief to launched website — the AI engine compresses production, not quality" },
    { value: "up to 70%", label: "lower budget than a classic studio — the difference stays in your business" },
    { value: "10 yrs", label: "across design, marketing strategy and full-stack product development" },
    { value: "250+", label: "projects shipped, incl. work with Yandex, Accor, MTS Live, Oriflame" },
  ],
  engine: {
    eyebrow: "how the engine works",
    title: "Mechanics, not magic",
    text: "No “neural networks will build your site” promises. The pipeline is concrete: agents compile your brief data, a design system generates the blocks, and I review every screen and every line of code before you see it.",
    points: [
      "Agents research your market and compile the brief into structured data",
      "A code-native design system generates layouts from that data — tokens, components, motion",
      "I hand-check strategy, design decisions and code: the AI does volume, I do judgment",
      "You get demos throughout — progress you can see, not status reports",
    ],
  },
  servicesEyebrow: "services",
  servicesTitle: "What I build",
  servicesText:
    "Four productized services. Pick a direction — I'll come back with a scoped estimate for your task.",
  serviceCardTag: "service",
  serviceCardMore: "read more →",
  pricing: {
    eyebrow: "pricing",
    title: "Transparent packages, fixed in the contract",
    note: "Final quote = scope × project hours, fixed before kickoff. 50/50 payment.",
    packages: [
      {
        tag: "product 01",
        title: "Corporate website",
        price: "from $1,500",
        term: "7–14 days",
        items: [
          "competitor & audience research, strategy",
          "design concept and design system",
          "built on React / Next.js, backend in TS / Python",
          "integrations, E2E tests, MVP launch",
          "handover with docs + a month of support",
        ],
        href: "/en/services/web-development",
      },
      {
        tag: "product 02",
        title: "Brand identity",
        price: "$1,500",
        term: "10–14 days",
        items: [
          "meaning extraction and audit of current assets",
          "design concept — crafted by hand, by me",
          "digitized system: logo, colors, type, components",
          "key visuals, vector graphics, motion",
          "brand book and a design system that lives in code",
        ],
        href: "/en/services/brand-identity",
      },
      {
        tag: "product 03",
        title: "Process digitization & AI automation",
        price: "from $2,000",
        term: "from 14 days",
        items: [
          "process audit and automation map",
          "a harness system with sub-agents for your roles",
          "CRM and service integrations, dashboards",
          "northstar strategy document and BI foundation",
          "team training and a full harness handover",
        ],
        href: "/en/services/ai-integration",
      },
    ],
  },
  operator: {
    eyebrow: "the operator",
    title: "One person runs your project — not a rotating team",
    text: "Behind every AICS-93 website and brand there is one engineer-operator, not a chain of managers. Reply to your request, task review and a price range — within 24 hours.",
    cta: "Meet the operator →",
  },
  metaTitle: "AICS-93 — websites, brand identity and AI systems in 7–14 days",
  metaDescription:
    "One engineer + an AI engine instead of an agency: websites in 7–14 days, brand identities, web apps and AI process automation. Studio quality, up to 70% lower budgets.",
};

/* ---------- /en/services index ---------- */

export const enServicesIndex = {
  eyebrow: "services · aics-93",
  title: "What I do for",
  titleAccent: "business growth",
  text: "Technology instead of headcount: websites, brands and processes built on data and amplified by AI. Pick a direction — I'll scope the project for your task.",
  metaTitle: "Services — web development, branding, AI in your processes",
  metaDescription:
    "AICS-93 services: websites built in 7–14 days with AI, rebranding, brand books and AI agents embedded into business processes. Data, not guesswork.",
};

/* ---------- /en/operator ---------- */

export const enOperator = {
  eyebrow: "// the operator",
  title: "One person runs the project — not a faceless team",
  subhead:
    "Behind every AICS-93 website and brand there is a single engineer-operator, not a rotation of managers. Reply, task review and a price range — within 24 hours.",
  facts: [
    { rest: "Business builder, acting CMO" },
    { lead: "Art director / designer", rest: " with 10 years of practice" },
    {
      lead: "Working with ML / LLM since 2023",
      rest: " — built a network of AI agents for marketing analysis, strategy and brand emotion targeting (now deployed for clients)",
    },
    {
      lead: "Co-founder of Ximi4ka",
      rest: " — a STEM brand that found its product-market fit and shipped 20,000+ orders",
    },
  ],
  stats: [
    { value: "15,000+", label: "hours of practice", sub: "that's 1.71 years of non-stop work" },
    { value: "250+", label: "projects of varying complexity", sub: "" },
    { value: "81", label: "students taught web design", sub: "" },
  ],
  paragraphs: [
    "I hold a degree in medicine, but the urge to build good things, design systems and try what's new pulled me into web design back in 2015.",
    "To compete you have to be strong, bright and slightly reckless. I want to help strong projects reach the top — and be part of their story.",
    "Designer and marketer with experience building an online school with a seven-figure turnover. 15,000 hours of hands-on design and development practice.",
  ],
  logosNote: "Brands I've worked with along the way",
  metaTitle: "The Operator — Vasily Aistov, AICS-93",
  metaDescription:
    "One engineer-operator runs every AICS-93 project from brief to production: 10 years in design and marketing, 250+ projects, an AI engine instead of an agency team.",
};

/* ---------- shared /en chrome ---------- */

export const enChrome = {
  skip: "Skip to content",
  backToSite: "← home",
  discuss: "discuss a project",
  footerNav: [
    { label: "Services", href: "/en/services" },
    { label: "Operator", href: "/en/operator" },
    { label: "Русская версия", href: "/" },
  ],
  copyright: "AICS-93 · Vasily Aistov",
  heyAi: "Hey AI, learn about us →",
};
