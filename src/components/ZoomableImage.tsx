"use client";

import { cn } from "cn";
import Image from "next/image";
import { LuX } from "react-icons/lu";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ZoomableImageProps {
  src: string;
  alt: string;
  /** Tailwind aspect-ratio class for the thumbnail, e.g. "aspect-video". */
  aspect?: string;
  sizes?: string;
  /** Load eagerly when the thumbnail is likely above the fold. */
  loading?: "eager" | "lazy";
  className?: string;
}

/** An image thumbnail that opens the full image in a dialog. */
export function ZoomableImage({
  src,
  alt,
  aspect = "aspect-video",
  sizes = "(max-width: 768px) 100vw, 50vw",
  loading,
  className,
}: ZoomableImageProps) {
  return (
    <Dialog>
      <DialogTrigger
        aria-label={alt ? `Enlarge image: ${alt}` : "Enlarge image"}
        className={cn(
          "group/zoom relative block w-full cursor-zoom-in overflow-hidden rounded-xl border bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          aspect,
          className,
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={loading}
          className="object-cover transition-transform duration-300 ease-out group-hover/zoom:scale-[1.02]"
        />
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="w-auto max-w-[calc(100%-2rem)] bg-transparent p-0 ring-0 sm:max-w-[min(90vw,72rem)]"
      >
        <DialogTitle className="sr-only">{alt || "Image"}</DialogTitle>
        {/* biome-ignore lint/performance/noImgElement: intrinsic-size full image; the static export serves images unoptimized */}
        <img
          src={src}
          alt={alt}
          className="max-h-[85svh] w-auto max-w-full rounded-xl object-contain"
        />
        <DialogClose
          className={cn(
            buttonVariants({ variant: "outline", size: "icon-sm" }),
            "absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur-sm dark:bg-background/80",
          )}
        >
          <LuX />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
