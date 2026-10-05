import type { Metadata } from "next";
import { about, baseURL, home, person } from "@/resources";

/** Resolve a site path (or an already-absolute URL) against the site's base URL. */
export function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, baseURL).toString();
}

interface PageMetadataInput {
  title: string;
  description: string;
  /** Route path of the page, e.g. "/about". */
  path: string;
  /** Social preview image: a path under /public or an absolute URL. */
  image?: string;
}

/** Page `<head>` metadata, including Open Graph and Twitter card tags. */
export function pageMetadata({
  title,
  description,
  path,
  image = home.image,
}: PageMetadataInput): Metadata {
  return {
    metadataBase: new URL(baseURL),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: absoluteUrl(path),
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export interface PageSchemaInput {
  type: "WebPage" | "BlogPosting";
  title: string;
  description: string;
  path: string;
  image?: string;
  /** ISO date; sets both datePublished and dateModified. */
  datePublished?: string;
}

/** schema.org structured data for a page, authored by the site owner. */
export function pageSchema({
  type,
  title,
  description,
  path,
  image = home.image,
  datePublished,
}: PageSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    url: absoluteUrl(path),
    headline: title,
    description,
    image: absoluteUrl(image),
    ...(datePublished ? { datePublished, dateModified: datePublished } : {}),
    author: {
      "@type": "Person",
      name: person.name,
      url: absoluteUrl(about.path),
      image: { "@type": "ImageObject", url: absoluteUrl(person.avatar) },
    },
  };
}
