// English payload for the immersive homepage (/en) — dictionaries for the
// same components the Russian homepage renders. Layout is shared; only the
// text payload differs. ToV: numbers over epithets, first person, honest.

import type { NeuralHeroDict } from "@/components/NeuralHero";
import type { Seg } from "@/components/Sections";
import type { AiProcessDict } from "@/components/AiProcess";
import type { EngineBlockDict } from "@/components/EngineBlock";
import type { PricingBlockDict } from "@/components/PricingBlock";
import type { ServicesTeaserDict } from "@/components/ServicesTeaser";

/* ---------- ACT I · hero ---------- */

export const EN_HERO: NeuralHeroDict = {
  brainHint: "[ click the brain — switch state ]",
  eyebrow: "[ boot · brain and machine in symbiosis ]",
  h1Line1: "Brain and machine —",
  h1Line2Pre: "in ",
  h1Accent: "symbiosis",
  h1Line3: "for your brand.",
  subhead:
    "I fuse creative work with AI systems and wire them into company processes — so brands grow on data, not guesswork.",
  primaryCta: "Get a proposal",
  secondaryCta: "See the work",
  tgPre: "Or message me on ",
  tgLink: "Telegram",
  tgPost: " with “site review” — I'll come back with a structure and a price range within 24 hours.",
  studioBadge: "one-person studio",
  studioText:
    "I'm Vasily Aistov, co-founder / CMO at Ximi4ka. I build bold brands that stand out from competitors.",
  stats: [
    {
      big: "7–14 days",
      text: "from brief to launched website: the AI engine does the work of four specialists",
    },
    {
      big: "up to 70%",
      text: "budget saved vs a classic studio — the difference stays in your business",
    },
    {
      big: "10 yrs",
      text: "of cross-discipline practice: from marketing strategy to full-stack apps built from scratch",
    },
  ],
};

/* ---------- ACT II · intro statements (ScrollHighlight «лесенка») ---------- */

export const EN_INTRO_STATEMENTS: Seg[][] = [
  [
    { t: "I'm a " },
    { t: "multidisciplinary designer", hl: true },
    { t: " with hands-on " },
    { t: "business experience", hl: true },
    { t: ", real " },
    { t: "marketing", hl: true },
    { t: " skills and a record of shipping " },
    { t: "products", hl: true },
    { t: "." },
  ],
  [
    { t: "My job is to give your business a " },
    { t: "compelling shape", hl: true },
    { t: " that improves its " },
    { t: "key metrics", hl: true },
    { t: "." },
  ],
  [
    { t: "With " },
    { t: "AI", hl: true },
    { t: " my hands are untied: I've fused " },
    { t: "creativity with machine analysis", hl: true },
    { t: " to get the " },
    { t: "most precise results", hl: true },
    { t: "." },
  ],
];

export const EN_FRAMEWORKS_HEADER = {
  kicker: "Frameworks and methodologies I work with:",
  title: "Data, not guesswork",
};

/* ---------- ACT III · engine ---------- */

export const EN_AI_PROCESS: AiProcessDict = {
  eyebrow: "[ ai in your processes ]",
  titlePre: "AI isn't a tool. ",
  titleAccent: "It's the core",
  titlePost: " that drives every process.",
  subhead:
    "I embed a network of AI agents into company processes — from content and analytics to sales and hiring. One connected loop: data flows into the core, decisions flow back to every node.",
  mediaSrOnly:
    "Animation: a central processor core with glowing traces connecting peripheral nodes — marketing, content, sales, analytics, support and hiring. The signal circulates between the core and the nodes.",
  posterAlt: "Process diagram: a processor core and peripheral nodes",
  beforeLabel: "BEFORE",
  beforeItems: ["manual processes", "scattered data", "gut-feel decisions"],
  afterLabel: "AFTER",
  afterItems: ["agents in every node", "one data stream", "decisions on data"],
  chips: [
    { n: "−70%", l: "routine work" },
    { n: "×3", l: "decision speed" },
    { n: "24/7", l: "agents" },
    { n: "1", l: "source of truth" },
  ],
  disclaimer: "* Figures are illustrative and depend on each company's processes.",
};

export const EN_ENGINE: EngineBlockDict = {
  eyebrow: "[ engine · the mechanics of speed ]",
  titlePre: "How one engineer does ",
  titleAccent: "the work of four",
  subhead:
    "Agents compile the brief and market-analysis data, the design system generates pages in your brand style, integrations connect through readable APIs. That's why 7–14 days and budgets up to 70% lower aren't a discount — it's a different cost of production.",
  roles: ["analyst", "copywriter", "designer", "developer"],
  honestPre: "This is not a template generator: the engine assembles against your design system, and ",
  honestStrong: "I review every line before production",
  honestPost: ". If a site builder would solve your task faster — I'll say so right at the brief.",
  log: [
    { cmd: true, text: "pipeline.start — brief · meaning extraction · audit", when: "day 0–1" },
    { text: "competitor & audience research → strategy", when: "days 1–3" },
    { text: "harness system · training sub-agents on BI", when: "days 3–4" },
    { text: "design concept — by hand, by me", when: "days 4–6" },
    { text: "design system digitized · prototype", when: "days 6–8" },
    { text: "build: react/next.js · ts/python/postgres", when: "days 8–12" },
    { cmd: true, text: "deploy MVP --prod · E2E tests", when: "day 7–14 ✓" },
  ],
  logFooter: "every line reviewed by hand · after launch: harness handover + a month of support",
};

export const EN_SERVICES_TEASER: ServicesTeaserDict = {
  eyebrow: "[ services · what I do ]",
  titlePre: "I build the ",
  titleAccent: "brand, the site and the system",
  titlePost: " on data and AI",
  allLink: "all services →",
  cardTag: "service",
  cardMoreOverlay: "details →",
  cardMore: "read more →",
};

export const EN_PRICING: PricingBlockDict = {
  eyebrow: "[ packages · pricing & terms ]",
  titlePre: "Prices ",
  titleAccent: "before the brief",
  titlePost: ", not after",
  subhead:
    "The final quote depends on scope and project hours — I calculate it from the work breakdown and fix it in the contract before we start. Base rates are public:",
  products: [
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
        "harness handover with docs + a month of support",
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
      title: "Process digitization & automation",
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
  detailsLink: "full breakdown →",
  terms: [
    "50 / 50 payment",
    "official contract & invoicing",
    "deadlines backed by penalties",
    "performance metrics in the contract",
  ],
  cta: "Get a quote",
};

/* ---------- act labels (SignalTransition) & DNA caption ---------- */

export const EN_ACTS = {
  mind: "// the mind · second brain",
  engine: "// the engine · ai in your processes",
  proof: "// the operator · the proof",
  origin: "// journal · invitation",
  dnaLabel: "[ brand dna ]",
  dnaCaption: "a rebrand rewrites the brand's genetic code",
};
