import { renderCoverOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

/* OG-превью ссылки на КП (Telegram/мессенджеры): своя карточка вместо
   общего слогана сайта — клиент видит, что это предложение для него. */

export const alt = "КП для BIGSNT — свой канал продаж";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderCoverOg({
    title: "Свой канал продаж для BIGSNT",
    tag: "кп",
    meta: "Аудит сайта · экономика заказа · 320 / 500 тыс. ₽ · 10–18 дней",
    seed: "kp-bigsnt",
    accent: "#9747ff",
    eyebrow: "Коммерческое предложение · AICS-93",
  });
}
