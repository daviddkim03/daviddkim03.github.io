"use client";

import { useContent } from "@/components/content/ContentProvider";
import { SelectedWork } from "@/components/work/SelectedWork";
import type { ClientProject } from "@/lib/projects";
import { about, person } from "@/resources";
import {
  Avatar,
  Badge,
  Button,
  Column,
  Flex,
  Heading,
  Line,
  Row,
  Text,
} from "@once-ui-system/core";

export function HomeView({ projects }: { projects: ClientProject[] }) {
  const content = useContent();
  const featured = projects.find((p) => p.slug === content.home.featuredSlug);

  return (
    <Column maxWidth="l" gap="xl" paddingY="12" horizontal="center">
      <Column fillWidth horizontal="center" gap="m">
        <Column maxWidth="m" horizontal="center" align="center">
          {featured && (
            <Flex
              className="page-reveal"
              fillWidth
              horizontal="center"
              paddingTop="16"
              paddingBottom="32"
              paddingLeft="12"
            >
              <Badge
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={`/work/${featured.slug}`}
              >
                <Row paddingY="2" gap="12" vertical="center">
                  <strong className="ml-4">{featured.title}</strong>
                  <Line background="brand-alpha-strong" vert height="20" />
                  <Text marginRight="4" onBackground="brand-medium">
                    Featured work
                  </Text>
                </Row>
              </Badge>
            </Flex>
          )}
          <Flex className="page-reveal" fillWidth horizontal="center" paddingBottom="16">
            <Heading wrap="balance" variant="display-strong-l">
              {content.home.headline}
            </Heading>
          </Flex>
          <Flex
            className="page-reveal page-reveal-1"
            fillWidth
            horizontal="center"
            paddingBottom="32"
          >
            <Text wrap="balance" onBackground="neutral-weak" variant="body-default-l">
              {content.home.subline}
            </Text>
          </Flex>
          <Flex
            className="page-reveal page-reveal-2"
            paddingTop="12"
            horizontal="center"
            paddingLeft="12"
          >
            <Button
              id="about"
              data-border="rounded"
              href={about.path}
              variant="secondary"
              size="m"
              weight="default"
              arrowIcon
            >
              <Row gap="8" vertical="center" paddingRight="4">
                <Avatar
                  marginRight="8"
                  style={{ marginLeft: "-0.75rem" }}
                  src={person.avatar}
                  size="m"
                />
                {`About – ${content.person.name}`}
              </Row>
            </Button>
          </Flex>
        </Column>
      </Column>
      <Flex fillWidth className="page-reveal page-reveal-3">
        <SelectedWork projects={projects} />
      </Flex>
    </Column>
  );
}
