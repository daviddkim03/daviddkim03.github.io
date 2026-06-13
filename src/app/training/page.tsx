import { Column, Heading, Icon, Meta, Schema, Text } from "@once-ui-system/core";
import TrainingView from "@/components/training/TrainingView";
import { baseURL, person, training } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: training.title,
    description: training.description,
    baseURL: baseURL,
    image: "/images/og/home.jpg",
    path: training.path,
  });
}

export default function Training() {
  const hasImages = training.images && training.images.length > 0;

  return (
    <Column maxWidth="l" fillWidth gap="xl" horizontal="center" paddingY="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={training.title}
        description={training.description}
        path={training.path}
        image={"/images/og/home.jpg"}
        author={{
          name: person.name,
          url: `${baseURL}${training.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column
        maxWidth="s"
        fillWidth
        gap="m"
        horizontal="center"
        style={{ textAlign: "center" }}
      >
        <Heading variant="display-strong-l">{training.headline ?? training.label}</Heading>
        {training.intro && (
          <Text variant="body-default-l" onBackground="neutral-weak">
            {training.intro}
          </Text>
        )}
      </Column>

      {hasImages ? (
        <TrainingView />
      ) : (
        <Column
          fillWidth
          horizontal="center"
          vertical="center"
          gap="16"
          paddingY="80"
          paddingX="l"
          radius="l"
          border="neutral-alpha-medium"
          background="neutral-alpha-weak"
          style={{ borderStyle: "dashed" }}
        >
          <Icon name="dumbbell" size="l" onBackground="neutral-weak" />
          <Text variant="heading-default-m" onBackground="neutral-weak">
            {training.placeholder ?? "Progress photos coming soon."}
          </Text>
        </Column>
      )}
    </Column>
  );
}
