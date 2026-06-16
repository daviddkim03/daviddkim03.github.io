"use client";

import { ProjectCard } from "@/components";
import { useContent } from "@/components/content/ContentProvider";
import { type ClientProject, mergeProjects, projectHref } from "@/lib/clientProjects";
import { Column } from "@once-ui-system/core";

export function ProjectsView({ projects }: { projects: ClientProject[] }) {
  const content = useContent();
  const allProjects = mergeProjects(projects, content.dynamicProjects);

  return (
    <Column fillWidth gap="xl" marginBottom="80" paddingX="l">
      {allProjects.map((post, index) => {
        const override = content.projects[post.slug];
        return (
          <ProjectCard
            priority={index < 2}
            key={post.slug}
            href={projectHref(post)}
            images={post.images}
            title={post.title}
            company={override?.company ?? post.company}
            description={override?.summary ?? post.summary}
            content="true"
            link={post.link}
          />
        );
      })}
    </Column>
  );
}
