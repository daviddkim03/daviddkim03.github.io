import { cn } from "cn";
import Link from "next/link";
import { LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import { ProjectMedia } from "@/components/ProjectMedia";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

interface ProjectCardProps {
  href: string;
  images: string[];
  title: string;
  company?: string;
  description: string;
  /** Optional external link to the live project. */
  link?: string;
  /** Load the cover eagerly (for cards that start above the fold). */
  eager?: boolean;
}

const linkClass = cn(buttonVariants({ variant: "link" }), "h-auto px-0");

export function ProjectCard({
  href,
  images,
  title,
  company,
  description,
  link,
  eager = false,
}: ProjectCardProps) {
  return (
    <article className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
      {images.length > 0 && (
        <ProjectMedia
          images={images}
          alt={title}
          sizes="(max-width: 768px) 100vw, 420px"
          loading={eager ? "eager" : undefined}
          className="w-full min-w-0 md:basis-5/12"
        />
      )}
      <div className="flex min-w-0 flex-col gap-3 md:basis-7/12">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-balance">
            {title}
          </h2>
          {company && <Badge variant="outline">{company}</Badge>}
        </div>
        {description.trim() && (
          <p className="text-sm/6 text-pretty text-muted-foreground">{description}</p>
        )}
        <div className="flex flex-wrap gap-6 pt-1">
          <Link href={href} className={linkClass}>
            Read case study
            <LuArrowRight data-icon="inline-end" />
          </Link>
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className={linkClass}>
              View project
              <LuArrowUpRight data-icon="inline-end" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
