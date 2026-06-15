"use client";

import { useContent } from "@/components/content/ContentProvider";
import { about, person, social } from "@/resources";
import { Avatar, Button, Column, Heading, Icon, Row, Tag, Text } from "@once-ui-system/core";
import type React from "react";

/** Build a 1-2 character monogram from a company/school name for the logo fallback. */
function monogram(name: string): string {
  const cleaned = name.replace(/\(.*?\)/g, " ").replace(/\b(LLC|Inc|Ltd|Co)\.?\b/gi, " ");
  const words = cleaned.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w));
  if (words.length === 0) return "•";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <Heading as="h2" id={id} variant="heading-strong-l" marginBottom="24">
      {children}
    </Heading>
  );
}

export function AboutView() {
  const content = useContent();

  return (
    <Column maxWidth={48} fillWidth horizontal="center" gap="xl" paddingTop="80" paddingBottom="80">
      {/* Header: name/role/location on the left, avatar on the right */}
      <Row
        fillWidth
        horizontal="between"
        vertical="center"
        gap="32"
        s={{ direction: "column-reverse" }}
      >
        <Column flex={1} fillWidth gap="12">
          <Heading variant="display-strong-l">{content.person.name}</Heading>
          <Text variant="display-default-xs" onBackground="neutral-weak">
            {content.person.role}
          </Text>
          <Row gap="12" vertical="center" wrap paddingTop="4">
            <Row gap="8" vertical="center">
              <Icon onBackground="brand-weak" name="globe" />
              <Text variant="body-default-s" onBackground="neutral-weak">
                {content.person.location}
              </Text>
            </Row>
            {content.person.languages.map((language, index) => (
              <Tag key={index} size="s">
                {language}
              </Tag>
            ))}
          </Row>
        </Column>
        <Avatar src={person.avatar} size="xl" />
      </Row>

      {/* Social links + résumé */}
      {social.length > 0 && (
        <Row fillWidth gap="8" wrap data-border="rounded">
          {social
            .filter((item) => item.essential)
            .map(
              (item) =>
                item.link && (
                  <Button
                    key={item.name}
                    href={item.link}
                    prefixIcon={item.icon}
                    label={item.name}
                    size="s"
                    weight="default"
                    variant="secondary"
                  />
                ),
            )}
          {content.resume.display && content.resume.url && (
            <Button
              href={content.resume.url}
              target="_blank"
              rel="noopener noreferrer"
              prefixIcon="document"
              suffixIcon="arrowUpRight"
              label={content.resume.label}
              size="s"
              weight="default"
              variant="primary"
            />
          )}
        </Row>
      )}

      {/* Intro */}
      <Text variant="body-default-l" onBackground="neutral-weak" style={{ lineHeight: 1.7 }}>
        {content.about.intro}
      </Text>

      {/* Work Experience */}
      {content.about.work.length > 0 && (
        <Column fillWidth>
          <SectionTitle id={about.work.title}>{about.work.title}</SectionTitle>
          <Column fillWidth gap="32">
            {content.about.work.map((experience, index) => (
              <Row key={`${experience.company}-${index}`} fillWidth gap="16" vertical="start">
                <Avatar
                  size="l"
                  src={experience.logo}
                  value={experience.logo ? undefined : monogram(experience.company)}
                />
                <Column flex={1} gap="8">
                  <Row fillWidth horizontal="between" vertical="start" gap="12">
                    <Column gap="2">
                      <Text variant="heading-strong-s">{experience.company}</Text>
                      <Text variant="body-default-s" onBackground="brand-weak">
                        {experience.role}
                      </Text>
                    </Column>
                    <Text
                      variant="label-default-s"
                      onBackground="neutral-weak"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {experience.timeframe}
                    </Text>
                  </Row>
                </Column>
              </Row>
            ))}
          </Column>
        </Column>
      )}

      {/* Education */}
      {content.about.studies.length > 0 && (
        <Column fillWidth>
          <SectionTitle id={about.studies.title}>{about.studies.title}</SectionTitle>
          <Column fillWidth gap="24">
            {content.about.studies.map((institution, index) => (
              <Row key={`${institution.name}-${index}`} fillWidth gap="16" vertical="center">
                <Avatar
                  size="l"
                  src={institution.logo}
                  value={institution.logo ? undefined : monogram(institution.name)}
                />
                <Column flex={1} gap="2">
                  <Row fillWidth horizontal="between" vertical="start" gap="12">
                    <Text variant="heading-strong-s">{institution.name}</Text>
                    {institution.timeframe && (
                      <Text
                        variant="label-default-s"
                        onBackground="neutral-weak"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {institution.timeframe}
                      </Text>
                    )}
                  </Row>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {institution.description}
                  </Text>
                </Column>
              </Row>
            ))}
          </Column>
        </Column>
      )}

      {/* Skills */}
      {content.about.skills.length > 0 && (
        <Column fillWidth>
          <SectionTitle id={about.technical.title}>{about.technical.title}</SectionTitle>
          <Row fillWidth wrap gap="8">
            {content.about.skills.map((skill, index) => (
              <Tag key={`${skill}-${index}`} size="l">
                {skill}
              </Tag>
            ))}
          </Row>
        </Column>
      )}
    </Column>
  );
}
