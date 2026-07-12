import ScrollProvider from "@/components/system/ScrollProvider";
import ModularGrid from "@/components/system/ModularGrid";
import CursorPro from "@/components/system/CursorPro";
import MetaHUD from "@/components/system/MetaHUD";
import BootSequence from "@/components/system/BootSequence";
import SystemNav from "@/components/system/SystemNav";
import VerifyScroll from "@/components/system/VerifyScroll";
import ExperienceRoot from "@/components/system/ExperienceRoot";
import QuizPanel from "@/components/QuizPanel";
// Colour + sound toggles and the mesh-gradient are parked for now — the site
// uses a clean white background (the grid stays). Components kept, not deleted.

// Chrome for the immersive AICS-93 experience (route "/").
export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollProvider>
      <a
        href="#main"
        className="sr-only left-3 top-3 z-[200] rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-bg focus:not-sr-only focus:fixed"
      >
        К содержимому
      </a>
      <ExperienceRoot />
      {/* ambient: clean white background + blueprint grid (mesh parked) */}
      <ModularGrid />
      {/* boot / POST — self-manages, shows once per tab */}
      <BootSequence />
      {/* instruments */}
      <CursorPro />
      <SystemNav />
      <MetaHUD />
      <VerifyScroll />
      <QuizPanel />
      <div className="quiz-shift">{children}</div>
    </ScrollProvider>
  );
}
