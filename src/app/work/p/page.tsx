"use client";

import { useContent } from "@/components/content/ContentProvider";
import { Markdown } from "@/components/work/Markdown";
import { ProjectsView } from "@/components/work/ProjectsView";
import { formatDate } from "@/utils/formatDate";
import {
  AvatarGroup,
  Column,
  Heading,
  Line,
  Media,
  Row,
  SmartLink,
  Spinner,
  Tag,
  Text,
} from "@once-ui-system/core";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function DynamicProjectView() {
  const params = useSearchParams();
  const slug = params.get("slug") ?? "";
  const content = useContent();
  const project = content.dynamicProjects.find((p) => p.slug === slug);

  // Content loads async (defaults first, Supabase after). Give it a moment
  // before deciding a slug is genuinely missing, so valid links don't flash.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!project) {
    if (!settled) {
      return (
        <Column fillWidth horizontal="center" paddingY="128">
          <Spinner />
        </Column>
      );
    }
    return (
      <Column fillWidth horizontal="center" gap="16" paddingY="128" align="center">
        <Heading variant="heading-strong-l">Project not found</Heading>
        <SmartLink href="/work">
          <Text variant="label-strong-m">Back to projects</Text>
        </SmartLink>
      </Column>
    );
  }

  const avatars = project.team.map((member) => ({ src: member.avatar }));

  return (
    <Column as="section" maxWidth="l" horizontal="center" gap="l">
      <Column maxWidth="s" gap="16" horizontal="center" align="center">
        <SmartLink href="/work">
          <Text variant="label-strong-m">Projects</Text>
        </SmartLink>
        <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
          {project.publishedAt && formatDate(project.publishedAt)}
        </Text>
        <Heading variant="display-strong-m">{project.title}</Heading>
        {project.company && <Tag size="l">{project.company}</Tag>}
      </Column>

      {project.team.length > 0 && (
        <Row marginBottom="32" horizontal="center">
          <Row gap="16" vertical="center">
            <AvatarGroup reverse avatars={avatars} size="s" />
            <Text variant="label-default-m" onBackground="brand-weak">
              {project.team.map((member, idx) => (
                <span key={idx}>
                  {idx > 0 && (
                    <Text as="span" onBackground="neutral-weak">
                      ,{" "}
                    </Text>
                  )}
                  <SmartLink href={member.linkedIn}>{member.name}</SmartLink>
                </span>
              ))}
            </Text>
          </Row>
        </Row>
      )}

      {project.image && (
        <Media priority aspectRatio="16 / 9" radius="m" alt={project.title} src={project.image} />
      )}

      {project.tech.length > 0 && (
        <Row gap="8" wrap horizontal="center" maxWidth="s">
          {project.tech.map((t) => (
            <Tag key={t} size="m">
              {t}
            </Tag>
          ))}
        </Row>
      )}

      <Column style={{ margin: "auto" }} as="article" maxWidth="s">
        <Markdown source={project.body} />
      </Column>

      <Column fillWidth gap="40" horizontal="center" marginTop="40">
        <Line maxWidth="40" />
        <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
          Related projects
        </Heading>
        {/* MDX projects are merged in by ProjectsView; pass none of our own here. */}
        <ProjectsView projects={[]} />
      </Column>
    </Column>
  );
}

export default function DynamicProjectPage() {
  return (
    <Suspense
      fallback={
        <Column fillWidth horizontal="center" paddingY="128">
          <Spinner />
        </Column>
      }
    >
      <DynamicProjectView />
    </Suspense>
  );
}
