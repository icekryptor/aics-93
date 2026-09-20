import { renderCoverOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "КП для Uniqdoc — продвижение магазина";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderCoverOg({
    title: "Продвижение Uniqdoc",
    tag: "кп",
    meta: "Таргет · Google Ads · SEO — от 500 $/мес, пакет 1 100 $/мес",
    seed: "kp-uniqdoc",
    accent: "#9747ff",
    eyebrow: "Коммерческое предложение · AICS-93",
  });
}
