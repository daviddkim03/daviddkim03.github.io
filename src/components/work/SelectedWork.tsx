"use client";

import { cn } from "cn";
import Image from "next/image";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { useContent } from "@/components/content/ContentProvider";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ClientProject, mergeProjects, projectHref } from "@/lib/clientProjects";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  // Force UTC so the server build and the browser render the same string
  // (otherwise a date like 2026-06-01 can show a different month per timezone).
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function SelectedWork({ projects }: { projects: ClientProject[] }) {
  const content = useContent();
  const allProjects = mergeProjects(projects, content.dynamicProjects);
  const bySlug = new Map(allProjects.map((p) => [p.slug, p]));

  // Use the configured slugs (in order); fall back to the newest projects.
  const selected = content.home.selectedSlugs
    .map((slug) => bySlug.get(slug))
    .filter((p): p is ClientProject => Boolean(p));
  const shown = selected.length > 0 ? selected : allProjects.slice(0, 2);

  if (shown.length === 0) return null;

  return (
    <section aria-labelledby="selected-work" className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 id="selected-work" className="font-heading text-xl font-semibold tracking-tight">
          Selected Work
        </h2>
        <Link
          href="/work"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-mr-1.75 text-muted-foreground",
          )}
        >
          View all
          <LuArrowRight data-icon="inline-end" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {shown.map((post) => (
          <Link
            key={post.slug}
            href={projectHref(post)}
            className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Card className="h-full pt-0 transition-colors hover:bg-muted/50">
              <div className="relative aspect-video border-b bg-muted">
                {post.images[0] && (
                  <Image
                    src={post.images[0]}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="eager"
                    className="object-cover object-top"
                  />
                )}
              </div>
              <CardHeader>
                <CardTitle>
                  <h3>{post.title}</h3>
                </CardTitle>
                <CardDescription>{formatDate(post.publishedAt)}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
