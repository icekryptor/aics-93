import { getAllServices, getService } from "@/lib/services";
import { renderCoverOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Услуга AICS-93";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllServices().map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) {
    return renderCoverOg({ title: "Услуги AICS-93", seed: "aics-services", accent: "#9747ff" });
  }
  return renderCoverOg({
    title: s.nav,
    tag: `услуга ${s.order}`,
    meta: s.hero.stats.map((st) => `${st.value} ${st.label}`).slice(0, 2).join(" · "),
    seed: `service-${s.slug}`,
    accent: "#9747ff",
    eyebrow: "AICS-93 · услуги",
  });
}
