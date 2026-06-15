import { about, baseURL, person, social } from "@/resources";
import {
  Avatar,
  Button,
  Column,
  Heading,
  Icon,
  IconButton,
  Meta,
  Row,
  Schema,
  Tag,
  Text,
} from "@once-ui-system/core";
import React from "react";

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

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: "/images/og/home.jpg",
    path: about.path,
  });
}

export default function About() {
  return (
    <Column maxWidth={48} fillWidth horizontal="center" gap="xl" paddingTop="80" paddingBottom="80">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={about.path}
        image={"/images/og/home.jpg"}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Header: name/role/location on the left, avatar on the right */}
      <Row fillWidth horizontal="between" vertical="center" gap="32" s={{ direction: "column-reverse" }}>
        <Column flex={1} fillWidth gap="12">
          {about.calendar.display && (
            <Row
              fitWidth
              border="brand-alpha-medium"
              background="brand-alpha-weak"
              radius="full"
              padding="4"
              gap="8"
              vertical="center"
              style={{ backdropFilter: "blur(var(--static-space-1))" }}
            >
              <Icon paddingLeft="12" name="calendar" onBackground="brand-weak" />
              <Row paddingX="8">Schedule a call</Row>
              <IconButton
                href={about.calendar.link}
                data-border="rounded"
                variant="secondary"
                icon="chevronRight"
              />
            </Row>
          )}
          <Heading variant="display-strong-l">{person.name}</Heading>
          <Text variant="display-default-xs" onBackground="neutral-weak">
            {person.role}
          </Text>
          <Row gap="12" vertical="center" wrap paddingTop="4">
            <Row gap="8" vertical="center">
              <Icon onBackground="brand-weak" name="globe" />
              <Text variant="body-default-s" onBackground="neutral-weak">
                {person.displayLocation ?? person.location}
              </Text>
            </Row>
            {person.languages?.map((language, index) => (
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
          {about.resume.display && about.resume.link && (
            <Button
              href={about.resume.link}
              target="_blank"
              rel="noopener noreferrer"
              prefixIcon="document"
              suffixIcon="arrowUpRight"
              label={about.resume.label}
              size="s"
              weight="default"
              variant="primary"
            />
          )}
        </Row>
      )}

      {/* Intro */}
      {about.intro.display && (
        <Text variant="body-default-l" onBackground="neutral-medium">
          {about.intro.description}
        </Text>
      )}

      {/* Work Experience */}
      {about.work.display && (
        <Column fillWidth>
          <SectionTitle id={about.work.title}>{about.work.title}</SectionTitle>
          <Column fillWidth gap="32">
            {about.work.experiences.map((experience, index) => (
              <Row
                key={`${experience.company}-${experience.role}-${index}`}
                fillWidth
                gap="16"
                vertical="start"
              >
                <Avatar size="l" value={monogram(experience.company)} src={experience.logo} />
                <Column flex={1} gap="8">
                  <Row fillWidth horizontal="between" vertical="start" gap="12">
                    <Column gap="2">
                      <Text id={experience.company} variant="heading-strong-s">
                        {experience.company}
                      </Text>
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
                  {experience.achievements.length > 0 && (
                    <Column as="ul" gap="8" paddingTop="4">
                      {experience.achievements.map(
                        (achievement: React.ReactNode, achievementIndex: number) => (
                          <Text
                            as="li"
                            variant="body-default-m"
                            onBackground="neutral-weak"
                            key={`${experience.company}-${achievementIndex}`}
                          >
                            {achievement}
                          </Text>
                        ),
                      )}
                    </Column>
                  )}
                </Column>
              </Row>
            ))}
          </Column>
        </Column>
      )}

      {/* Education */}
      {about.studies.display && (
        <Column fillWidth>
          <SectionTitle id={about.studies.title}>{about.studies.title}</SectionTitle>
          <Column fillWidth gap="24">
            {about.studies.institutions.map((institution, index) => (
              <Row key={`${institution.name}-${index}`} fillWidth gap="16" vertical="center">
                <Avatar size="l" value={monogram(institution.name)} src={institution.logo} />
                <Column flex={1} gap="2">
                  <Row fillWidth horizontal="between" vertical="start" gap="12">
                    <Text id={institution.name} variant="heading-strong-s">
                      {institution.name}
                    </Text>
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
      {about.technical.display && (
        <Column fillWidth>
          <SectionTitle id={about.technical.title}>{about.technical.title}</SectionTitle>
          <Row fillWidth wrap gap="8">
            {about.technical.skills.map((skill, index) => (
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
