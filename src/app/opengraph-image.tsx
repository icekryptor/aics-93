import { renderCoverOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "AICS-93 · Василий Аистов — сайты, фирменный стиль и ИИ под ключ за 7–14 дней";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderCoverOg({
    title: "Сайт и бренд под ключ за 7–14 дней",
    tag: "студия",
    meta: "Один инженер + ИИ-движок · сайты · фирменный стиль · ИИ в процессах",
    seed: "aics-93-home",
    accent: "#9747ff",
    eyebrow: "AICS-93 · Василий Аистов",
  });
}
