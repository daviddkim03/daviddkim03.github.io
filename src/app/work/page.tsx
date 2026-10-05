import { JsonLd, PageHeader } from "@/components";
import { ProjectsView } from "@/components/work/ProjectsView";
import { getLeanProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { work } from "@/resources";

export const metadata = pageMetadata({
  title: work.title,
  description: work.description,
  path: work.path,
});

export default function Work() {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-14 pt-4 pb-20 md:pt-8">
      <JsonLd type="WebPage" path={work.path} title={work.title} description={work.description} />
      <PageHeader title={work.label} />
      <ProjectsView projects={getLeanProjects()} eagerCount={2} />
    </div>
  );
}
