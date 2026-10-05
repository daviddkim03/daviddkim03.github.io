import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomMDX, JsonLd, ScrollToHash } from "@/components";
import { ProjectDetail } from "@/components/work/ProjectDetail";
import { ProjectsView } from "@/components/work/ProjectsView";
import { getLeanProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { work } from "@/resources";
import { getPosts } from "@/utils/utils";

type Params = Promise<{ slug: string | string[] }>;

function findPost(slug: string | string[]) {
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug || "";
  return getPosts(["src", "app", "work", "projects"]).find((post) => post.slug === slugPath);
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "work", "projects"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = findPost((await params).slug);
  if (!post) return {};

  return pageMetadata({
    title: post.metadata.title,
    description: post.metadata.summary,
    path: `${work.path}/${post.slug}`,
    image: post.metadata.image || post.metadata.images[0],
  });
}

export default async function Project({ params }: { params: Params }) {
  const post = findPost((await params).slug);

  if (!post) {
    notFound();
  }

  const image = post.metadata.image || post.metadata.images[0];

  return (
    <>
      <JsonLd
        type="BlogPosting"
        path={`${work.path}/${post.slug}`}
        title={post.metadata.title}
        description={post.metadata.summary}
        image={image}
        datePublished={post.metadata.publishedAt}
      />
      <ProjectDetail
        title={post.metadata.title}
        company={post.metadata.company}
        publishedAt={post.metadata.publishedAt}
        team={post.metadata.team}
        image={post.metadata.images[0]}
        related={<ProjectsView projects={getLeanProjects().filter((p) => p.slug !== post.slug)} />}
      >
        <CustomMDX source={post.content} />
      </ProjectDetail>
      <ScrollToHash />
    </>
  );
}
