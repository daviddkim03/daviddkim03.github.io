import { baseURL, freelance, person } from "@/resources";
import { Button, Column, Heading, Icon, Meta, Row, Schema, Text } from "@once-ui-system/core";

export async function generateMetadata() {
  return Meta.generate({
    title: freelance.title,
    description: freelance.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(freelance.title)}`,
    path: freelance.path,
  });
}

const services = [
  {
    title: "Business platforms",
    description:
      "POS systems, waitlist managers, scheduling tools, and business automation for restaurants, salons, real estate, and education.",
  },
  {
    title: "Full-stack web development",
    description:
      "Custom web solutions built end to end — from data pipelines and APIs to the interface your team actually uses.",
  },
  {
    title: "Data cleaning & reporting",
    description:
      "Messy upstream inputs turned into clean, structured outputs — API integrations, scraping, and automated reports.",
  },
];

export default function Freelance() {
  return (
    <Column maxWidth="l" paddingTop="24" gap="xl">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={freelance.path}
        title={freelance.title}
        description={freelance.description}
        image={`/api/og/generate?title=${encodeURIComponent(freelance.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${freelance.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column gap="m" horizontal="center" align="center">
        <Heading variant="display-strong-l">Freelance requests</Heading>
        <Column maxWidth="m">
          <Text align="center" variant="body-default-l" onBackground="neutral-weak" wrap="balance">
            I take on scoped freelance work through HyberTec — automation, estimation systems, and
            full-stack platforms for small teams. Short discovery call, scoped proposal, weekly
            demos, clean handoff.
          </Text>
        </Column>
        <Row gap="12" paddingTop="16" wrap horizontal="center" data-border="rounded">
          <Button
            href="https://hybertec.com"
            variant="primary"
            size="l"
            arrowIcon
            label="Request a project at HyberTec"
          />
          <Button
            href={`mailto:${person.email}`}
            variant="secondary"
            size="l"
            prefixIcon="email"
            label="Email me directly"
          />
        </Row>
      </Column>
      <Column gap="l" paddingTop="24">
        <Heading as="h2" variant="heading-strong-xl" align="center">
          What I take on
        </Heading>
        <Row gap="16" wrap horizontal="center">
          {services.map((service) => (
            <Column
              key={service.title}
              background="surface"
              border="neutral-alpha-weak"
              radius="l"
              padding="l"
              gap="8"
              minWidth={20}
              maxWidth={24}
              flex={1}
            >
              <Row gap="8" vertical="center">
                <Icon name="rocket" onBackground="brand-weak" />
                <Text variant="heading-strong-m">{service.title}</Text>
              </Row>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {service.description}
              </Text>
            </Column>
          ))}
        </Row>
      </Column>
    </Column>
  );
}
