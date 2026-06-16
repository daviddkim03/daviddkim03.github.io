"use client";

import { ChipInput } from "@/components/admin/ChipInput";
import { hasClaudeKey } from "@/lib/claudeKey";
import type { DynamicProject } from "@/lib/content";
import { uploadAsset } from "@/lib/content";
import { generateAndUploadCover } from "@/lib/coverGen";
import {
  Button,
  Column,
  Feedback,
  Heading,
  Input,
  Media,
  Row,
  Spinner,
  Text,
  Textarea,
} from "@once-ui-system/core";
import { useRef, useState } from "react";

type Msg = { kind: "success" | "danger"; text: string };

/** URL-safe slug from a title. */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function blankProject(ownerName: string): DynamicProject {
  return {
    slug: "",
    title: "",
    company: "",
    summary: "",
    publishedAt: todayIso(),
    tech: [],
    accent: "#38bdf8",
    image: "",
    link: "",
    body: "## Overview\n\nDescribe the project here.\n\n## Technical Highlights\n\n- First highlight\n",
    team: [{ name: ownerName, role: "Developer", avatar: "/trademarks/icon.png", linkedIn: "" }],
  };
}

/** Read-only reference to a built-in (MDX) project, shown for context. */
export interface BuiltinProjectRef {
  slug: string;
  title: string;
  company: string;
  summary: string;
  image: string;
}

interface ProjectsSectionProps {
  value: DynamicProject[];
  onChange: (next: DynamicProject[]) => void;
  /** Built-in MDX projects (defined in code), shown read-only for context. */
  builtins: BuiltinProjectRef[];
  /** Per-slug overrides keyed by slug; only the summary is editable here. */
  summaryOverrides: Record<string, { summary?: string; company?: string }>;
  onSummaryChange: (slug: string, summary: string) => void;
  /** Built-in MDX slugs, to warn on collisions. */
  reservedSlugs: string[];
  ownerName: string;
  onMessage: (msg: Msg) => void;
}

