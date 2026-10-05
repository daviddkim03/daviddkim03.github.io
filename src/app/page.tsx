import { JsonLd } from "@/components";
import { HomeView } from "@/components/home/HomeView";
import { getLeanProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { home } from "@/resources";

export const metadata = pageMetadata({
  title: home.title,
  description: home.description,
  path: home.path,
  image: home.image,
});

export default function Home() {
  return (
    <>
      <JsonLd
        type="WebPage"
        path={home.path}
        title={home.title}
        description={home.description}
        image={home.image}
      />
      <HomeView projects={getLeanProjects()} />
    </>
  );
}
