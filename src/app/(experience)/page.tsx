import NeuralHero from "@/components/NeuralHero";
import { Intro, Frameworks, Reasons, SalesEngine, About } from "@/components/Sections";
import AiProcess from "@/components/AiProcess";
import ConveyorBlock from "@/components/ConveyorBlock";
import PricingBlock from "@/components/PricingBlock";
// CaseSlider припаркован — блок работ теперь CaseShowcase (мокап Frame 1)
import CaseShowcase from "@/components/showcase/CaseShowcase";
import ContactConsole from "@/components/ContactConsole";
import ServicesTeaser from "@/components/ServicesTeaser";
import SolutionsTeaser from "@/components/SolutionsTeaser";
import BlogTeaser from "@/components/BlogTeaser";
import Footer from "@/components/Footer";
import SignalTransition from "@/components/system/SignalTransition";
import DnaHelix from "@/components/system/DnaHelix";

export default function Experience() {
  return (
    <>
      <main id="main">
        {/* ACT I — BOOT / THE SYMBIOSIS */}
        <NeuralHero />

        {/* ACT II — THE MIND / SECOND BRAIN */}
        <SignalTransition id="act-mind" index="02" label="// разум · второй мозг" />
        <Intro />
        {/* the brand's DNA — rebranding rewrites the genetic code */}
        <section className="mx-auto max-w-[1640px] px-6 py-[30px] sm:px-10 lg:px-16 lg:py-[50px]">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="tech-label text-[11px] text-ink-soft">[ днк бренда ]</span>
            <span className="text-[11px] text-ink-soft">
              ребрендинг — это переписывание генетического кода бренда
            </span>
          </div>
          <div
            className="relative h-[320px] w-full overflow-hidden rounded-[24px] border border-line bg-bg-soft/40 sm:h-[400px]"
            aria-hidden
          >
            <DnaHelix className="absolute inset-0 h-full w-full" />
          </div>
        </section>
        <Frameworks />

        {/* ACT III — THE ENGINE / AI INTO YOUR PROCESSES */}
        <SignalTransition id="act-engine" index="03" label="// движок · ии в ваших процессах" />
        <Reasons />
        <AiProcess />
        <ConveyorBlock />
        <SalesEngine />
        <ServicesTeaser />
        <SolutionsTeaser />
        <PricingBlock />

        {/* ACT IV — THE OPERATOR & THE PROOF */}
        <SignalTransition id="act-proof" index="04" label="// оператор · доказательства" compact />
        <About />
        <CaseShowcase />

        {/* ACT V — JOURNAL + INVITATION */}
        <SignalTransition id="act-origin" index="05" label="// журнал · приглашение" compact />
        <BlogTeaser />
        <ContactConsole />
      </main>
      <Footer />
    </>
  );
}
