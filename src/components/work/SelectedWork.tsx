"use client";

import { useContent } from "@/components/content/ContentProvider";
import { type ClientProject, mergeProjects, projectHref } from "@/lib/clientProjects";
import { Column, Heading, Media, Row, SmartLink, Text } from "@once-ui-system/core";
import styles from "./selectedWork.module.scss";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  // Force UTC so the server build and the browser render the same string
  // (otherwise a date like 2026-06-01 can show a different month per timezone).
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function SelectedWork({ projects }: { projects: ClientProject[] }) {
  const content = useContent();
  const allProjects = mergeProjects(projects, content.dynamicProjects);
  const bySlug = new Map(allProjects.map((p) => [p.slug, p]));

  // Use the admin-selected slugs (in order); fall back to the newest projects.
  const selected = content.home.selectedSlugs
    .map((slug) => bySlug.get(slug))
    .filter((p): p is ClientProject => Boolean(p));
  const shown = selected.length > 0 ? selected : allProjects.slice(0, 2);

  if (shown.length === 0) return null;

  return (
    <Column fillWidth gap="24" paddingX="l" marginBottom="80">
      <Row fillWidth horizontal="between" vertical="center" gap="16">
        <Heading as="h2" variant="heading-strong-l">
          Selected Work
        </Heading>
        <SmartLink href="/work" suffixIcon="arrowRight" style={{ width: "fit-content" }}>
          <Text variant="label-default-s" onBackground="neutral-weak">
            View all
          </Text>
        </SmartLink>
      </Row>

      <Row fillWidth gap="24" s={{ direction: "column" }}>
        {shown.map((post) => (
          <Column key={post.slug} flex={1} fillWidth style={{ minWidth: 0 }}>
            <SmartLink href={projectHref(post)} style={{ width: "100%" }}>
              <Column className={styles.card} fillWidth gap="12">
                <Media
                  border="neutral-alpha-weak"
                  radius="l"
                  aspectRatio="16 / 9"
                  sizes="(max-width: 960px) 100vw, 50vw"
                  src={post.images[0]}
                  alt={post.title}
                />
                <Column gap="4" paddingX="4">
                  <Text variant="heading-strong-s" onBackground="neutral-strong">
                    {post.title}
                  </Text>
                  <Text variant="label-default-s" onBackground="neutral-weak">
                    {formatDate(post.publishedAt)}
                  </Text>
                </Column>
              </Column>
            </SmartLink>
          </Column>
        ))}
      </Row>
    </Column>
  );
}
