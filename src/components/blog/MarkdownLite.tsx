import type { ReactNode } from "react";

// Tiny markdown renderer for blog bodies. Supports: ## headings, blank-line
// paragraphs, "- " bullet lists, "> " blockquotes, and **bold** inline.
// No dependencies, no dangerouslySetInnerHTML.

function inline(text: string, keyBase: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={`${keyBase}-${i}`} className="font-semibold text-ink">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyBase}-${i}`}>{p}</span>;
  });
}

export default function MarkdownLite({ source }: { source: string }) {
  const blocks = source.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const out: ReactNode[] = [];

  blocks.forEach((block, bi) => {
    if (block.startsWith("## ")) {
      out.push(
        <h2
          key={bi}
          className="mt-12 text-[clamp(1.35rem,2.4vw,1.9rem)] font-normal leading-tight tracking-tight text-ink"
        >
          {block.slice(3)}
        </h2>
      );
      return;
    }
    if (block.startsWith("> ")) {
      out.push(
        <blockquote
          key={bi}
          className="my-8 border-l-2 border-accent pl-5 text-[clamp(1.05rem,1.6vw,1.35rem)] font-medium leading-snug text-ink"
        >
          {inline(block.slice(2), `q-${bi}`)}
        </blockquote>
      );
      return;
    }
    if (block.split("\n").every((l) => l.trim().startsWith("- "))) {
      out.push(
        <ul key={bi} className="my-5 space-y-2.5">
          {block.split("\n").map((l, li) => (
            <li key={li} className="flex items-start gap-3 text-[1.05rem] leading-relaxed text-ink-soft">
              <span className="mt-[0.6em] h-px w-4 shrink-0 bg-accent" aria-hidden />
              <span>{inline(l.trim().slice(2), `li-${bi}-${li}`)}</span>
            </li>
          ))}
        </ul>
      );
      return;
    }
    out.push(
      <p key={bi} className="mt-5 text-[1.05rem] leading-[1.75] text-ink-soft">
        {inline(block, `p-${bi}`)}
      </p>
    );
  });

  // ширину колонки задаёт грид страницы (8 из 12 колонок на десктопе)
  return <div>{out}</div>;
}
