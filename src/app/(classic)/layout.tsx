import GradientBackground from "@/components/GradientBackground";
import GridBackground from "@/components/GridBackground";
import Cursor from "@/components/Cursor";
import ColorToggle from "@/components/ColorToggle";

// Chrome for the frozen classic edition — mirrors the original root layout.
export default function ClassicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GradientBackground />
      <GridBackground />
      <Cursor />
      <ColorToggle />
      {children}
    </>
  );
}
