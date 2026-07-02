import ScrollProvider from "@/components/system/ScrollProvider";
import ShaderBackground from "@/components/system/ShaderBackground";
import NeuralField from "@/components/system/NeuralField";
import CursorPro from "@/components/system/CursorPro";
import MetaHUD from "@/components/system/MetaHUD";
import BootSequence from "@/components/system/BootSequence";
import SystemNav from "@/components/system/SystemNav";
import VerifyScroll from "@/components/system/VerifyScroll";
import ExperienceRoot from "@/components/system/ExperienceRoot";
import SoundToggle from "@/components/system/SoundToggle";
import ColorToggle from "@/components/ColorToggle";

// Chrome for the immersive AICS-93 experience (route "/").
export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollProvider>
      <ExperienceRoot />
      {/* ambient world (fixed, behind everything) */}
      <ShaderBackground />
      <NeuralField />
      {/* boot / POST — self-manages, shows once per tab */}
      <BootSequence />
      {/* instruments */}
      <CursorPro />
      <SystemNav />
      <MetaHUD />
      <ColorToggle />
      <SoundToggle />
      <VerifyScroll />
      {children}
    </ScrollProvider>
  );
}
