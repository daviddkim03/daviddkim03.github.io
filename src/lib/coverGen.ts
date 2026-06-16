/**
 * Claude-powered project cover generation, fully client-side.
 *
 * Flow: project fields -> Claude (Messages API, called directly from the admin
 * browser) -> a single self-contained <svg> 1600x900 card in the same visual
 * concept as the built-in MDX project covers -> rasterize to JPEG via canvas ->
 * upload to Supabase storage -> return the public URL.
 *
 * The SVG must be self-contained (vector only, system fonts, no external
 * images/fonts/foreignObject) so the browser can rasterize it onto a canvas
 * without tainting it.
 */

import { getClaudeKey, getClaudeModel } from "@/lib/claudeKey";
import { uploadAsset } from "@/lib/content";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
export const CARD_WIDTH = 1600;
export const CARD_HEIGHT = 900;

export interface CoverInput {
  title: string;
  summary: string;
  company?: string;
  tech: string[];
  /** Hex accent the card is built around, e.g. "#38bdf8". */
  accent: string;
}

const SYSTEM_PROMPT = `You design vector cover images for software project case studies. You output ONE self-contained SVG and nothing else.

CONCEPT (match it precisely):
- A 1600x900 landscape card on a very dark background (near-black, subtly tinted toward the accent color). Generous negative space; calm and premium, not busy.
- LEFT HALF: the project title in a large, heavy sans-serif. Split the title into two tone groups — most of it near-white, one key word in the accent color. Directly below the title, a short accent-colored underline bar. Below that, a one-line lowercase tagline in a muted monospace font, then a single row of the tech/tags joined by " · " in a smaller muted monospace font.
- RIGHT HALF: a small, tasteful CONCEPTUAL MOCKUP that visually represents what THIS project does — invent it from the summary. Examples of the idea: a mini list/table with status pills, a small bar/line chart, a flow of 2-3 labeled nodes connected by arrows, a card/panel with rows. Use the accent color for highlights and thin strokes; keep fills dark and translucent. It should read as "a glimpse of the product", not clip art.

STRICT OUTPUT RULES:
- Return ONLY the SVG markup: a single element starting with <svg and ending with </svg>. No markdown fences, no prose, no comments.
- Root tag must be exactly: <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
- Allowed elements only: svg, defs, linearGradient, radialGradient, stop, g, rect, circle, ellipse, line, path, polyline, polygon, text, tspan. Use rx for rounded rects.
- NO <image>, NO <foreignObject>, NO external URLs, NO @import, NO <style> with web fonts.
- Fonts: use only generic/system stacks via font-family attributes, e.g. font-family="Arial, Helvetica, sans-serif" for headings and font-family="ui-monospace, Menlo, Consolas, monospace" for mono text.
- Keep all content inside the 1600x900 canvas with comfortable margins (~96px). Never let text overflow.`;

function userPrompt(input: CoverInput): string {
  const tags = input.tech.length ? input.tech.join(", ") : "software";
  return `Design the cover SVG for this project.

Title: ${input.title || "Untitled Project"}
Company: ${input.company || "—"}
One-line summary: ${input.summary || "A software project."}
Tech / tags (for the tag row): ${tags}
Accent color (hex): ${input.accent || "#38bdf8"}

Use the accent color exactly as given. Choose which single word of the title to render in the accent. Invent a conceptual mockup on the right that fits the summary. Output only the SVG.`;
}

/** Pull the first complete <svg>…</svg> block out of a model response. */
export function extractSvg(text: string): string | null {
  const match = text.match(/<svg[\s\S]*?<\/svg>/i);
  return match ? match[0] : null;
}

/** Force the root <svg> tag to carry explicit size + xmlns so it rasterizes. */
export function ensureSvgSize(svg: string, width = CARD_WIDTH, height = CARD_HEIGHT): string {
  return svg.replace(/<svg\b([^>]*)>/i, (_full, attrs: string) => {
    let next = attrs;
    if (!/\bxmlns=/.test(next)) next += ' xmlns="http://www.w3.org/2000/svg"';
    if (!/\bwidth=/.test(next)) next += ` width="${width}"`;
    if (!/\bheight=/.test(next)) next += ` height="${height}"`;
    if (!/\bviewBox=/.test(next)) next += ` viewBox="0 0 ${width} ${height}"`;
    return `<svg${next}>`;
  });
}

/** Ask Claude for the cover SVG. Throws with a readable message on failure. */
export async function generateCoverSvg(input: CoverInput): Promise<string> {
  const key = getClaudeKey();
  if (!key) throw new Error("Add your Claude API key in Settings first.");

  let res: Response;
  try {
    res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: getClaudeModel(),
        max_tokens: 6000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt(input) }],
      }),
    });
  } catch (e) {
    throw new Error(
      `Could not reach the Claude API: ${e instanceof Error ? e.message : "network error"}`,
    );
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude API error (${res.status}). ${body.slice(0, 300)}`);
  }

  const data: { content?: Array<{ type: string; text?: string }> } = await res.json();
  const raw = (data.content ?? [])
    .filter((b) => b.type === "text" && b.text)
    .map((b) => b.text)
    .join("\n");
  const svg = extractSvg(raw);
  if (!svg) throw new Error("Claude didn't return an SVG. Try again or tweak the summary.");
  return ensureSvgSize(svg);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("The generated SVG couldn't be rendered (must be self-contained)."));
    img.src = url;
  });
}

/** Rasterize a self-contained SVG string to a JPEG blob via an offscreen canvas. */
export async function rasterizeSvg(
  svg: string,
  width = CARD_WIDTH,
  height = CARD_HEIGHT,
): Promise<Blob> {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported in this browser.");
    // JPEG has no alpha; paint a dark backdrop so transparent areas aren't black.
    ctx.fillStyle = "#05070b";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Could not encode the image."))),
        "image/jpeg",
        0.92,
      ),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * End-to-end: generate the SVG cover, rasterize to JPEG, upload to storage.
 * Returns the public URL (or an error message) — never throws.
 */
export async function generateAndUploadCover(
  slug: string,
  input: CoverInput,
): Promise<{ url: string | null; error: string | null }> {
  try {
    const svg = await generateCoverSvg(input);
    const jpeg = await rasterizeSvg(svg);
    const safeSlug = slug || "project";
    const file = new File([jpeg], `${safeSlug}.jpg`, { type: "image/jpeg" });
    return await uploadAsset(file, `projects/${safeSlug}-${Date.now()}.jpg`);
  } catch (e) {
    return { url: null, error: e instanceof Error ? e.message : "Cover generation failed." };
  }
}
