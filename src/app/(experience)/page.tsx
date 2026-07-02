import NeuralHero from "@/components/NeuralHero";
import { Intro, Frameworks, Reasons, SalesEngine, About, Gantt, Bio } from "@/components/Sections";
import AiProcess from "@/components/AiProcess";
import Portfolio from "@/components/Portfolio";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";
import SignalTransition from "@/components/system/SignalTransition";
import MoleculeViz from "@/components/system/MoleculeViz";

export default function Experience() {
  return (
    <>
      <main>
        {/* ACT I — BOOT / THE SYMBIOSIS */}
        <NeuralHero />

        {/* ACT II — THE MIND / SECOND BRAIN */}
        <SignalTransition index="02" label="// разум · второй мозг" />
        <Intro />
        {/* brand & creativity as a living polymer form */}
        <section className="mx-auto max-w-[1640px] px-6 py-6 sm:px-10 lg:px-16" aria-hidden>
          <div className="relative h-[300px] w-full sm:h-[360px]">
            <MoleculeViz className="absolute inset-0 h-full w-full" />
            <span className="tech-label absolute left-0 top-0 text-[11px] text-ink-soft">
              [ бренд · форма креатива ]
            </span>
          </div>
        </section>
        <Frameworks />

        {/* ACT III — THE ENGINE / AI INTO YOUR PROCESSES */}
        <SignalTransition index="03" label="// движок · ии в ваших процессах" />
        <Reasons />
        <AiProcess />
        <SalesEngine />

        {/* ACT IV — THE OPERATOR & THE PROOF */}
        <SignalTransition index="04" label="// оператор · доказательства" />
        <About />
        <Portfolio />
        <Gantt />

        {/* ACT V — ORIGIN & INVITATION */}
        <SignalTransition index="05" label="// исток · приглашение" />
        <Bio />
        <QuoteForm />
      </main>
      <Footer />
    </>
  );
}
