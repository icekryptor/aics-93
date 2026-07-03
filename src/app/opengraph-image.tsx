import { renderCoverOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "AICS-93 · Василий Аистов — ребрендинг и дизайн на миллионы";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderCoverOg({
    title: "Ребрендинг и дизайн на миллионы",
    tag: "студия",
    meta: "Бренд · ИИ в процессах · сайты · брендбук",
    seed: "aics-93-home",
    accent: "#9747ff",
    eyebrow: "AICS-93 · Василий Аистов",
  });
}
