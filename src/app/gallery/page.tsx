import { JsonLd, PageHeader, PhotoGrid } from "@/components";
import { pageMetadata } from "@/lib/seo";
import { gallery } from "@/resources";

export const metadata = pageMetadata({
  title: gallery.title,
  description: gallery.description,
  path: gallery.path,
});

export default function Gallery() {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-14 pt-4 pb-20 md:pt-8">
      <JsonLd
        type="WebPage"
        path={gallery.path}
        title={gallery.title}
        description={gallery.description}
      />
      <PageHeader title={gallery.label} />
      <PhotoGrid images={gallery.images} />
    </div>
  );
}
