import { renderCoverOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Журнал AICS-93 — бренд, ИИ в процессах, дизайн на данных";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderCoverOg({
    title: "Журнал AICS-93",
    tag: "заметки",
    meta: "Бренд · ИИ в процессах · дизайн на данных",
    seed: "aics-journal-index",
    accent: "#9747ff",
    eyebrow: "AICS-93 · Василий Аистов",
  });
}
