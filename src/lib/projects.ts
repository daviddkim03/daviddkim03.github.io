import type { ClientProject } from "@/lib/clientProjects";
import { getPosts } from "@/utils/utils";

// Re-export the client-safe project type so server pages can keep importing
// it from here. The runtime helpers live in `@/lib/clientProjects` (no `fs`).
export type { ClientProject } from "@/lib/clientProjects";
export { toClientProject, projectHref, mergeProjects } from "@/lib/clientProjects";

/** Read all projects (newest first) as plain serializable objects. */
export function getLeanProjects(): ClientProject[] {
  return getPosts(["src", "app", "work", "projects"])
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
    )
    .map((post) => ({
      slug: post.slug,
      title: post.metadata.title,
      summary: post.metadata.summary ?? "",
      company: post.metadata.company ?? "",
      images: post.metadata.images ?? [],
      publishedAt: post.metadata.publishedAt,
      link: post.metadata.link ?? "",
    }));
}
