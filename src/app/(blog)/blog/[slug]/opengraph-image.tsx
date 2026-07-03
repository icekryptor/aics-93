import { getAllPosts, getPost, formatDate } from "@/lib/blog";
import { renderCoverOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Журнал AICS-93";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return renderCoverOg({ title: "Журнал AICS-93", seed: "aics-journal", accent: "#9747ff" });
  }
  return renderCoverOg({
    title: post.title,
    tag: post.tag,
    meta: `${formatDate(post.date)} · ${post.readingMin} мин · Василий Аистов`,
    seed: post.slug,
    accent: post.accent,
  });
}
