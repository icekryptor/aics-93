// Emits a JSON-LD <script> for structured data (SEO + GEO / AI answer engines).
// Server component — the JSON lands in the initial HTML where crawlers read it.

export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here (no user input); escape </ to avoid breaking the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
