"use client";

import { cn } from "cn";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { useContent } from "@/components/content/ContentProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SelectedWork } from "@/components/work/SelectedWork";
import { type ClientProject, mergeProjects, projectHref } from "@/lib/clientProjects";
import { about, person } from "@/resources";
import { monogram } from "@/utils/monogram";

export function HomeView({ projects }: { projects: ClientProject[] }) {
  const content = useContent();
  const allProjects = mergeProjects(projects, content.dynamicProjects);
  const featured = allProjects.find((p) => p.slug === content.home.featuredSlug);

  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-20 pt-4 pb-20 md:pt-14">
      <section className="flex max-w-3xl flex-col items-center text-center">
        {featured && (
          <Badge
            variant="outline"
            render={<Link href={projectHref(featured)} />}
            className="mb-6 h-7 gap-2.5 px-3"
          >
            <span className="font-semibold">{featured.title}</span>
            <Separator
              orientation="vertical"
              className="data-vertical:h-3.5 data-vertical:self-center"
            />
            <span className="text-muted-foreground">Featured work</span>
          </Badge>
        )}
        <h1 className="font-heading text-5xl font-semibold tracking-tight text-balance md:text-6xl">
          {content.home.headline}
        </h1>
        <p className="mt-5 text-lg text-balance text-muted-foreground">{content.home.subline}</p>
        <Link
          href={about.path}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-8")}
        >
          <Avatar size="sm">
            <AvatarImage src={person.avatar} alt="" />
            <AvatarFallback>{monogram(content.person.name)}</AvatarFallback>
          </Avatar>
          About {content.person.name}
          <LuArrowRight data-icon="inline-end" />
        </Link>
      </section>
      <div className="w-full">
        <SelectedWork projects={projects} />
      </div>
    </div>
  );
}
