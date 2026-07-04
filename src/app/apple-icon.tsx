import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon — larger, rounded padding for home-screen bookmarks.
export default async function AppleIcon() {
  const font = await readFile(join(process.cwd(), "src/lib/og-fonts/Unbounded-Bold.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #9747ff 0%, #6703ff 100%)",
          color: "#ffffff",
          fontFamily: "Unbounded",
          fontSize: 104,
          fontWeight: 700,
        }}
      >
        A
      </div>
    ),
    { ...size, fonts: [{ name: "Unbounded", data: font.buffer.slice(font.byteOffset, font.byteOffset + font.byteLength) as ArrayBuffer, weight: 700, style: "normal" }] },
  );
}
