import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import { Intro, Frameworks, Reasons, SalesEngine, About, Gantt, Bio } from "@/components/Sections";
import Portfolio from "@/components/Portfolio";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";

// Frozen "classic" edition of the site (the pre-immersive lab-tech design),
// preserved at /classic. The immersive experience lives at /.
export default function ClassicHome() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Frameworks />
        <Reasons />
        <SalesEngine />
        <About />
        <Portfolio />
        <Gantt />
        <Bio />
        <QuoteForm />
      </main>
      <Footer />
    </>
  );
}
