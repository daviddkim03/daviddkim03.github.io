import { cn } from "cn";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ProjectTeamMember } from "@/lib/content";
import { formatDate } from "@/utils/formatDate";
import { monogram } from "@/utils/monogram";

interface ProjectDetailProps {
  title: string;
  company?: string;
  /** ISO date (YYYY-MM-DD). */
  publishedAt?: string;
  team: ProjectTeamMember[];
  /** Cover image shown above the case study. */
  image?: string;
  tech?: string[];
  /** The case study body. */
  children: React.ReactNode;
  /** Other projects listed under the case study. */
  related: React.ReactNode;
}

function Team({ members }: { members: ProjectTeamMember[] }) {
  return (
    <div className="flex items-center gap-3">
      <AvatarGroup>
        {members.map((member) => (
          <Avatar key={member.name} size="sm">
            <AvatarImage src={member.avatar} alt="" />
            <AvatarFallback>{monogram(member.name)}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
      <p className="text-sm text-muted-foreground">
        {members.map((member, index) => (
          <Fragment key={member.name}>
            {index > 0 && ", "}
            <a
              href={member.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {member.name}
            </a>
          </Fragment>
        ))}
      </p>
    </div>
  );
}

/** Shared layout for a project case study page. */
export function ProjectDetail({
  title,
  company,
  publishedAt,
  team,
  image,
  tech = [],
  children,
  related,
}: ProjectDetailProps) {
  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-10 pt-4 pb-20 md:pt-8">
      <header className="flex max-w-2xl flex-col items-center gap-4 text-center">
        <Link
          href="/work"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}
        >
          <LuArrowLeft data-icon="inline-start" />
          Projects
        </Link>
        {publishedAt && (
          <time dateTime={publishedAt} className="text-sm text-muted-foreground">
            {formatDate(publishedAt)}
          </time>
        )}
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          {title}
        </h1>
        {company && <Badge variant="outline">{company}</Badge>}
        {team.length > 0 && (
          <div className="pt-2">
            <Team members={team} />
          </div>
        )}
      </header>

      {image && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>
      )}

      {tech.length > 0 && (
        <div className="flex max-w-2xl flex-wrap justify-center gap-2">
          {tech.map((item) => (
            <Badge key={item} variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      )}

      <article className="w-full max-w-3xl">{children}</article>

      <section
        aria-labelledby="related-projects"
        className="flex w-full flex-col items-center gap-10 pt-10"
      >
        <Separator className="data-horizontal:w-10" />
        <h2 id="related-projects" className="font-heading text-2xl font-semibold tracking-tight">
          Related projects
        </h2>
        {related}
      </section>
    </div>
  );
}
