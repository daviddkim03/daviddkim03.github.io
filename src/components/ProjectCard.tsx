import { cn } from "cn";
import Link from "next/link";
import { LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import { ProjectMedia } from "@/components/ProjectMedia";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="pt-0">
      <ProjectMedia
        images={images}
        alt={title}
        sizes="(max-width: 768px) 100vw, 512px"
        loading={eager ? "eager" : undefined}
      />
      <CardHeader className={cn(images.length === 0 && "pt-(--card-spacing)")}>
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
        {company && (
          <CardAction>
            <Badge variant="outline">{company}</Badge>
          </CardAction>
        )}
      </CardHeader>
      {description.trim() && (
        <CardContent className="flex-1 leading-relaxed text-pretty text-muted-foreground">
          {description}
        </CardContent>
      )}
      <CardFooter className="mt-auto flex-wrap gap-2">
        <Link href={href} className={cn(buttonVariants({ variant: "outline" }))}>
          Read case study
          <LuArrowRight data-icon="inline-end" />
        </Link>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            View project
            <LuArrowUpRight data-icon="inline-end" />
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
