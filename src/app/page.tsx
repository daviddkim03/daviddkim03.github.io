import { Mailchimp } from "@/components";
import { HomeView } from "@/components/home/HomeView";
import { getLeanProjects } from "@/lib/projects";
import { about, baseURL, home, person } from "@/resources";
import { Column, Meta, Schema } from "@once-ui-system/core";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default function Home() {
  const projects = getLeanProjects();

  return (
    <Column fillWidth horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={"/images/og/home.jpg"}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <HomeView projects={projects} />
      <Mailchimp />
    </Column>
  );
}
