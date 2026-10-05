"use client";

import { useContent } from "@/components/content/ContentProvider";
import { ProjectCard } from "@/components/ProjectCard";
import { type ClientProject, mergeProjects, projectHref } from "@/lib/clientProjects";

export function ProjectsView({
  projects,
  eagerCount = 0,
}: {
  projects: ClientProject[];
  /** How many leading covers to load eagerly (those visible on first paint). */
  eagerCount?: number;
}) {
  const content = useContent();
  const allProjects = mergeProjects(projects, content.dynamicProjects);

  return (
    <div className="flex w-full flex-col gap-16 md:gap-20">
      {allProjects.map((post, index) => {
        const override = content.projects[post.slug];
        return (
          <ProjectCard
            key={post.slug}
            eager={index < eagerCount}
            href={projectHref(post)}
            images={post.images}
            title={post.title}
            company={override?.company ?? post.company}
            description={override?.summary ?? post.summary}
            link={post.link}
          />
        );
      })}
    </div>
  );
}
