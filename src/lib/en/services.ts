// English services registry — one entry per offering. Mirrors src/lib/services.ts
// (types are reused from there) with English slugs and copy. No quizzes, no see-also
// in v1, so `ctaQuiz`, `quiz` and `seeAlso` are intentionally absent.

import type { Service } from "@/lib/services";

/** EN slug → RU slug (asset/analytics parity with the Russian pages) */
export const enToRuSlug: Record<string, string> = {
  "web-development": "razrabotka-sajtov",
  "brand-identity": "firmennyj-stil",
  "web-apps": "razrabotka-servisov",
  "ai-integration": "integraciya-ii",
};

/** RU slug → EN slug */
export const ruToEnSlug: Record<string, string> = {
  "razrabotka-sajtov": "web-development",
  "firmennyj-stil": "brand-identity",
  "razrabotka-servisov": "web-apps",
  "integraciya-ii": "ai-integration",
};

export const services: Service[] = [
  {
    slug: "web-development",
    order: "01",
    nav: "Web development",
    card: { video: "/media/how-it-works.mp4", poster: "/media/how-it-works.jpg" },
    pipeline: ["brief", "research", "wireframe", "concept", "system", "build", "launch", "support", "analytics"],
    gantt: {
      project: "Example: multi-page site for a construction company",
      total: 14,
      phases: [
        { name: "Research and brief", days: 3, start: 0, color: "#ff3d92" },
        { name: "Wireframes and copywriting", days: 3, start: 3, color: "#d94fe6" },
        { name: "Design concept and system", days: 3, start: 6, color: "#b15cff" },
        { name: "Page build", days: 3, start: 9, color: "#8b67ff" },
        { name: "Testing, integrations, launch", days: 2, start: 12, color: "#5fd9f5" },
      ],
    },
    howItWorks: {
      lead: "AI is both the data source and the virtual contractor doing the work on the site",
      points: [
        "Everything starts from the project's BI: an audit of what you run today, competitor recon, ICP audience segments and a northstar strategy document.",
        "Subagents are specialised by role: marketing analyst, UX/UI architect, interface designer, frontend and backend agents.",
        "The core design concept I make by hand; Figma holds the sizes, states and animations of every design-system component.",
        "The production chain: northstar → marketing documentation → agent algorithms → style instructions → result in the project.",
        "I review every output by hand — corrections settle into the style instructions, and the agents learn from my decisions.",
        "Final MVP assembly, a joint E2E test and deploy; the harness is duplicated on your side together with the instructions.",
      ],
    },
    pricing: { usd: 1500, from: true },
    metaTitle: "Websites built end-to-end in 7–14 days — AI engine",
    metaDescription:
      "Websites built end-to-end in 7–14 days, up to 70% cheaper: landing pages that sell, corporate sites, stores. One engineer with an AI engine instead of four people, lightweight code, SEO/GEO and post-launch support. From $1,500 — get your project priced.",
    hero: {
      eyebrow: "service 01 / web development",
      h1: "A site of any complexity in 7–14 days. Up to 70% below a classic studio's budget",
      subhead:
        "While a classic studio spends three months on mockups, your site is already collecting leads. One specialist with the AI CORE does the work of four — faster, cheaper, and without giving up quality. Data instead of guesswork from the first conversation.",
      stats: [
        { value: "7–14", label: "days to launch" },
        { value: "up to 70%", label: "budget saved" },
        { value: "1 = 4", label: "one person with AI instead of four" },
        { value: "4 mo", label: "support after launch" },
      ],
      primaryCta: "Get an estimate",
      secondaryCta: "Discuss the project",
    },
    valueProps: [
      {
        title: "A site both a human and an AI can run",
        text: "Content is edited by you, your team or a neural agent — right inside the finished structure. No support tickets and no waiting on a contractor to swap a banner: a change takes minutes, not days.",
      },
      {
        title: "Loads as fast as the format allows",
        text: "Lightweight code, no bloated page builders. Pages fly, behavioural metrics improve, search engines and AI engines rank you higher. A fast site means cheaper traffic and higher conversion.",
      },
      {
        title: "No ceiling on complexity",
        text: "Catalogue, customer portal, calculators, integrations, non-standard logic — I build whatever the task needs. \"That's not possible\" isn't in my vocabulary: there are only timelines and budgets, not platform limits.",
      },
      {
        title: "A fraction of the cost to produce",
        text: "Fewer person-hours from fewer specialists. One person with AI covers the roles a studio charges four salaries for. That difference stays with you.",
      },
      {
        title: "Integrations connect in hours",
        text: "CRM, payments, analytics, chatbots, any service with a readable API — connected fast and cleanly. Your stack starts behaving like one organism instead of a pile of workarounds.",
      },
      {
        title: "Room to test hypotheses",
        text: "The design system and structure already exist — a new landing page, offer or A/B variant ships in hours. You test hypotheses with real money instead of arguing about them in meetings.",
      },
    ],
    process: [
      {
        title: "Audit and brief",
        detail:
          "I dig into the business, the goals, the product and your current metrics. We write down exactly what the site should bring in, in money.",
        benefit: "We start from your revenue, not from a template — no rebuilds halfway through",
        duration: "1–2 days",
      },
      {
        title: "Market research",
        detail:
          "Competitor analysis, JTBD, PMF hypotheses, ICP audience segments, traffic channels, STP hypotheses, tone of voice, comparative SWOT, summary, conclusions and recommendations, site requirements and spec.",
        benefit: "The site is built on data, not guesses — and lands with the customer first time",
        duration: "2–3 days",
      },
      {
        title: "Wireframing",
        detail:
          "A black-and-white wireframe prototype built strictly to the spec: structure, screens, navigation logic and user journeys.",
        benefit: "You see the skeleton and fix it before design — cheap and fast",
        duration: "1–2 days",
      },
      {
        title: "Design concept",
        detail: "Three visual directions, each shown on three key blocks taken from the wireframe.",
        benefit: "You pick a style from real options instead of guessing from a description",
        duration: "2 days",
      },
      {
        title: "Design system",
        detail:
          "I formalise the styles of the main elements, assemble the guidelines and load them in — one language for every page.",
        benefit: "From here the site grows by rules — fast and without visual chaos",
        duration: "1–2 days",
      },
      {
        title: "Page build",
        detail:
          "Pages are coded on lightweight code following the approved design system — fast, responsive, and ready for AI to manage.",
        benefit: "Every page ships ready for speed, search and easy editing",
        duration: "2–4 days",
      },
      {
        title: "Testing, integrations, launch",
        detail:
          "E2E testing of every user journey, services connected, SEO/GEO optimisation for search engines and AI engines, publication to production.",
        benefit: "You go live with a site that works for search and AI engines out of the box, with no bugs",
        duration: "2–3 days",
      },
      {
        title: "Technical support",
        detail:
          "Three months of support, training for your team on running content, and handover of the business manifests, instructions and prompts for managing the site through AI.",
        benefit: "You're not left alone with the site — you take over knowing how it works",
        duration: "3 months",
      },
      {
        title: "Analytics support",
        detail:
          "A month of weekly performance audits with improvements shipped against actual data on a PDCA cycle.",
        benefit: "The site isn't just launched, it's tuned to its maximum return",
        duration: "1 month",
      },
    ],
    deliverables: [
      {
        title: "A finished site in production",
        text: "Built, tested and published on lightweight code — tuned for speed, SEO and GEO, with services and analytics connected. Editable by humans and by AI.",
      },
      {
        title: "Design system and guidelines",
        text: "Formalised styles and rules — so new pages and hypotheses ship fast in one visual language, without reinventing the wheel.",
      },
      {
        title: "Market research report",
        text: "JTBD, ICP segments, PMF and STP hypotheses, SWOT, tone of voice, channel and competitor analysis, conclusions and spec — the evidence behind every decision and a working map of your growth.",
      },
      {
        title: "Manifests, instructions and prompts",
        text: "A kit for running the site with your own team and neural agents: how to handle content, what to edit, and with which prompts. Independence instead of dependence on a contractor.",
      },
      {
        title: "Team training",
        text: "I teach your team to run content and steer the site themselves — no contractor needed for every line of text.",
      },
      {
        title: "Analytics support report",
        text: "The results of a month of weekly audits with improvements already shipped, plus the next places conversion can grow.",
      },
    ],
    comparison: {
      rows: [
        { metric: "Time to launch", classic: "1.5–3 months or longer", aics: "7–14 days" },
        { metric: "Project budget", classic: "A full team's rate", aics: "Up to 70% lower" },
        { metric: "Team on the project", classic: "4+ specialists plus managers", aics: "One person with the AI CORE (1 = 4)" },
        {
          metric: "Testing hypotheses after launch",
          classic: "A new spec and weeks of waiting",
          aics: "Hours inside the existing design system",
        },
        {
          metric: "After launch",
          classic: "Delivered and forgotten, edits billed",
          aics: "4 months of support + prompts handed over",
        },
        {
          metric: "Cost of ownership",
          classic: "Edits go through the contractor and keep rising",
          aics: "Humans and AI both edit it, minimal spend",
        },
      ],
    },
    faq: [
      {
        q: "Why so fast — 7–14 days?",
        a: "The speed comes from method, not from rushing. One specialist with the AI CORE and a network of neural agents covers research, design and build without losing time to handoffs between four people. I work in a tuned PDCA process on top of a ready design system — what gets removed is idle time and routine, not stages.",
      },
      {
        q: "Won't quality suffer because of the speed and the price?",
        a: "The opposite. It's cheaper and faster because there are no surplus person-hours and no task handoffs between people — not because corners get cut. The site goes through E2E testing of every journey, SEO/GEO optimisation and a month of analytics auditing after launch. The saving is in the process, not in the result.",
      },
      {
        q: "What if my site is complex — catalogue, customer portal, integrations?",
        a: "There's no complexity ceiling. Catalogues, customer portals, calculators, non-standard logic and any service with a readable API get built on lightweight code. The more complex the project, the wider the gap in speed and budget in my favour against a classic studio.",
      },
      {
        q: "What happens after launch — am I left alone with the site?",
        a: "No. Three months of technical support and one month of analytics support are already in the project. I train your team to run content and hand over the business manifests, instructions and prompts — you take over knowingly and can edit the site yourself, or with neural agents, at any time.",
      },
      {
        q: "Where does the up-to-70% saving come from — what's the catch?",
        a: "There's no catch, there's arithmetic. In a classic studio the budget is the salaries of four-plus specialists plus weeks of them coordinating. Here one person with AI does the same volume because the routine is automated. Fewer people and fewer hours for the same result — and that difference stays with you.",
      },
      {
        q: "How much does it cost?",
        a: "The price depends on the tasks, the volume and the complexity — so I don't hang a number on it blindly, I price your specific project. Request an estimate: I'll go through the task and show you the timeline and the budget range before any work starts. Data instead of guesswork, from the first conversation.",
      },
    ],
    closing: {
      title: "A site that grows in organic search and turns traffic into leads",
      text: "While your competitor waits three months on a studio, you're already testing hypotheses and collecting leads. Launch in 7–14 days, budget up to 70% lower, support and handover included. Technology instead of a bloated headcount. Request an estimate — I'll price your project and show you how soon you go live.",
    },
  },
  {
    slug: "brand-identity",
    order: "02",
    nav: "Brand identity and design system",
    card: { video: "/media/brand-evolution.mp4", poster: "/media/brand-evolution.jpg" },
    heroVisual: "evolution",
    pipeline: ["brief", "research", "platform", "naming", "concept", "identity", "system", "assets", "support"],
    howItWorks: {
      lead: "AI is both the market researcher and the identity generator",
      video: {
        src: "/media/brand-evolution.mp4",
        poster: "/media/brand-evolution.jpg",
        label: "AI CORE · BRAND EVOLUTION",
        alt: "The AI core assembling a brand identity",
      },
      points: [
        "Agents compile the research data — the brand platform is built on facts about the market and the audience, not on taste.",
        "Logo, palette and typography options are generated in lockstep with the platform — every option means something instead of being random.",
        "The design system formalises the rules — assets get built from ready blocks with high precision.",
        "Neural agents produce layouts from the brand prompts: posts, decks and landing pages in one consistent style.",
        "The system holds consistency: checklists and reviews stop the brand from drifting.",
        "Manifests and prompts stay with you — you grow the brand yourself, without depending on a contractor.",
      ],
    },
    gantt: {
      project: "Example: brand identity + design system for a D2C brand",
      total: 14,
      phases: [
        { name: "Research and strategy", days: 3, start: 0, color: "#ff3d92" },
        { name: "Brand platform and naming", days: 2, start: 3, color: "#d94fe6" },
        { name: "Visual concept", days: 3, start: 5, color: "#b15cff" },
        { name: "Identity and design system", days: 4, start: 8, color: "#8b67ff" },
        { name: "Assets and rollout", days: 2, start: 12, color: "#5fd9f5" },
      ],
    },
    pricing: { usd: 1500 },
    metaTitle: "Brand identity and design system, end to end",
    metaDescription:
      "Brand identity and design system built end to end: strategy, logo, identity, brand book, guidelines and ready-made UI blocks. One specialist with AI instead of an agency — clear separation from competitors and growing recognition. Base price $1,500.",
    hero: {
      eyebrow: "service 02 / brand identity",
      h1: "Brand identity and a design system that set you apart on the market",
      subhead:
        "I build a brand as one coherent system of meaning and visuals — from strategy and identity to guidelines and ready-made blocks. Based on market research, not on taste. One specialist with the AI CORE does an agency's work — faster and cheaper.",
      stats: [
        { value: "from 10", label: "days to a brand book" },
        { value: "up to 70%", label: "budget saved" },
        { value: "1 = 4", label: "one person with AI instead of an agency" },
        { value: "1 system", label: "one visual language" },
      ],
      primaryCta: "Get an estimate",
      secondaryCta: "Discuss the project",
    },
    valueProps: [
      {
        title: "A brand as a system, not a logo",
        text: "Meaning, positioning, tone of voice and identity in one chain. The logo is only the tip; what works is the system, where everything speaks the same language.",
      },
      {
        title: "Built on data, not on taste",
        text: "A full research cycle — market, competitors, JTBD, audience segments. The brand lands with its audience first time because it stands on facts.",
      },
      {
        title: "A design system everything grows from",
        text: "Ready rules and blocks: site, ads, social, decks and packaging get assembled from the system in hours — fast and without visual chaos.",
      },
      {
        title: "Clear separation from competitors",
        text: "A recognisable brand cuts through banner blindness more easily, improves ad payback across every channel, and works for your market share.",
      },
      {
        title: "A fraction of the cost to produce",
        text: "One specialist with AI covers the roles an agency staffs with a whole team. AI speeds up research and option generation — that difference stays with you.",
      },
      {
        title: "Flexible and scalable",
        text: "The system is easy to extend to new products and channels without losing recognition. The brand grows with the business instead of being rebuilt from scratch.",
      },
    ],
    process: [
      {
        title: "Audit and brief",
        detail:
          "I dig into the business, the product, the audience and how the brand is perceived today. We write down the goals and how the brand should move sales.",
        benefit: "We start from the business problem, not from a pretty picture",
        duration: "1–2 days",
      },
      {
        title: "Market research",
        detail:
          "Competitor analysis, JTBD, ICP audience segments, STP hypotheses, perception, comparative SWOT, tone of voice, brand requirements and spec.",
        benefit: "The identity is built on data and separates you on purpose",
        duration: "2–3 days",
      },
      {
        title: "Brand platform",
        detail:
          "Positioning, values, character, brand promise and tone of voice — the frame of meaning the visuals grow out of.",
        benefit: "Meaning first, form second — not the other way round",
        duration: "1–2 days",
      },
      {
        title: "Naming and verbal style",
        detail:
          "Where it's needed: name, descriptor, tagline and brand language, all aligned with the platform.",
        benefit: "The brand sounds as coherent as it looks",
        duration: "1–2 days",
      },
      {
        title: "Visual concept",
        detail:
          "Three visual directions — logo, palette, typography, graphics — shown on the key assets.",
        benefit: "You pick a direction from real options instead of from a description",
        duration: "2–3 days",
      },
      {
        title: "Identity and logo",
        detail:
          "Finalising the mark, the logo, the colour palette, the typography and the brand's graphic elements.",
        benefit: "A finished, recognisable identity instead of \"roughly like this\"",
        duration: "2–3 days",
      },
      {
        title: "Design system and brand book",
        detail:
          "I formalise styles, components and usage rules, then assemble the guidelines and ready blocks — a single source of truth.",
        benefit: "From here everything is assembled from the system — fast and consistent",
        duration: "2–3 days",
      },
      {
        title: "Assets and rollout",
        detail:
          "The identity rolls out to the site, social, decks, documents and packaging; templates get prepared.",
        benefit: "The brand starts working at every touchpoint straight away",
        duration: "2–4 days",
      },
      {
        title: "Support",
        detail:
          "Brand support, team training and handover of the manifests, instructions and prompts for generating inside your design system.",
        benefit: "You grow the brand yourself and with AI, without depending on a contractor",
        duration: "1 month",
      },
    ],
    deliverables: [
      {
        title: "Brand platform",
        text: "Positioning, values, character, promise and tone of voice — the foundation of meaning under every decision.",
      },
      {
        title: "Logo and identity",
        text: "Logo, mark, palette, typography and graphic elements in ready formats for any medium.",
      },
      {
        title: "Design system and brand book",
        text: "Formalised styles, components and rules plus ready-made blocks — a single source of truth for the site, the ads and the product.",
      },
      {
        title: "Market research report",
        text: "JTBD, audience segments, competitor analysis, SWOT and tone of voice — the evidence behind every decision.",
      },
      {
        title: "Asset templates",
        text: "Ready templates for social, decks, documents and packaging — the brand gets assembled in minutes.",
      },
      {
        title: "Manifests, instructions and prompts",
        text: "A kit for growing the brand with your own team and neural agents — independence instead of dependence on a contractor.",
      },
    ],
    deliverablesTitle: "One visual language for the brand at every level",
    training: {
      title: "Training on working with the design system",
      text: "Receiving the system isn't enough — it has to be used every day. So the final stage of the project is training your team: how to live inside the guidelines, assemble assets from ready blocks, and generate new layouts with AI without diluting the brand.",
      points: [
        {
          title: "Guidelines in practice",
          text: "We go through the system's rules — logo, colour, typography, grids — on your real tasks, not on abstract examples.",
        },
        {
          title: "Assembly from ready blocks",
          text: "Posts, decks, landing pages and documents get built from system components in minutes — I teach the team to do it themselves.",
        },
        {
          title: "Generating with AI from prompts",
          text: "I hand over the brand prompts and manifests: neural agents produce layouts in your style, and the team only signs off on the work.",
        },
        {
          title: "Consistency control",
          text: "A layout review checklist and a review process: the brand doesn't drift, even when ten different pairs of hands make the content.",
        },
      ],
    },
    comparison: {
      rows: [
        { metric: "Time to a brand book", classic: "1–2 months or longer", aics: "From 10 days" },
        { metric: "Project budget", classic: "A full agency rate", aics: "Up to 70% lower" },
        { metric: "Team on the project", classic: "Strategist, designers, managers", aics: "One person with the AI CORE (1 = 4)" },
        { metric: "Basis for decisions", classic: "Visual instinct and taste", aics: "Research data plus taste" },
        { metric: "What you get", classic: "A logo and a PDF deck", aics: "A design system plus ready blocks" },
        { metric: "After handover", classic: "Delivered and forgotten", aics: "Support plus prompts for generating" },
      ],
    },
    faq: [
      {
        q: "How is this different from just a logo?",
        a: "The logo is the tip. I build a system: strategy, character, tone of voice, identity and a design system with ready blocks. All of the brand's visuals grow out of it — site, ads, social, packaging — and speak one language.",
      },
      {
        q: "Why so fast — from 10 days?",
        a: "The speed comes from method, not from rushing. One specialist with the AI CORE covers research, strategy and design without losing time to coordination inside an agency team. AI speeds up the research and the generation of options — what gets removed is routine, not stages.",
      },
      {
        q: "Won't quality suffer because of the price and the timeline?",
        a: "The opposite. It's cheaper because there are no surplus person-hours and no task handoffs between people — not because corners get cut. Every decision goes through the research and gets checked on real assets. The saving is in the process, not in the result.",
      },
      {
        q: "I already have a logo — can it be built on instead of started over?",
        a: "Yes. I audit the current identity and how it's perceived, keep what works and is recognisable, and build the missing parts — platform, design system, assets. A rebrand can be evolutionary rather than destructive.",
      },
      {
        q: "What is a design system and why do I need one?",
        a: "It's the brand's formalised rules and ready-made blocks — a single source of truth. With it, new layouts, landing pages and posts get assembled in hours and always look like you, instead of being reinvented each time. That's exactly what turns a set of pictures into a brand that scales.",
      },
      {
        q: "How much does it cost?",
        a: "The price depends on the scope: identity only, a full brand book, or brand plus assets. So I don't hang a number on it blindly, I price your specific project. Request an estimate — I'll go through the task and show you the timeline and budget range before the start.",
      },
    ],
    closing: {
      title: "A brand people recognise and choose",
      text: "While competitors swap logos, you get a system that works on recognition and market share. Strategy, identity, design system and support included. Technology instead of a bloated headcount. Request an estimate — I'll price your project.",
    },
  },
  {
    slug: "web-apps",
    order: "03",
    nav: "Web apps for business",
    card: { video: "/media/service-core.mp4", poster: "/media/service-core.jpg" },
    heroVisual: "service",
    pipeline: ["brief", "research", "journeys", "prototype", "system", "core", "integrations", "support", "analytics"],
    howItWorks: {
      lead: "AI is the core of the product: both the data source and the virtual contractor",
      video: {
        src: "/media/service-core.mp4",
        poster: "/media/service-core.jpg",
        label: "AI CORE · SERVICE ASSEMBLY",
        alt: "The AI core assembling a business web app",
      },
      points: [
        "Agents compile the data and the analysis results — and design and populate the product on top of them.",
        "Neural agents are built into the product's processes: request handling, analytics, recommendations, routine decisions.",
        "A custom harness admin panel keeps an obvious link between the data, the documents and the working logic.",
        "The interface design system generates screens and blocks with high precision.",
        "Lightweight code with no heavy platforms: fast integrations over readable APIs and performance in the green.",
        "UX analytics finds where conversion and usability can grow.",
      ],
    },
    pricing: { usd: 2000, from: true },
    metaTitle: "Custom web apps and CRM development for business",
    metaDescription:
      "Custom web apps, bespoke CRM, customer portals and dashboards for business: integrations, automation, AI agents, harness panel. One specialist with AI instead of a team — faster and cheaper than off-the-shelf integrators. From $2,000.",
    hero: {
      eyebrow: "service 03 / web apps",
      h1: "Web apps for business — from a dashboard to a portal, built on data and AI",
      subhead:
        "I design and build working products: dashboards, customer portals, calculators, portals, internal tools and automation with AI agents. On lightweight code, with readable APIs and a harness panel. One specialist with the AI CORE does a team's work — faster and cheaper.",
      stats: [
        { value: "from 14", label: "days to MVP" },
        { value: "up to 70%", label: "budget saved" },
        { value: "1 = 4", label: "one person with AI instead of a team" },
        { value: "24/7", label: "agents inside the product" },
      ],
      primaryCta: "Get an estimate",
      secondaryCta: "Discuss the project",
    },
    valueProps: [
      {
        title: "Functionality with no ceiling",
        text: "Dashboards, portals, calculators, integrations, roles and permissions, non-standard logic, AI agents inside the product — all built on lightweight code. \"That's not possible\" isn't in my vocabulary.",
      },
      {
        title: "A fast MVP, then iterations",
        text: "A working core first, then growth on top. Hypotheses get tested on real users in days instead of quarters.",
      },
      {
        title: "Integrations in hours",
        text: "CRM, payments, analytics, chatbots, your internal systems — connected over readable APIs, fast and cleanly. One organism instead of a zoo of services.",
      },
      {
        title: "AI inside the product, not bolted on",
        text: "Neural agents sit inside the processes: request handling, analytics, recommendations, routine. The product doesn't just store data — it makes decisions.",
      },
      {
        title: "Lower cost of ownership",
        text: "One specialist with AI covers the roles of a whole development team. Lightweight code without heavy platforms is cheaper to maintain and to grow.",
      },
      {
        title: "Transparency through the harness panel",
        text: "A custom admin panel keeps an obvious link between the data, the documents and the product's logic — you understand how it all works.",
      },
    ],
    process: [
      {
        title: "Audit and brief",
        detail:
          "I dig into the business, the processes, the users and the metrics. We write down what problem the product solves and what it brings in, in money.",
        benefit: "We start from the business problem, not from a set of screens",
        duration: "1–2 days",
      },
      {
        title: "Product research",
        detail:
          "Competitor analysis, JTBD, user segments, journeys, channels, comparative analysis, product requirements and spec.",
        benefit: "The product is built on data — and hits a real need",
        duration: "2–3 days",
      },
      {
        title: "Journey design",
        detail:
          "A map of user journeys, the data structure, roles and permissions, and the logic of transitions and states.",
        benefit: "The logic is thought through before design — cheap to fix on a diagram",
        duration: "2–3 days",
      },
      {
        title: "Prototype",
        detail: "An interactive black-and-white prototype of the key screens and journeys, to spec.",
        benefit: "You get your hands on the product before development",
        duration: "2–3 days",
      },
      {
        title: "Interface design system",
        detail:
          "I formalise components, states and rules — one interface language the screens get assembled from.",
        benefit: "From here functionality grows out of the system, fast and consistently",
        duration: "2–3 days",
      },
      {
        title: "Core development (MVP)",
        detail:
          "The functional core built on lightweight code following the approved design system: screens, data, business logic.",
        benefit: "You hold a working product, not mockups",
        duration: "5–10 days",
      },
      {
        title: "Integrations, AI agents, launch",
        detail:
          "Services and APIs connected, neural agents embedded, E2E testing of the journeys, SEO/GEO where it matters, deploy to production.",
        benefit: "The product goes into service coherent and bug-free",
        duration: "3–5 days",
      },
      {
        title: "Technical support",
        detail:
          "Three months of support, team training, and handover of the harness panel, the documentation, the business manifests and the prompts.",
        benefit: "You're not left alone with the product — you take over knowing how it works",
        duration: "3 months",
      },
      {
        title: "Analytics support",
        detail:
          "A month of weekly metric audits and improvements shipped against actual data on a PDCA cycle.",
        benefit: "The product gets tuned to its maximum return",
        duration: "1 month",
      },
    ],
    deliverables: [
      {
        title: "A working product in production",
        text: "Built, tested and published on lightweight code — with integrations, AI agents and analytics connected.",
      },
      {
        title: "Interface design system",
        text: "Components, states and rules — so new functionality gets assembled fast and in one language, without chaos.",
      },
      {
        title: "Harness control panel",
        text: "An admin panel linking data ↔ documents ↔ logic — transparent control over the product.",
      },
      {
        title: "Documentation and spec",
        text: "Journeys, data structure, APIs and requirements — a working base for growing the product further.",
      },
      {
        title: "AI agents and automation",
        text: "Neural agents built into the product, plus the prompts for tuning and extending them to your processes.",
      },
      {
        title: "Manifests, instructions and prompts",
        text: "A kit for growing the product with your own team and neural agents — independence instead of dependence on a contractor.",
      },
    ],
    comparison: {
      rows: [
        { metric: "Time to MVP", classic: "3–6 months or longer", aics: "From 14 days" },
        { metric: "Project budget", classic: "A dev team plus managers", aics: "Up to 70% lower" },
        { metric: "Team on the project", classic: "Analyst, designer, 2+ developers, PM", aics: "One person with the AI CORE (1 = 4)" },
        { metric: "AI in the product", classic: "A separate, expensive project", aics: "Built in from day one" },
        { metric: "Iterations after launch", classic: "Sprints and weeks of waiting", aics: "Hours inside the existing system" },
        { metric: "Cost of ownership", classic: "Heavy stack, expensive support", aics: "Lightweight code, humans and AI both edit it" },
      ],
    },
    faq: [
      {
        q: "What kinds of products do you build?",
        a: "Dashboards, customer portals, calculators, portals, internal tools, client-facing web apps and automation with AI agents. If a product has logic and data, I can build it.",
      },
      {
        q: "Why so fast — an MVP from 14 days?",
        a: "The speed comes from method, not from rushing. One specialist with the AI CORE covers research, design and development without losing time to coordination inside a team. A working core first, then growth on top — what gets removed is routine and idle time, not stages.",
      },
      {
        q: "How complex can the logic get?",
        a: "Roles and permissions, payments, non-standard calculations, integrations, AI agents — all built on lightweight code. The more complex the product, the wider the gap in speed and budget in my favour against a classic team.",
      },
      {
        q: "What about integrations and my existing systems?",
        a: "Any service with a readable API connects fast and cleanly — CRM, payments, analytics, your internal systems. The stack starts behaving like one organism instead of a pile of workarounds.",
      },
      {
        q: "And support and growth after launch?",
        a: "Three months of technical and one month of analytics support are already in the project. I hand over the harness panel, the documentation and the prompts, and train the team — you grow the product yourself, or with neural agents.",
      },
      {
        q: "How much does it cost?",
        a: "It depends on the scope and complexity: an MVP, a full product, or a system with integrations and AI. So I don't hang a number on it blindly, I price your specific project. Request an estimate — I'll show you the timeline and the budget range before the start.",
      },
    ],
    closing: {
      title: "A product that works for the business instead of sitting in a shop window",
      text: "While competitors spend six months assembling a team, you're already running a working product and iterating on data. An MVP in weeks, budget up to 70% lower, AI and support included. Technology instead of a bloated headcount. Request an estimate — I'll price your project.",
    },
  },
  {
    slug: "ai-integration",
    order: "04",
    nav: "AI integration and digitisation",
    card: { video: "/media/process-flow.mp4", poster: "/media/process-flow.jpg" },
    heroVisual: "service",
    pipeline: ["audit", "process map", "prioritisation", "design", "mvp module", "integrations", "agents", "dashboards", "training"],
    howItWorks: {
      lead: "AI conducts the processes: from the signal coming in to the product going out",
      video: {
        src: "/media/process-flow.mp4",
        poster: "/media/process-flow.jpg",
        label: "AI CORE · PROCESS OPTIMIZATION",
        alt: "The AI core running a production process: from incoming signals to shipped output",
      },
      points: [
        "The AI core takes the incoming signals — requests, orders, sensor and system data — and issues commands to the processes.",
        "Inside the production \"box\", agents run the operations: planning, task allocation, quality control.",
        "The harness panel holds the link between data ↔ documents ↔ logic: every stage from input to output is visible.",
        "What comes out the other end is finished: goods, documents and reports reach their recipient with no manual routine.",
        "Dashboards show the flow in real time: bottlenecks, idle time and the person-hours saved.",
        "The algorithms are set up for continuous improvement: each cycle makes the process more accurate and cheaper.",
      ],
    },
    pricing: { usd: 2000, from: true },
    metaTitle: "AI integration for business, end to end — agents, bots, automation",
    metaDescription:
      "AI integration for business, end to end: AI agents, chatbots and process digitisation delivered module by module — training, intranets, document builders, automated funnels, dashboards. Up to 70% of person-hours saved. From $2,000 — request an estimate and I'll calculate the effect.",
    hero: {
      eyebrow: "service 04 / ai integration",
      h1: "AI integration and process digitisation: up to 70% of person-hours saved",
      subhead:
        "I build AI into your processes module by module — from staff training and SOPs to automated funnels, dashboards and controls. On lightweight code, with a harness panel and transparent logic. Any automation or digitisation idea can be built.",
      stats: [
        { value: "up to 70%", label: "person-hours saved" },
        { value: "24/7", label: "agents work without days off" },
        { value: "from 7", label: "days to the first module" },
        { value: "1 = 4", label: "one person with AI instead of a team" },
      ],
      primaryCta: "Get an estimate",
      secondaryCta: "Discuss the project",
    },
    modules: {
      note: "Any automation or digitisation idea can be built: if a process has data and logic, I can build a module for it.",
      items: [
        {
          title: "Training, assessment, crowdsourcing",
          text: "Learning platforms, simulators and tests for staff and customers: onboarding without supervisors, knowledge checks, and idea and feedback collection in one loop.",
        },
        {
          title: "Intranets, SOPs and standards",
          text: "A living company knowledge base: SOPs, standards and instructions tied to the actual processes. A new hire finds the answer instead of interrupting colleagues.",
        },
        {
          title: "Document builders, routine automation",
          text: "Proposals, contracts, reports and SOPs get assembled from templates and data in minutes. The routine that used to be done by hand goes to the agents.",
        },
        {
          title: "Automated funnels, diagnostics, lead gen",
          text: "Quizzes, diagnostic blocks and nurture flows: the lead arrives already qualified, with a brief and a clear next step.",
        },
        {
          title: "Dashboards and analytics",
          text: "Business metrics on one screen: sales, unit economics, advertising, production. Decisions on data instead of on gut feel.",
        },
        {
          title: "Team performance visibility",
          text: "Transparent tasks, targets and quality of execution: you can see where the process stalls and who is overloaded — without micromanagement.",
        },
      ],
    },
    valueProps: [
      {
        title: "Up to 70% of person-hours saved",
        text: "The routine — data collection, documents, reports, answers to standard questions — goes to the agents. People work on what genuinely needs a person.",
      },
      {
        title: "Accuracy in actions and decisions",
        text: "Less human factor: the system doesn't forget, doesn't get tired and doesn't slip on the third shift. Decisions get made on data, not on what an employee remembers.",
      },
      {
        title: "Inefficiency becomes visible",
        text: "A digitised process highlights the bottlenecks: where requests get lost, tasks stall and money leaks. What you used to sense is now visible in numbers.",
      },
      {
        title: "Pipelines, harness panels, visualisation",
        text: "You see straight through the processes: stages, statuses, and the links between data and documents in one admin panel. You manage a system instead of a thread of messages.",
      },
      {
        title: "Understanding the process, then optimising it",
        text: "Digitising forces you to describe the process honestly — and half the optimisations turn up on the process map, before any code gets written.",
      },
      {
        title: "Lower costs, higher throughput",
        text: "The result in money: fewer person-hours per operation, a faster deal cycle, fewer losses. Every module gets a payback calculation before the start.",
      },
    ],
    process: [
      {
        title: "Process audit",
        detail:
          "I dig into the business: how sales, production, documents and communication actually work. We write down where the person-hours and the money go.",
        benefit: "We start from your economics, not from the AI trend",
        duration: "1–2 days",
      },
      {
        title: "Process map and automation points",
        detail:
          "I describe the processes as they are, find the bottlenecks and the points where automation gives the biggest effect.",
        benefit: "Half the optimisations are visible on the map — before any code",
        duration: "2–3 days",
      },
      {
        title: "Prioritisation by effect",
        detail:
          "I calculate each module's effect in person-hours and money, then order the rollout starting with the fastest payback.",
        benefit: "We build first whatever returns the money soonest",
        duration: "1–2 days",
      },
      {
        title: "Module design",
        detail:
          "Journeys, data structure, roles, integrations and logic for the first module. A spec that shows the result before development.",
        benefit: "Fixes on a diagram are cheap — and you won't need them in the code",
        duration: "2–3 days",
      },
      {
        title: "Module MVP",
        detail:
          "The working core built on lightweight code: screens, data, business logic, the first agents.",
        benefit: "Within days the team holds a working tool, not a presentation",
        duration: "5–10 days",
      },
      {
        title: "Integrations and AI agents",
        detail:
          "The module gets connected to your systems (CRM, ERP, spreadsheets, messengers) over APIs, and agents get embedded into the processes.",
        benefit: "The stack behaves like one organism instead of a pile of workarounds",
        duration: "3–5 days",
      },
      {
        title: "Dashboards and controls",
        detail:
          "Module and process metrics go onto dashboards, with targets and alerts configured.",
        benefit: "The effect of the rollout is visible in numbers, not in claims",
        duration: "2–3 days",
      },
      {
        title: "Training and support",
        detail:
          "I train the team and hand over the harness panel, the documentation and the prompts. Three months of support, plus the next modules in priority order.",
        benefit: "The system stays yours — no permanent retainer to an integrator",
        duration: "3 months",
      },
    ],
    bizCases: {
      title: "What this looks like in a live business",
      items: [
        {
          title: "Brand content engine",
          text: "A content engine running on the brand's tone of voice: SEO articles, product pages, posts and newsletters get assembled by agents from approved recipes, and a human only signs off.",
          metric: "10+ content units a day",
        },
        {
          title: "ERP and production harness panel",
          text: "Cost, margin and purchasing plans for every SKU in one panel: unit economics stops living in people's heads and scattered spreadsheets.",
          metric: "clear unit economics per SKU",
        },
        {
          title: "Learning platform with a simulator",
          text: "Training for customers and staff with interactive simulators and assessment: progress is visible in numbers, and supervisors aren't needed at every step.",
          metric: "hundreds of learners, no supervisors",
        },
        {
          title: "Document builder",
          text: "Proposals, contracts and SOPs get assembled from templates and CRM data in minutes — no copy-paste and no wrong details.",
          metric: "a document in 2 minutes instead of an hour",
        },
        {
          title: "Marketplace analytics",
          text: "The sales funnel and marketplace ad spend in one dashboard with auto-sync: every campaign's payback is visible daily instead of at month end.",
          metric: "ad payback, daily",
        },
        {
          title: "Automated funnel with quiz diagnostics",
          text: "A quiz qualifies the lead, collects the brief and sends it straight to the sales manager's chat: the sale starts from data instead of from \"tell me about your task\".",
          metric: "the lead arrives qualified",
        },
      ],
    },
    solutionBank: {
      title: "Solution bank",
      text: "Ready modules already proven in live businesses: your project gets assembled from them like blocks — faster and cheaper than from scratch. Custom logic gets written only where your specifics actually begin.",
      points: [
        "content engine",
        "harness panel",
        "document builder",
        "quiz funnel",
        "dashboards and reports",
        "learning modules and simulators",
        "API integrations",
        "AI agents inside processes",
      ],
    },
    deliverables: [
      {
        title: "Working modules in production",
        text: "Not a presentation and not a pilot, but tools the team uses every day — built, tested and rolled out.",
      },
      {
        title: "Harness control panel",
        text: "An admin panel linking data ↔ documents ↔ logic: transparent control over the whole system from one place.",
      },
      {
        title: "Process map and documentation",
        text: "Honestly described processes, automation points and priorities — a working digitisation map for months ahead.",
      },
      {
        title: "Dashboards and reporting",
        text: "Process metrics and the effect of the rollout in numbers: person-hours saved, cycle speed, bottlenecks.",
      },
      {
        title: "AI agents and prompts",
        text: "Agents tuned to your processes, plus the prompts and instructions for your team to grow them.",
      },
      {
        title: "Team training and support",
        text: "Three months of support, staff training and handover of control — the system stays yours.",
      },
    ],
    deliverablesTitle: "Not a turnkey-and-forever rollout, but a system that stays yours",
    comparison: {
      title: "A classic integrator and AICS-93",
      classicLabel: "classic integrator",
      rows: [
        { metric: "Time to first result", classic: "Months of turnkey rollout", aics: "First module from 7 days" },
        { metric: "Budget", classic: "An integrator's team plus licences", aics: "Up to 70% lower" },
        { metric: "Approach", classic: "An off-the-shelf system like everyone else's", aics: "Modules built for your processes" },
        { metric: "AI in the system", classic: "A chatbot bolted onto the processes", aics: "Agents inside the processes" },
        { metric: "Transparency", classic: "The contractor's black box", aics: "Harness panel and documentation" },
        { metric: "Owning the system", classic: "A retainer forever", aics: "The system is yours + prompts handed over" },
      ],
    },
    faq: [
      {
        q: "I don't know what to automate. Where do I start?",
        a: "With the audit and the process map. I describe how the business actually works, find the points where person-hours and money go, and calculate each module's effect in money. We start with the fastest payback — you don't need to arrive with a finished spec.",
      },
      {
        q: "We already have a CRM, an ERP and spreadsheets — do we throw it all out?",
        a: "No. What works stays: modules connect to your systems over APIs and grow around them. Digitisation isn't a move to a new platform, it's tying what you already have into one controllable loop.",
      },
      {
        q: "How safe is it to hand processes and data to AI?",
        a: "The data stays inside your perimeter, access is separated by roles, and the agents work to approved rules with a human at the control points. AI speeds up execution — the decisions and the accountability stay controllable.",
      },
      {
        q: "The staff won't accept it — won't everything break?",
        a: "That's exactly why the interfaces are simpler than the current routine, the rollout is module by module, and the team gets trained. When a system saves someone an hour a day instead of adding reporting, resistance ends quickly.",
      },
      {
        q: "Why module by module instead of everything at once?",
        a: "Because that way each step pays for itself. The first module ships in days, shows its effect in numbers and earns the trust that funds the next one. Big turnkey rollouts die in approvals — modules live and work.",
      },
      {
        q: "How much does it cost?",
        a: "It depends on the set of modules and the depth of the integrations. So I don't hang a number on it blindly: request an estimate below — I'll go through the task, calculate the effect and show you the budget range before any work starts.",
      },
    ],
    closing: {
      title: "Digitisation that pays back module by module",
      text: "Not a big rollout someday, but a first working module within days — with its effect in numbers and a clear queue of next steps. Up to 70% of person-hours saved, a harness panel, and a system that stays yours. Request an estimate — I'll calculate the effect for your business.",
    },
  },
];

export function getAllServices(): Service[] {
  return services;
}

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
