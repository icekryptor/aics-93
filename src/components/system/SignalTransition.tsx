"use client";

type SignalTransitionProps = {
  label?: string;
  index?: string;
  id?: string;
  compact?: boolean;
};

// Act seam — deliberately quiet. A mono label, a thin hairline with a soft
// violet segment that slowly "breathes" (CSS only, no canvas/rAF), and three
// static tick nodes. Reduced-motion: the breathing is disabled globally by the
// animation guard in globals.css.
export default function SignalTransition({ label, index, id, compact }: SignalTransitionProps) {
  return (
    <div
      id={id}
      className="relative mx-auto w-full max-w-[1640px] scroll-mt-24 px-6 sm:px-10 lg:px-16"
      style={{ height: compact ? 72 : 104 }}
    >
      <div className="flex h-full items-center gap-4">
        {(index || label) && (
          <span className="tech-label shrink-0 text-[11px] text-ink-soft">
            {index && <span className="mr-2 opacity-50">{index}</span>}
            {label}
          </span>
        )}
        <span className="relative block h-px flex-1 overflow-hidden bg-line" aria-hidden>
          <span className="seam-breath absolute inset-y-0 left-0 w-full" />
        </span>
        {/* three static tick nodes */}
        <span className="flex shrink-0 items-center gap-1.5" aria-hidden>
          <span className="size-[3px] rounded-full bg-ink/25" />
          <span className="size-[3px] rounded-full bg-ink/40" />
          <span className="size-[3px] rounded-full bg-accent/60" />
        </span>
      </div>
    </div>
  );
}
