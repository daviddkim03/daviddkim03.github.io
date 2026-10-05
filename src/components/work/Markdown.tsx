// biome-ignore-all lint/suspicious/noArrayIndexKey: blocks and tokens are parsed from a static string and never reorder, so positional keys are stable

import type { ReactNode } from "react";
import { prose } from "@/components/prose";

/**
 * Minimal Markdown renderer for code-authored project bodies. The built-in
 * MDX case studies compile at build time via `CustomMDX`; dynamic projects are
 * rendered on the client, so we render the small Markdown subset they use
 * (`##`/`###` headings, `-`/`*` bullet lists, blank-line paragraphs, and
 * inline `**bold**` / `` `code` ``) without pulling in a heavy MDX runtime.
 */

/** Parse inline `**bold**` and `` `code` `` into React nodes. */
function inline(text: string): ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return tokens.map((tok, i) => {
    if (tok.startsWith("**") && tok.endsWith("**")) {
      return (
        <strong key={i} className={prose.strong}>
          {tok.slice(2, -2)}
        </strong>
      );
    }
    if (tok.startsWith("`") && tok.endsWith("`")) {
      return (
        <code key={i} className={prose.code}>
          {tok.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{tok}</span>;
  });
}

function isBullet(line: string): boolean {
  return /^\s*[-*]\s+/.test(line);
}

export function Markdown({ source }: { source: string }) {
  const blocks = source
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="w-full">
      {blocks.map((block, i) => {
        if (block.startsWith("### ")) {
          return (
            <h3 key={i} className={prose.h3}>
              {inline(block.slice(4))}
            </h3>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className={prose.h2}>
              {inline(block.slice(3))}
            </h2>
          );
        }
        if (block.split("\n").every(isBullet)) {
          return (
            <ul key={i} className={prose.ul}>
              {block.split("\n").map((line, j) => (
                <li key={j} className={prose.li}>
                  {inline(line.replace(/^\s*[-*]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className={prose.p}>
            {inline(block)}
          </p>
        );
      })}
    </div>
  );
}
