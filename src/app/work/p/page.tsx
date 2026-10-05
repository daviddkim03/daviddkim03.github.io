"use client";

import { cn } from "cn";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LuArrowLeft, LuFolderSearch } from "react-icons/lu";
import { useContent } from "@/components/content/ContentProvider";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { Markdown } from "@/components/work/Markdown";
import { ProjectDetail } from "@/components/work/ProjectDetail";
import { ProjectsView } from "@/components/work/ProjectsView";

function DynamicProjectView() {
  const params = useSearchParams();
  const slug = params.get("slug") ?? "";
  const content = useContent();
  const project = content.dynamicProjects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <Empty className="py-24">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LuFolderSearch />
          </EmptyMedia>
          <EmptyTitle className="text-base">Project not found</EmptyTitle>
          <EmptyDescription>
            This project doesn&apos;t exist or is no longer listed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/work" className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>
            <LuArrowLeft data-icon="inline-start" />
            Back to projects
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <ProjectDetail
      title={project.title}
      company={project.company}
      publishedAt={project.publishedAt}
      team={project.team}
      image={project.image}
      tech={project.tech}
      related={<ProjectsView projects={[]} />}
    >
      <Markdown source={project.body} />
    </ProjectDetail>
  );
}

export default function DynamicProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex w-full justify-center py-32">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <DynamicProjectView />
    </Suspense>
  );
}
