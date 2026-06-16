import type { DynamicProject } from "@/lib/content";

/**
 * Client-safe project helpers. Kept separate from `@/lib/projects` because that
 * module reads the filesystem (MDX), which can't be bundled into client
 * components. Anything a "use client" component needs lives here.
 */

/** Serializable project shape passed from server pages to client views. */
export interface ClientProject {
  slug: string;
  title: string;
  summary: string;
  company: string;
  images: string[];
  publishedAt: string;
  link: string;
  /** True for admin-authored projects (rendered on the client `/work/p` route). */
  dynamic?: boolean;
}

/** Convert an admin-authored project into the shared client-list shape. */
export function toClientProject(p: DynamicProject): ClientProject {
  return {
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    company: p.company,
    images: p.image ? [p.image] : [],
    publishedAt: p.publishedAt,
    link: p.link,
    dynamic: true,
  };
}

/** Detail-page URL for a project: static MDX route vs client dynamic route. */
export function projectHref(p: ClientProject): string {
  return p.dynamic ? `/work/p?slug=${encodeURIComponent(p.slug)}` : `/work/${p.slug}`;
}

/**
 * Merge the build-time MDX projects with the admin-authored ones and sort by
 * date (newest first). Used by every project listing so dynamic projects show
 * up live without a rebuild.
 */
export function mergeProjects(mdx: ClientProject[], dynamic: DynamicProject[]): ClientProject[] {
  return [...mdx, ...dynamic.map(toClientProject)].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
