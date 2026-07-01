import NeuralHero from "@/components/NeuralHero";
import { Intro, Frameworks, Reasons, SalesEngine, About, Gantt, Bio } from "@/components/Sections";
import AiProcess from "@/components/AiProcess";
import Portfolio from "@/components/Portfolio";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";

// Act divider — a labelled "signal seam" reinforcing the narrative spine:
// the site is the boot-and-run of one cyberhuman operating system.
function ActSeam({ index, title }: { index: string; title: string }) {
  return (
    <div className="mx-auto flex max-w-[1640px] items-center gap-4 px-6 py-2 sm:px-10 lg:px-16">
      <span className="font-display text-[11px] tabular-nums text-ink-soft">{index}</span>
      <span className="tech-label text-[11px] text-ink-soft">{title}</span>
      <span className="signal-seam h-px flex-1" aria-hidden />
    </div>
  );
}

export default function Experience() {
  return (
    <>
      <main>
        {/* ACT I — BOOT / THE SYMBIOSIS */}
        <NeuralHero />

        {/* ACT II — THE MIND / SECOND BRAIN */}
        <ActSeam index="02" title="// разум · второй мозг" />
        <Intro />
        <Frameworks />

        {/* ACT III — THE ENGINE / AI INTO YOUR PROCESSES */}
        <ActSeam index="03" title="// движок · ии в ваших процессах" />
        <Reasons />
        <AiProcess />
        <SalesEngine />

        {/* ACT IV — THE OPERATOR & THE PROOF */}
        <ActSeam index="04" title="// оператор · доказательства" />
        <About />
        <Portfolio />
        <Gantt />

        {/* ACT V — ORIGIN & INVITATION */}
        <ActSeam index="05" title="// исток · приглашение" />
        <Bio />
        <QuoteForm />
      </main>
      <Footer />
    </>
  );
}
