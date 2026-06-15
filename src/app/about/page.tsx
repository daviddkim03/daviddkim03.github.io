import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";
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
    <Heading as="h2" id={id} variant="heading-strong-l" marginTop="24" marginBottom="24">
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
  const structure = [
    {
      title: about.intro.title,
      display: about.intro.display,
      items: [],
    },
    {
      title: about.work.title,
      display: about.work.display,
      items: about.work.experiences.map((experience) => experience.company),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: about.studies.institutions.map((institution) => institution.name),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: [],
    },
  ];
  return (
    <Column maxWidth={72}>
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
      {about.tableOfContent.display && (
        <Column
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="24"
          gap="32"
          s={{ hide: true }}
        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}
      <Row fillWidth s={{ direction: "column" }} horizontal="center">
        {about.avatar.display && (
          <Column
            className={styles.avatar}
            top="64"
            fitHeight
            position="sticky"
            s={{ position: "relative", style: { top: "auto" } }}
            xs={{ style: { top: "auto" } }}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <Avatar src={person.avatar} size="xl" />
            <Row gap="8" vertical="center">
              <Icon onBackground="brand-weak" name="globe" />
              {person.displayLocation ?? person.location}
            </Row>
            {person.languages && person.languages.length > 0 && (
              <Row wrap gap="8">
                {person.languages.map((language, index) => (
                  <Tag key={index} size="l">
                    {language}
                  </Tag>
                ))}
              </Row>
            )}
          </Column>
        )}
        <Column className={styles.blockAlign} flex={9} maxWidth={52}>
          <Column
            id={about.intro.title}
            fillWidth
            minHeight="160"
            vertical="center"
            marginBottom="32"
          >
            {about.calendar.display && (
              <Row
                fitWidth
                border="brand-alpha-medium"
                background="brand-alpha-weak"
                radius="full"
                padding="4"
                gap="8"
                marginBottom="m"
                vertical="center"
                className={styles.blockAlign}
                style={{
                  backdropFilter: "blur(var(--static-space-1))",
                }}
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
            <Heading className={styles.textAlign} variant="display-strong-xl">
              {person.name}
            </Heading>
            <Text
              className={styles.textAlign}
              variant="display-default-xs"
              onBackground="neutral-weak"
            >
              {person.role}
            </Text>
            {social.length > 0 && (
              <Row
                className={styles.blockAlign}
                paddingTop="20"
                paddingBottom="8"
                gap="8"
                wrap
                horizontal="center"
                fitWidth
                data-border="rounded"
              >
                {social
                  .filter((item) => item.essential)
                  .map(
                    (item) =>
                      item.link && (
                        <React.Fragment key={item.name}>
                          <Row s={{ hide: true }}>
                            <Button
                              key={item.name}
                              href={item.link}
                              prefixIcon={item.icon}
                              label={item.name}
                              size="s"
                              weight="default"
                              variant="secondary"
                            />
                          </Row>
                          <Row hide s={{ hide: false }}>
                            <IconButton
                              size="l"
                              key={`${item.name}-icon`}
                              href={item.link}
                              icon={item.icon}
                              variant="secondary"
                            />
                          </Row>
                        </React.Fragment>
                      ),
                  )}
                {about.resume.display && about.resume.link && (
                  <>
                    <Row s={{ hide: true }}>
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
                    </Row>
                    <Row hide s={{ hide: false }}>
                      <IconButton
                        size="l"
                        href={about.resume.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon="document"
                        variant="primary"
                      />
                    </Row>
                  </>
                )}
              </Row>
            )}
          </Column>

          {about.intro.display && (
            <Column textVariant="body-default-l" fillWidth gap="m" marginBottom="xl">
              {about.intro.description}
            </Column>
          )}

          {about.work.display && (
            <>
              <SectionTitle id={about.work.title}>{about.work.title}</SectionTitle>
              <Column fillWidth gap="32" marginBottom="40">
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
            </>
          )}

          {about.studies.display && (
            <>
              <SectionTitle id={about.studies.title}>{about.studies.title}</SectionTitle>
              <Column fillWidth gap="24" marginBottom="40">
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
            </>
          )}

          {about.technical.display && (
            <>
              <SectionTitle id={about.technical.title}>{about.technical.title}</SectionTitle>
              <Row fillWidth wrap gap="8" marginBottom="40">
                {about.technical.skills.map((skill, index) => (
                  <Tag key={`${skill}-${index}`} size="l">
                    {skill}
                  </Tag>
                ))}
              </Row>
            </>
          )}
        </Column>
      </Row>
    </Column>
  );
}
