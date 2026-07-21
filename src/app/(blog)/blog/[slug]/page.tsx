import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, formatDate } from "@/lib/blog";
import MarkdownLite from "@/components/blog/MarkdownLite";
import BlogRail from "@/components/blog/BlogRail";
import BlogCover from "@/components/blog/BlogCover";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, SITE_NAME, AUTHOR } from "@/lib/site";

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
  const canonical = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    keywords: [post.tag, "брендинг", "дизайн", "Василий Аистов"],
    authors: [{ name: AUTHOR.name, url: SITE_URL }],
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: post.title,
      description: post.excerpt,
      siteName: SITE_NAME,
      locale: "ru_RU",
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.date).toISOString(),
      authors: [AUTHOR.name],
      section: post.tag,
      tags: [post.tag],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
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

  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const published = new Date(post.date).toISOString();
  const articleJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${canonical}#article`,
      headline: post.title,
      description: post.excerpt,
      inLanguage: "ru-RU",
      datePublished: published,
      dateModified: published,
      wordCount: post.body.split(/\s+/).length,
      articleSection: post.tag,
      keywords: post.tag,
      // Per-post OG route is content-hashed by Next (not a stable URL); the
      // og:image meta tag carries the exact per-post image. Structured-data
      // image points at the stable site OG so it never 404s.
      image: `${SITE_URL}/opengraph-image`,
      url: canonical,
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
      author: { "@id": `${SITE_URL}/#person` },
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Журнал", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: canonical },
      ],
    },
  ];

  return (
    <article className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6">
      <JsonLd data={articleJsonLd} />
      {/* cover */}
      <div className="relative mt-6 flex min-h-[300px] items-end overflow-hidden rounded-[24px] p-7 sm:p-10 lg:min-h-[380px]">
        <BlogCover seed={post.slug} accent={post.accent} cover={post.cover} className="absolute inset-0" density={1.15} priority />
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
          <span className="tech-label rounded-full bg-white/90 px-3 py-1 text-[10px]" style={{ color: `color-mix(in srgb, ${post.accent} 45%, #302055)` }}>
            {post.tag}
          </span>
          <h1 className="mt-5 max-w-3xl text-[clamp(1.8rem,4.2vw,3.2rem)] font-normal leading-[1.04] tracking-tight text-white">
            {post.title}
          </h1>
          <p className="tech-label mt-5 text-[11px] text-white/70">
            {formatDate(post.date)} · {post.readingMin} мин чтения · Василий Аистов
          </p>
        </div>
      </div>

      {/* body: 8 колонок текста + липкий рейл с офферами (4 колонки) */}
      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-8">
          <MarkdownLite source={post.body} />
        </div>
        <aside className="lg:col-span-4" aria-label="Предложения студии">
          <BlogRail />
        </aside>
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
                  <span className="tech-label text-[10px]" style={{ color: `color-mix(in srgb, ${p.accent} 45%, #302055)` }}>
                    {p.tag}
                  </span>
                  <p className="mt-2 text-[1rem] font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent-ink">
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
