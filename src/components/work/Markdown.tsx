"use client";

import { Column, Heading, Text } from "@once-ui-system/core";
import type { ReactNode } from "react";

/**
 * Minimal Markdown renderer for admin-authored project bodies. The built-in
 * MDX case studies compile at build time via `CustomMDX`; dynamic projects are
 * authored at runtime, so we render the small Markdown subset they use
 * (`##`/`###` headings, `-`/`*` bullet lists, blank-line paragraphs, and
 * inline `**bold**` / `` `code` ``) without pulling in a heavy MDX runtime.
 */

/** Parse inline `**bold**` and `` `code` `` into React nodes. */
function inline(text: string): ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return tokens.map((tok, i) => {
    if (tok.startsWith("**") && tok.endsWith("**")) {
      return <strong key={i}>{tok.slice(2, -2)}</strong>;
    }
    if (tok.startsWith("`") && tok.endsWith("`")) {
      return (
        <Text key={i} as="code" onBackground="brand-weak">
          {tok.slice(1, -1)}
        </Text>
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
    <Column fillWidth gap="20">
      {blocks.map((block, i) => {
        if (block.startsWith("### ")) {
          return (
            <Heading key={i} as="h3" variant="heading-strong-l" marginTop="8">
              {inline(block.slice(4))}
            </Heading>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <Heading key={i} as="h2" variant="heading-strong-xl" marginTop="16">
              {inline(block.slice(3))}
            </Heading>
          );
        }
        if (block.split("\n").every(isBullet)) {
          return (
            <Column key={i} as="ul" gap="8" paddingLeft="20">
              {block.split("\n").map((line, j) => (
                <Text
                  key={j}
                  as="li"
                  variant="body-default-m"
                  onBackground="neutral-weak"
                  style={{ listStyle: "disc" }}
                >
                  {inline(line.replace(/^\s*[-*]\s+/, ""))}
                </Text>
              ))}
            </Column>
          );
        }
        return (
          <Text key={i} variant="body-default-m" onBackground="neutral-weak">
            {inline(block)}
          </Text>
        );
      })}
    </Column>
  );
}
