// Сплошная (залитая) шестерёнка — inline-SVG силуэт для мест, где контурный
// ассет tild6638-313__gear.svg не подходит (например, круг-лого в шапке).
// Путь генерится детерминированной математикой на уровне модуля (SSR-safe).

const CX = 31;
const CY = 31;
const R_TOOTH = 30; // внешний радиус зубьев
const R_BODY = 23.5; // радиус тела
const R_HOLE = 9.5; // центральное отверстие
const TEETH = 12;

function buildGearPath(withHole: boolean): string {
  const step = (Math.PI * 2) / TEETH;
  const toothHalf = step * 0.24; // полширины зуба (по телу)
  const taper = step * 0.07; // сужение зуба к вершине
  const pt = (r: number, a: number) =>
    `${(CX + r * Math.cos(a)).toFixed(2)} ${(CY + r * Math.sin(a)).toFixed(2)}`;

  let d = "";
  for (let i = 0; i < TEETH; i++) {
    const t = -Math.PI / 2 + i * step;
    const p1 = pt(R_BODY, t - toothHalf);
    const p2 = pt(R_TOOTH, t - toothHalf + taper);
    const p3 = pt(R_TOOTH, t + toothHalf - taper);
    const p4 = pt(R_BODY, t + toothHalf);
    const nextStart = pt(R_BODY, t + step - toothHalf);
    d += i === 0 ? `M ${p1} ` : "";
    d += `L ${p2} L ${p3} L ${p4} A ${R_BODY} ${R_BODY} 0 0 1 ${nextStart} `;
  }
  d += "Z ";
  if (withHole) {
    // центральное отверстие (evenodd вырезает)
    d += `M ${CX + R_HOLE} ${CY} A ${R_HOLE} ${R_HOLE} 0 1 0 ${CX - R_HOLE} ${CY} A ${R_HOLE} ${R_HOLE} 0 1 0 ${CX + R_HOLE} ${CY} Z`;
  }
  return d;
}

const GEAR_PATH_HOLE = buildGearPath(true);
const GEAR_PATH_SOLID = buildGearPath(false);

export default function GearSolid({
  className,
  hole = true,
}: {
  className?: string;
  /** false → сплошной диск (для мелких размеров, где поверх лежит монограмма) */
  hole?: boolean;
}) {
  return (
    <svg viewBox="0 0 62 62" className={className} aria-hidden>
      <path d={hole ? GEAR_PATH_HOLE : GEAR_PATH_SOLID} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
