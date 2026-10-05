import { JsonLd } from "@/components";
import { AboutView } from "@/components/about/AboutView";
import { pageMetadata } from "@/lib/seo";
import { about } from "@/resources";

export const metadata = pageMetadata({
  title: about.title,
  description: about.description,
  path: about.path,
});

export default function About() {
  return (
    <>
      <JsonLd
        type="WebPage"
        path={about.path}
        title={about.title}
        description={about.description}
      />
      <AboutView />
    </>
  );
}
