import { Projects } from "@/components/work/Projects";
import { about, baseURL, person, work } from "@/resources";
import { Column, Flex, Heading, Meta, Schema } from "@once-ui-system/core";

export async function generateMetadata() {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: "/images/og/home.jpg",
    path: work.path,
  });
}

export default function Work() {
  return (
    <Column maxWidth="l" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={"/images/og/home.jpg"}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading className="page-reveal" marginBottom="l" variant="display-strong-s" align="center">
        Projects
      </Heading>
      <Flex fillWidth className="page-reveal page-reveal-1">
        <Projects />
      </Flex>
    </Column>
  );
}
