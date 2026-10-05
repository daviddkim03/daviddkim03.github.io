"use client";

import { cn } from "cn";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProjectMediaProps {
  images: string[];
  alt: string;
  sizes?: string;
  /** Load eagerly when the media is likely above the fold. */
  loading?: "eager" | "lazy";
  className?: string;
}

function Cover({
  src,
  alt,
  sizes,
  loading,
}: {
  src: string;
  alt: string;
  sizes?: string;
  loading?: "eager" | "lazy";
}) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
      <Image src={src} alt={alt} fill sizes={sizes} loading={loading} className="object-cover" />
    </div>
  );
}

/** A project's cover image, or a carousel when the project has several. */
export function ProjectMedia({
  images,
  alt,
  sizes = "(max-width: 768px) 100vw, 50vw",
  loading,
  className,
}: ProjectMediaProps) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className={className}>
        <Cover src={images[0]} alt={alt} sizes={sizes} loading={loading} />
      </div>
    );
  }

  return (
    <Carousel opts={{ loop: true }} className={cn("group/carousel", className)}>
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={src}>
            <Cover
              src={src}
              alt={`${alt} (${index + 1} of ${images.length})`}
              sizes={sizes}
              loading={index === 0 ? loading : undefined}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-3 opacity-0 transition-opacity group-hover/carousel:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100" />
      <CarouselNext className="right-3 opacity-0 transition-opacity group-hover/carousel:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100" />
    </Carousel>
  );
}
