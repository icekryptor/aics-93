// English copy for the home "why branding" ledger, the frameworks carousel and
// the operator/about block. Mirrors the RU sources in lib/content.ts with the
// same ToV as lib/en/content.ts: numbers over epithets, first person, honest
// mechanics — no agency clichés.

import type { AboutFact, AboutMeLabels, AboutStat } from "@/components/AboutMe";
import type {
  FrameworkCarouselLabels,
  FrameworkItem,
} from "@/components/FrameworkCarousel";
import type { ReasonItem, ReasonsLedgerLabels } from "@/components/ReasonsLedger";

/* ---------- ReasonsLedger ---------- */

export const EN_REASONS: ReasonItem[] = [
  {
    tag: "control",
    title: "Your own channels, your own economics",
    text: "Marketplace terms leave your margin at someone else's discretion. Selling from channels you own puts the key metrics and cost lines back under your control.",
  },
  {
    tag: "organic",
    title: "Search on your own brand name",
    text: "Keywords that belong to you — the ones buyers use to find you specifically. Organic traffic grows on branded queries without the ad budget growing with it.",
  },
  {
    tag: "ROI",
    title: "Better numbers across the sales funnel",
    text: "A recognized brand raises return on ad spend in every channel, cuts through banner blindness, and gives LTV room to grow.",
  },
  {
    tag: "scale",
    title: "A multiplier on scaling",
    text: "A mature brand makes large contracts, press coverage, investment and collaborations easier to land.",
  },
  {
    tag: "legal",
    title: "Easier rights to defend",
    text: "Trademarks and intellectual property are far simpler to protect — the work you put in stays yours.",
  },
  {
    tag: "difference",
    title: "Standing apart, so the audience picks you",
    text: "A recognized brand with a reputation is a real argument for choosing your product when a buyer is comparing it against the alternatives.",
  },
];

export const EN_REASONS_LABELS: ReasonsLedgerLabels = {
  eyebrow: "[ why this pays off ]",
  titleRest: " reasons to put work into your brand",
  countLabel: "reasons",
};

/* ---------- FrameworkCarousel ---------- */

export const EN_FRAMEWORKS: FrameworkItem[] = [
  {
    n: "01",
    code: "PMF",
    full: "product market fit",
    text: "finding the niche in your market that your product closes perfectly",
  },
  {
    n: "02",
    code: "STP",
    full: "segmentation, targeting, positioning",
    text: "finding and positioning the brand for the audience segments already looking for your product",
  },
  {
    n: "03",
    code: "SWOT",
    full: "strengths, weaknesses, opportunities, threats",
    text: "weighing each hypothesis against the opportunities and the risks it carries",
  },
  {
    n: "04",
    code: "BMI",
    full: "brand maturity index",
    text: "how mature the brand is — the baseline for planning what to do with it next",
  },
  {
    n: "05",
    code: "JTBD",
    full: "jobs to be done",
    text: "the “job” customers hire your product to do — the language of real needs",
  },
  {
    n: "06",
    code: "CustDev",
    full: "customer development",
    text: "testing customer hypotheses through interviews — before money goes into the product",
  },
  {
    n: "07",
    code: "PDCA",
    full: "plan · do · check · act",
    text: "the continuous improvement loop: plan → do → check → correct",
  },
  {
    n: "08",
    code: "AARRR",
    full: "pirate metrics",
    text: "the funnel: acquisition, activation, retention, referral, revenue",
  },
  {
    n: "09",
    code: "4P",
    full: "product, price, place, promotion",
    text: "the base marketing mix for packaging an offer and taking it to market",
  },
  {
    n: "10",
    code: "PESTEL",
    full: "macro environment",
    text: "macro environment: political, economic, social, technological, environmental and legal factors",
  },
  {
    n: "11",
    code: "OKR",
    full: "objectives & key results",
    text: "ambitious objectives and measurable key results that keep the team focused",
  },
  {
    n: "12",
    code: "Lean",
    full: "lean canvas",
    text: "the business model on one page: hypotheses, metrics, channels and value",
  },
];

export const EN_FRAMEWORKS_LABELS: FrameworkCarouselLabels = {
  prev: "Previous",
  next: "Next",
  dotAriaPrefix: "Method",
};

/* ---------- AboutMe ---------- */

export const EN_ABOUT_FACTS: AboutFact[] = [
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
];

export const EN_ABOUT_STATS: AboutStat[] = [
  {
    target: 15000,
    prefix: ">",
    label: "hours of practice",
    sub: "that's 1.71 years of non-stop work",
    deco: "rings",
  },
  {
    target: 250,
    suffix: "+",
    label: "projects of varying complexity",
    sub: "",
    deco: "dots",
  },
  {
    target: 81,
    label: "students taught web design",
    sub: "",
    deco: "people",
  },
];

export const EN_ABOUT_LABELS: AboutMeLabels = {
  numberLocale: "en-US",
  badge: "WHO I AM",
  photoAlt: "Vasily Aistov",
  logosNote: "brands I've worked with",
};
