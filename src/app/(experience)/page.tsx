import NeuralHero from "@/components/NeuralHero";
import { Intro, Frameworks, Reasons, SalesEngine, About, Gantt, Bio } from "@/components/Sections";
import AiProcess from "@/components/AiProcess";
import Portfolio from "@/components/Portfolio";
import QuoteForm from "@/components/QuoteForm";
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
        <section className="mx-auto max-w-[1640px] px-6 py-8 sm:px-10 lg:px-16">
          <div className="mb-2 flex items-baseline gap-3">
            <span className="tech-label text-[11px] text-ink-soft">[ днк бренда ]</span>
            <span className="text-[13px] text-ink-soft">
              ребрендинг — это переписывание генетического кода бренда
            </span>
          </div>
          <div className="relative h-[320px] w-full sm:h-[400px]" aria-hidden>
            <DnaHelix className="absolute inset-0 h-full w-full" />
          </div>
        </section>
        <Frameworks />

        {/* ACT III — THE ENGINE / AI INTO YOUR PROCESSES */}
        <SignalTransition id="act-engine" index="03" label="// движок · ии в ваших процессах" />
        <Reasons />
        <AiProcess />
        <SalesEngine />

        {/* ACT IV — THE OPERATOR & THE PROOF */}
        <SignalTransition id="act-proof" index="04" label="// оператор · доказательства" />
        <About />
        <Portfolio />
        <Gantt />

        {/* ACT V — ORIGIN & INVITATION */}
        <SignalTransition id="act-origin" index="05" label="// исток · приглашение" />
        <Bio />
        <QuoteForm />
      </main>
      <Footer />
    </>
  );
}
