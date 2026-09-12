import defaults from "@/lib/brain-config.json";

/* Конфиг визуала мозга в хиро. Прод-версия живёт в src/lib/brain-config.json
   и попадает в бандл на сборке; стенд /panel/hero крутит значения вживую
   (событие BRAIN_CONFIG_EVENT) и кнопкой «запушить» коммитит новый JSON в
   main через /api/brain-config → автодеплой Vercel. */

export type BrainConfig = {
  /** доля точек на поверхности кортекса (остальное — тусклое ядро) */
  surfaceShare: number;
  /** базовая яркость ядра (0 — чёрное ядро, 1 — как кортекс) */
  coreDim: number;
  /** контраст рельефа: насколько борозды темнее гребней извилин */
  foldContrast: number;
  /** размер точки: дальняя / ближняя (px до dpr) */
  pointMin: number;
  pointMax: number;
  /** общая яркость облака */
  alpha: number;
  /** усиление светящегося силуэта */
  rimBoost: number;
  /** множитель яркости синапсов */
  lineAlpha: number;
  /** скорость вращения, рад/с */
  rotSpeed: number;
  /** амплитуда «дыхания» масштаба */
  breathe: number;
  /** базовый масштаб облака */
  scale: number;
  /** базовый наклон камеры, рад */
  pitch: number;
};

export const DEFAULT_BRAIN_CONFIG: BrainConfig = defaults as BrainConfig;

export const BRAIN_CONFIG_EVENT = "aics:brainconfig";

/* Границы значений — и для ползунков стенда, и для валидации в /api/brain-config */
export const BRAIN_CONFIG_LIMITS: Record<
  keyof BrainConfig,
  { min: number; max: number; step: number; label: string; group: string }
> = {
  surfaceShare: { min: 0.5, max: 1, step: 0.01, label: "точки на поверхности", group: "геометрия" },
  coreDim: { min: 0, max: 1, step: 0.01, label: "яркость ядра", group: "геометрия" },
  foldContrast: { min: 0, max: 1, step: 0.01, label: "контраст извилин", group: "геометрия" },
  pointMin: { min: 0.5, max: 6, step: 0.1, label: "точка: дальняя", group: "точки" },
  pointMax: { min: 1, max: 12, step: 0.1, label: "точка: ближняя", group: "точки" },
  alpha: { min: 0.2, max: 1.6, step: 0.02, label: "общая яркость", group: "точки" },
  rimBoost: { min: 0, max: 3, step: 0.05, label: "свечение силуэта", group: "точки" },
  lineAlpha: { min: 0, max: 3, step: 0.05, label: "яркость синапсов", group: "точки" },
  rotSpeed: { min: 0, max: 0.3, step: 0.005, label: "скорость вращения", group: "движение" },
  breathe: { min: 0, max: 0.08, step: 0.002, label: "дыхание", group: "движение" },
  scale: { min: 0.5, max: 1.4, step: 0.01, label: "масштаб", group: "движение" },
  pitch: { min: -0.6, max: 0.3, step: 0.01, label: "наклон", group: "движение" },
};

export const BRAIN_CONFIG_KEYS = Object.keys(BRAIN_CONFIG_LIMITS) as (keyof BrainConfig)[];

/** Полный валидный конфиг из чего угодно: не-числа → дефолт, числа зажимаются в границы. */
export function clampBrainConfig(raw: unknown): BrainConfig {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out = { ...DEFAULT_BRAIN_CONFIG };
  for (const k of BRAIN_CONFIG_KEYS) {
    const v = src[k];
    if (typeof v === "number" && Number.isFinite(v)) {
      const { min, max } = BRAIN_CONFIG_LIMITS[k];
      out[k] = Math.min(max, Math.max(min, v));
    }
  }
  return out;
}
