import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, formatDate } from "@/lib/blog";
import MarkdownLite from "@/components/blog/MarkdownLite";
import GenerativeCover from "@/components/blog/GenerativeCover";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Журнал AICS-93`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6">
      {/* cover */}
      <div className="relative mt-6 flex min-h-[300px] items-end overflow-hidden rounded-[24px] p-7 sm:p-10 lg:min-h-[380px]">
        <GenerativeCover seed={post.slug} accent={post.accent} className="absolute inset-0" density={1.15} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />
        <div className="relative">
          <span className="tech-label rounded-full bg-white/90 px-3 py-1 text-[10px]" style={{ color: post.accent }}>
            {post.tag}
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(1.8rem,4.2vw,3.2rem)] font-normal leading-[1.04] tracking-tight text-white">
            {post.title}
          </h1>
          <p className="tech-label mt-5 text-[11px] text-white/70">
            {formatDate(post.date)} · {post.readingMin} мин чтения · Василий Аистов
          </p>
        </div>
      </div>

      {/* body */}
      <div className="mx-auto mt-10 lg:mt-14">
        <MarkdownLite source={post.body} />
      </div>

      {/* footer nav */}
      <div className="mt-16 border-t border-line pt-8">
        <Link
          href="/blog"
          className="tech-label inline-flex items-center gap-2 text-[12px] text-ink-soft transition-colors hover:text-ink"
        >
          ← все заметки
        </Link>

        {others.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {others.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                <div className="rounded-2xl border border-line bg-bg p-5 transition-colors hover:border-[color-mix(in_srgb,var(--color-signal)_45%,transparent)]">
                  <span className="tech-label text-[10px]" style={{ color: p.accent }}>
                    {p.tag}
                  </span>
                  <p className="mt-2 font-display text-[1rem] font-normal leading-snug tracking-tight text-ink transition-colors group-hover:text-accent-ink">
                    {p.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
