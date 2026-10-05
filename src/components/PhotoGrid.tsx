import { ZoomableImage } from "@/components/ZoomableImage";

interface Photo {
  src: string;
  alt: string;
  orientation: string;
}

/** Two-column masonry of photos that enlarge on click. */
export function PhotoGrid({ images }: { images: Photo[] }) {
  return (
    <div className="w-full columns-1 gap-4 sm:columns-2">
      {images.map((image, index) => (
        <ZoomableImage
          key={image.src}
          src={image.src}
          alt={image.alt}
          aspect={image.orientation === "horizontal" ? "aspect-video" : "aspect-[3/4]"}
          sizes="(max-width: 640px) 100vw, 50vw"
          // CSS columns reorder items visually; the first few cover the top of both columns.
          loading={index < 4 ? "eager" : undefined}
          className="mb-4 break-inside-avoid"
        />
      ))}
    </div>
  );
}
