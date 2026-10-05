import { type PageSchemaInput, pageSchema } from "@/lib/seo";

/** Renders a page's schema.org structured data into the server HTML. */
export function JsonLd(props: PageSchemaInput) {
  // Escape "<" so the serialized JSON can never close the script tag early.
  const json = JSON.stringify(pageSchema(props)).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD built from site config, with "<" escaped
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
