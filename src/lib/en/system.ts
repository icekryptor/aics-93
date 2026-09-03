// English copy for the system chrome of the immersive home page:
// the floating nav (SystemNav) and the boot overlay (BootSequence).
// Anchors, hrefs and section ids are identical to the RU version.

import type { SystemNavDict } from "@/components/system/SystemNav";
import type { BootSequenceDict } from "@/components/system/BootSequence";

export const EN_SYSTEMNAV: SystemNavDict = {
  links: [
    { label: "mind", href: "#how" },
    { label: "processes", href: "#ai" },
    { label: "work", href: "#prtf" },
    { label: "operator", href: "#exp" },
    { label: "contact", href: "#upgrade" },
  ],
  logoAria: "AICS-93 — back to top",
  navAria: "Navigation",
  services: "services",
  solutions: "solutions",
  blog: "journal",
  // RU «КП» — the quote request button; same #upgrade anchor
  kp: "quote",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  // /en has no solutions or journal yet — empty href hides the item
  servicesHref: "/en/services",
  solutionsHref: "",
  blogHref: "",
};

// The boot log is latin/tech by design and reads the same in both versions —
// kept here so the /en page owns its own copy of the overlay text.
export const EN_BOOT: BootSequenceDict = {
  logLines: [
    "initializing neural interface",
    "calibrating agent mesh",
    "linking cortex ⇄ silicon",
    "mounting knowledge base",
    "VASILY AISTOV // AICS-93 online",
  ],
  skipHint: "press esc / click to skip",
};
