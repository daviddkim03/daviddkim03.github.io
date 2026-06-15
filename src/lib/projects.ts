import { getPosts } from "@/utils/utils";

/** Serializable project shape passed from server pages to client views. */
export interface ClientProject {
  slug: string;
  title: string;
  summary: string;
  company: string;
  images: string[];
  publishedAt: string;
  link: string;
}

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
