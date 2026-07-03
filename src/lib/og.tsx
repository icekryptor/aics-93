import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { flowFieldDataUri } from "./og-art";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Satori chokes on woff-wrapped / variable fonts ("reading '260'"), so we ship
// static, decompressed TTF instances generated from the app faces (see og-fonts/).
let fontCache: { neue: ArrayBuffer; neueBold: ArrayBuffer; display: ArrayBuffer } | null = null;

async function loadFonts() {
  if (fontCache) return fontCache;
  const dir = join(process.cwd(), "src/lib/og-fonts");
  const [neue, neueBold, display] = await Promise.all([
    readFile(join(dir, "NeueHaas-Medium.ttf")),
    readFile(join(dir, "NeueHaas-Bold.ttf")),
    readFile(join(dir, "Unbounded-Bold.ttf")),
  ]);
  const toAB = (b: Buffer) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
  fontCache = { neue: toAB(neue), neueBold: toAB(neueBold), display: toAB(display) };
  return fontCache;
}

type CoverArgs = {
  title: string;
  tag?: string;
  meta?: string;
  seed: string;
  accent: string;
  eyebrow?: string; // small line top-left, defaults to "AICS-93 · журнал"
};

/** Brand-styled generative OG card (1200×630) echoing the on-site flow-field covers. */
export async function renderCoverOg({
  title,
  tag,
  meta,
  seed,
  accent,
  eyebrow = "AICS-93 · журнал",
}: CoverArgs) {
  const fonts = await loadFonts();
  const bg = flowFieldDataUri({ seed, accent, w: OG_SIZE.width, h: OG_SIZE.height, density: 1 });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          backgroundColor: "#171029",
          fontFamily: "Neue Haas",
          padding: "64px 68px",
        }}
      >
        {/* generative art */}
        <img
          src={bg}
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          style={{ position: "absolute", top: 0, left: 0 }}
        />

        {/* top row: brand mark + tag */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: "rgba(255,255,255,0.94)",
                color: accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Unbounded",
                fontWeight: 700,
                fontSize: 26,
              }}
            >
              A
            </div>
            <div
              style={{
                color: "rgba(239,234,255,0.82)",
                fontSize: 21,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </div>
          </div>
          {tag ? (
            <div
              style={{
                display: "flex",
                color: "#171029",
                background: "rgba(255,255,255,0.92)",
                borderRadius: 999,
                padding: "9px 20px",
                fontSize: 20,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {tag}
            </div>
          ) : (
            <div />
          )}
        </div>

        {/* title block */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div
            style={{
              color: "#ffffff",
              fontFamily: "Unbounded",
              fontWeight: 700,
              fontSize: title.length > 52 ? 62 : 74,
              lineHeight: 1.04,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          {meta ? (
            <div
              style={{
                marginTop: 30,
                color: "rgba(239,234,255,0.72)",
                fontSize: 24,
                letterSpacing: 1,
              }}
            >
              {meta}
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Neue Haas", data: fonts.neue, weight: 500, style: "normal" },
        { name: "Neue Haas", data: fonts.neueBold, weight: 700, style: "normal" },
        { name: "Unbounded", data: fonts.display, weight: 700, style: "normal" },
      ],
    },
  );
}
