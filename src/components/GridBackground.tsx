// Fixed dashed grid pattern with highlighted intersection crosses.
// Sits behind all content and does not scroll.
export default function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <svg className="h-full w-full">
        <defs>
          <pattern id="aics-grid" width="104" height="104" patternUnits="userSpaceOnUse">
            {/* dashed grid lines through the tile centre */}
            <line
              x1="52" y1="0" x2="52" y2="104"
              stroke="rgba(22,18,29,0.10)" strokeWidth="1" strokeDasharray="2 7"
            />
            <line
              x1="0" y1="52" x2="104" y2="52"
              stroke="rgba(22,18,29,0.10)" strokeWidth="1" strokeDasharray="2 7"
            />
            {/* highlighted intersection cross */}
            <path
              d="M44 52 H60 M52 44 V60"
              stroke="rgba(22,18,29,0.28)" strokeWidth="1.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#aics-grid)" />
      </svg>
    </div>
  );
}
