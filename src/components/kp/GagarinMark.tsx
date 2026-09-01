/* Эмблема школы «Гагарин»: орбита с пунктирной траекторией + звезда.
   Набросок в палитре КП — если школа пришлёт свой логотип, меняем на него.
   tone: dark — на тёмной сцене, paper — на светлом листе документа. */

export default function GagarinMark({
  tone = "dark",
  size = 56,
}: {
  tone?: "dark" | "paper";
  size?: number;
}) {
  const ring = tone === "paper" ? "var(--paper-accent)" : "var(--color-signal-2)";
  const trail = tone === "paper" ? "#b98ae8" : "var(--color-signal-cool)";
  const star = tone === "paper" ? "var(--paper-accent)" : "var(--color-signal)";
  const spark = tone === "paper" ? "#c98a12" : "#5fd9f5";

  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden className="shrink-0">
      <circle cx="28" cy="28" r="25" fill="none" stroke={ring} strokeWidth="1.5" />
      <path
        d="M 10 41 A 27 27 0 0 1 43 11"
        fill="none"
        stroke={trail}
        strokeWidth="1.5"
        strokeDasharray="3 5"
        opacity="0.75"
      />
      <path
        d="M28 13 L31.4 24.6 L43 28 L31.4 31.4 L28 43 L24.6 31.4 L13 28 L24.6 24.6 Z"
        fill={star}
      />
      <circle cx="43" cy="11" r="2.8" fill={spark} />
    </svg>
  );
}
