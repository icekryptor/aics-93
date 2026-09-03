import ScrollProvider from "@/components/system/ScrollProvider";
import ModularGrid from "@/components/system/ModularGrid";
import CursorPro from "@/components/system/CursorPro";
import MetaHUD from "@/components/system/MetaHUD";
import BootSequence from "@/components/system/BootSequence";
import SystemNav from "@/components/system/SystemNav";
import VerifyScroll from "@/components/system/VerifyScroll";
import ExperienceRoot from "@/components/system/ExperienceRoot";
import SetDocumentLang from "@/components/system/SetDocumentLang";
import { EN_SYSTEMNAV, EN_BOOT } from "@/lib/en/system";

// Chrome for the immersive English homepage ("/en") — the same machinery as
// the Russian experience layout with EN dictionaries; QuizPanel is RU-only
// content and is deliberately not mounted here.
export default function EnExperienceLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollProvider>
      <SetDocumentLang lang="en" />
      <a
        href="#main"
        className="sr-only left-3 top-3 z-[200] rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-bg focus:not-sr-only focus:fixed"
      >
        Skip to content
      </a>
      <ExperienceRoot />
      {/* ambient: clean white background + blueprint grid (mesh parked) */}
      <ModularGrid />
      {/* boot / POST — self-manages, shows once per tab */}
      <BootSequence dict={EN_BOOT} />
      {/* instruments */}
      <CursorPro />
      <SystemNav dict={EN_SYSTEMNAV} />
      <MetaHUD />
      <VerifyScroll />
      <div className="quiz-shift">{children}</div>
    </ScrollProvider>
  );
}