export function ProjectsSection({
  value,
  onChange,
  builtins,
  summaryOverrides,
  onSummaryChange,
  reservedSlugs,
  ownerName,
  onMessage,
}: ProjectsSectionProps) {
  // index+kind of the project currently running an async cover action
  const [busy, setBusy] = useState<{ i: number; kind: "gen" | "upload" } | null>(null);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const update = (i: number, patch: Partial<DynamicProject>) =>
    onChange(value.map((p, j) => (j === i ? { ...p, ...patch } : p)));

  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));

  const add = () => onChange([...value, blankProject(ownerName)]);

  const setTitle = (i: number, title: string) => {
    const p = value[i];
    // Auto-fill the slug from the title until it's been set manually.
    const slug = p.slug ? p.slug : slugify(title);
    update(i, { title, slug });
  };

  const effectiveSlug = (p: DynamicProject): string => p.slug || slugify(p.title);

  const slugTaken = (i: number): boolean => {
    const slug = effectiveSlug(value[i]);
    if (!slug) return false;
    const others = value.filter((_, j) => j !== i).map(effectiveSlug);
    return reservedSlugs.includes(slug) || others.includes(slug);
  };

  const generate = async (i: number) => {
    const p = value[i];
    if (!hasClaudeKey()) {
      onMessage({ kind: "danger", text: "Add your Claude API key in Settings first." });
      return;
    }
    const slug = effectiveSlug(p);
    setBusy({ i, kind: "gen" });
    const { url, error } = await generateAndUploadCover(slug, {
      title: p.title,
      summary: p.summary,
      company: p.company,
      tech: p.tech,
      accent: p.accent,
    });
    setBusy(null);
    if (error || !url) {
      onMessage({ kind: "danger", text: error ?? "Cover generation failed." });
      return;
    }
    update(i, { image: url, slug });
    onMessage({
      kind: "success",
      text: `Cover generated for “${p.title || slug}”. Save to keep it.`,
    });
  };

  const upload = async (i: number, file: File) => {
    const p = value[i];
    const slug = effectiveSlug(p) || "project";
    setBusy({ i, kind: "upload" });
    const { url, error } = await uploadAsset(file, `projects/${slug}-${Date.now()}-${file.name}`);
    setBusy(null);
    if (error || !url) {
      onMessage({ kind: "danger", text: error ?? "Upload failed." });
      return;
    }
    update(i, { image: url, slug: p.slug || slug });
  };

  return (
    <Column fillWidth gap="24">
      <Heading as="h2" variant="heading-strong-m">
        Projects
      </Heading>

      {/* Built-in projects (defined in code) — read-only, summary editable */}
      {builtins.length > 0 && (
        <Column fillWidth gap="12">
          <Text variant="label-strong-s">Built-in projects</Text>
          <Text variant="body-default-s" onBackground="neutral-weak">
            These live in code. You can edit the summary shown on cards here; their covers and
            case-study pages are defined in each project&rsquo;s MDX file.
          </Text>
          {builtins.map((b) => (
            <Row
              key={b.slug}
              fillWidth
              gap="16"
              padding="16"
              radius="m"
              border="neutral-alpha-medium"
              s={{ direction: "column" }}
            >
              <Column style={{ width: "200px", flexShrink: 0 }}>
                {b.image ? (
                  <Media
                    radius="m"
                    aspectRatio="16 / 9"
                    src={b.image}
                    alt={b.title}
                    border="neutral-alpha-weak"
                  />
                ) : (
                  <Column
                    horizontal="center"
                    vertical="center"
                    radius="m"
                    background="neutral-alpha-weak"
                    border="neutral-alpha-medium"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    <Text variant="label-default-s" onBackground="neutral-weak">
                      No cover
                    </Text>
                  </Column>
                )}
              </Column>
              <Column fillWidth gap="8">
                <Text variant="heading-strong-xs">{b.title}</Text>
                {b.company && (
                  <Text variant="label-default-s" onBackground="neutral-weak">
                    {b.company}
                  </Text>
                )}
                <Textarea
                  id={`bi-sum-${b.slug}`}
                  label="Summary (shown on cards)"
                  lines={2}
                  value={summaryOverrides[b.slug]?.summary ?? b.summary}
                  onChange={(e) => onSummaryChange(b.slug, e.target.value)}
                />
              </Column>
            </Row>
          ))}
        </Column>
      )}

      {/* Added projects (admin-authored, fully editable, AI covers) */}
      <Column fillWidth gap="12">
        <Row fillWidth horizontal="between" vertical="center">
          <Text variant="label-strong-s">Added projects</Text>
          <Button size="s" variant="secondary" prefixIcon="plus" onClick={add}>
            Add project
          </Button>
        </Row>
        <Text variant="body-default-s" onBackground="neutral-weak">
          Projects added here appear alongside the built-in ones, live, without a rebuild. Generate a
          cover with Claude (needs a key in Settings) or upload your own.
        </Text>

        {value.length === 0 && (
          <Text variant="label-default-s" onBackground="neutral-weak">
            No added projects yet. Click &ldquo;Add project&rdquo;.
          </Text>
        )}

        {value.map((p, i) => {
        const running = busy?.i === i;
        return (
          <Column key={i} fillWidth gap="12" padding="16" radius="m" border="neutral-alpha-medium">
            {/* Cover */}
            <Row fillWidth gap="16" s={{ direction: "column" }}>
              <Column style={{ width: "260px", flexShrink: 0 }} gap="8">
                {p.image ? (
                  <Media
                    radius="m"
                    aspectRatio="16 / 9"
                    src={p.image}
                    alt={p.title || "cover"}
                    border="neutral-alpha-weak"
                  />
                ) : (
                  <Column
                    horizontal="center"
                    vertical="center"
                    radius="m"
                    background="neutral-alpha-weak"
                    border="neutral-alpha-medium"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    {running && busy?.kind === "gen" ? (
                      <Spinner />
                    ) : (
                      <Text variant="label-default-s" onBackground="neutral-weak">
                        No cover yet
                      </Text>
                    )}
                  </Column>
                )}
                <Row gap="8" fillWidth>
                  <Button
                    size="s"
                    variant="secondary"
                    fillWidth
                    prefixIcon="sparkle"
                    loading={running && busy?.kind === "gen"}
                    onClick={() => generate(i)}
                  >
                    Generate
                  </Button>
                  <input
                    ref={(el) => {
                      fileRefs.current[i] = el;
                    }}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) upload(i, f);
                    }}
                  />
                  <Button
                    size="s"
                    variant="tertiary"
                    loading={running && busy?.kind === "upload"}
                    onClick={() => fileRefs.current[i]?.click()}
                  >
                    Upload
                  </Button>
                </Row>
              </Column>

              {/* Core fields */}
              <Column fillWidth gap="12">
                <Input
                  id={`dp-title-${i}`}
                  label="Title"
                  value={p.title}
                  onChange={(e) => setTitle(i, e.target.value)}
                />
                <Row fillWidth gap="12" s={{ direction: "column" }}>
                  <Input
                    id={`dp-company-${i}`}
                    label="Company (optional)"
                    value={p.company}
                    onChange={(e) => update(i, { company: e.target.value })}
                  />
                  <Input
                    id={`dp-date-${i}`}
                    label="Date"
                    type="date"
                    value={p.publishedAt}
                    onChange={(e) => update(i, { publishedAt: e.target.value })}
                  />
                </Row>
                <Input
                  id={`dp-slug-${i}`}
                  label="Slug (URL)"
                  value={p.slug}
                  onChange={(e) => update(i, { slug: slugify(e.target.value) })}
                />
                {slugTaken(i) && (
                  <Feedback
                    variant="warning"
                    description={`The slug “${effectiveSlug(p)}” is already used. Pick a unique one.`}
                  />
                )}
              </Column>
            </Row>

            <Textarea
              id={`dp-summary-${i}`}
              label="One-line summary (shown on cards)"
              lines={2}
              value={p.summary}
              onChange={(e) => update(i, { summary: e.target.value })}
            />

            <ChipInput
              label="Tech / tags"
              value={p.tech}
              onChange={(tech) => update(i, { tech })}
            />

            <Row fillWidth gap="12" vertical="center">
              <Text variant="label-default-s" onBackground="neutral-weak">
                Accent
              </Text>
              <input
                aria-label="Accent color"
                type="color"
                value={p.accent}
                onChange={(e) => update(i, { accent: e.target.value })}
                style={{
                  width: "40px",
                  height: "32px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              />
              <Input
                id={`dp-accent-${i}`}
                label="Hex"
                value={p.accent}
                onChange={(e) => update(i, { accent: e.target.value })}
              />
            </Row>

            <Input
              id={`dp-link-${i}`}
              label="External link (optional)"
              value={p.link}
              onChange={(e) => update(i, { link: e.target.value })}
            />

            <Textarea
              id={`dp-body-${i}`}
              label="Case study (Markdown: ## headings, - bullets, **bold**)"
              lines={10}
              value={p.body}
              onChange={(e) => update(i, { body: e.target.value })}
            />

            <Row fillWidth horizontal="end">
              <Button size="s" variant="danger" onClick={() => remove(i)}>
                Remove project
              </Button>
            </Row>
          </Column>
        );
      })}
      </Column>
    </Column>
  );
}
