// Fixed dashed grid pattern with highlighted intersection crosses.
// Sits behind all content and does not scroll.
export default function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <svg className="h-full w-full">
        <defs>
          <pattern id="aics-grid" width="208" height="208" patternUnits="userSpaceOnUse">
            {/* dashed grid lines through the tile centre */}
            <line
              x1="104" y1="0" x2="104" y2="208"
              stroke="rgba(22,18,29,0.07)" strokeWidth="1" strokeDasharray="2 8"
            />
            <line
              x1="0" y1="104" x2="208" y2="104"
              stroke="rgba(22,18,29,0.07)" strokeWidth="1" strokeDasharray="2 8"
            />
            {/* subtle intersection cross */}
            <path
              d="M98 104 H110 M104 98 V110"
              stroke="rgba(22,18,29,0.12)" strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#aics-grid)" />
      </svg>
    </div>
  );
}
