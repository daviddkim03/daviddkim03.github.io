"use client";

import { cn } from "cn";
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
    <div
      className={cn(
        "grid w-full gap-6",
        // A lone card stays centered instead of sitting in half of a row.
        allProjects.length === 1 ? "mx-auto max-w-lg" : "md:grid-cols-2",
        // Avoid an orphan in the last row.
        allProjects.length >= 3 && allProjects.length !== 4 && "lg:grid-cols-3",
      )}
    >
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
