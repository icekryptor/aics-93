import type { Metadata } from "next";
import NeuralHero from "@/components/NeuralHero";
import { Intro, Frameworks } from "@/components/Sections";
import ReasonsLedger from "@/components/ReasonsLedger";
import AboutMe from "@/components/AboutMe";
import AiProcess from "@/components/AiProcess";
import EngineBlock from "@/components/EngineBlock";
import PricingBlock from "@/components/PricingBlock";
import CaseShowcase from "@/components/showcase/CaseShowcase";
import ContactConsole from "@/components/ContactConsole";
import ServicesTeaser from "@/components/ServicesTeaser";
import EnFooter from "@/components/EnFooter";
import SignalTransition from "@/components/system/SignalTransition";
import DnaHelix from "@/components/system/DnaHelix";
import JsonLd from "@/components/seo/JsonLd";
import { getAllServices } from "@/lib/en/services";
import { enHome, enContactDict } from "@/lib/en/content";
import {
  EN_HERO,
  EN_INTRO_STATEMENTS,
  EN_FRAMEWORKS_HEADER,
  EN_AI_PROCESS,
  EN_ENGINE,
  EN_SERVICES_TEASER,
  EN_PRICING,
  EN_ACTS,
} from "@/lib/en/home";
import {
  EN_REASONS,
  EN_REASONS_LABELS,
  EN_FRAMEWORKS,
  EN_FRAMEWORKS_LABELS,
  EN_ABOUT_FACTS,
  EN_ABOUT_STATS,
  EN_ABOUT_LABELS,
} from "@/lib/en/home-about";
import { EN_SHOWCASE_CASES, EN_SHOWCASE_LABELS } from "@/lib/en/showcase";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: enHome.metaTitle },
  description: enHome.metaDescription,
  alternates: {
    canonical: "/en",
    languages: { ru: "/", en: "/en", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/en",
    siteName: SITE_NAME,
    title: enHome.metaTitle,
    description: enHome.metaDescription,
  },
  twitter: { card: "summary_large_image", title: enHome.metaTitle, description: enHome.metaDescription },
};

// The immersive homepage, English payload — the exact composition of the
// Russian "/" experience with EN dictionaries. RU-only content blocks
// (solutions teaser, blog journal, quiz panel) are deliberately not mounted.
export default function EnExperience() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/en#studio`,
      name: "AICS-93",
      url: `${SITE_URL}/en`,
      inLanguage: "en",
      description: enHome.metaDescription,
      founder: { "@type": "Person", name: "Vasily Aistov" },
      areaServed: "Worldwide",
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <main id="main">
        {/* ACT I — BOOT / THE SYMBIOSIS */}
        <NeuralHero dict={EN_HERO} />

        {/* ACT II — THE MIND / SECOND BRAIN */}
        <SignalTransition id="act-mind" index="02" label={EN_ACTS.mind} />
        <Intro statements={EN_INTRO_STATEMENTS} />
        {/* the brand's DNA — rebranding rewrites the genetic code */}
        <section className="mx-auto max-w-[1640px] px-6 py-[30px] sm:px-10 lg:px-16 lg:py-[50px]">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="tech-label text-[11px] text-ink-soft">{EN_ACTS.dnaLabel}</span>
            <span className="text-[11px] text-ink-soft">{EN_ACTS.dnaCaption}</span>
          </div>
          <div
            className="relative h-[320px] w-full overflow-hidden rounded-[24px] border border-line bg-bg-soft/40 sm:h-[400px]"
            aria-hidden
          >
            <DnaHelix className="absolute inset-0 h-full w-full" />
          </div>
        </section>
        <Frameworks
          kicker={EN_FRAMEWORKS_HEADER.kicker}
          title={EN_FRAMEWORKS_HEADER.title}
          items={EN_FRAMEWORKS}
          carouselLabels={EN_FRAMEWORKS_LABELS}
          graphSeedLabel="strategy"
        />

        {/* ACT III — THE ENGINE / AI INTO YOUR PROCESSES */}
        <SignalTransition id="act-engine" index="03" label={EN_ACTS.engine} />
        <ReasonsLedger items={EN_REASONS} labels={EN_REASONS_LABELS} />
        <AiProcess dict={EN_AI_PROCESS} />
        <EngineBlock dict={EN_ENGINE} />
        <ServicesTeaser dict={EN_SERVICES_TEASER} items={getAllServices()} basePath="/en/services" />
        <PricingBlock dict={EN_PRICING} />

        {/* ACT IV — THE OPERATOR & THE PROOF */}
        <SignalTransition id="act-proof" index="04" label={EN_ACTS.proof} compact />
        <AboutMe facts={EN_ABOUT_FACTS} stats={EN_ABOUT_STATS} labels={EN_ABOUT_LABELS} />
        <CaseShowcase cases={EN_SHOWCASE_CASES} labels={EN_SHOWCASE_LABELS} />

        {/* ACT V — INVITATION */}
        <SignalTransition id="act-origin" index="05" label={EN_ACTS.origin} compact />
        <ContactConsole dict={enContactDict("контакт-консоль (EN главная)")} />
      </main>
      <EnFooter />
    </>
  );
}
