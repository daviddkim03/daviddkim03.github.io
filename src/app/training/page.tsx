import { LuDumbbell } from "react-icons/lu";
import { JsonLd, PageHeader, PhotoGrid } from "@/components";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { pageMetadata } from "@/lib/seo";
import { training } from "@/resources";

export const metadata = pageMetadata({
  title: training.title,
  description: training.description,
  path: training.path,
});

export default function Training() {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-14 pt-4 pb-20 md:pt-8">
      <JsonLd
        type="WebPage"
        path={training.path}
        title={training.title}
        description={training.description}
      />
      <PageHeader title={training.headline ?? training.label} description={training.intro} />

      {training.images.length > 0 ? (
        <PhotoGrid images={training.images} />
      ) : (
        <Empty className="flex-none border bg-muted/30 py-20">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LuDumbbell />
            </EmptyMedia>
            <EmptyTitle className="text-base text-muted-foreground">
              {training.placeholder ?? "Progress photos coming soon."}
            </EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
