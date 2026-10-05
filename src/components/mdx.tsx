import { cn } from "cn";
import Link from "next/link";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import { isValidElement } from "react";
import { slugify as transliterate } from "transliteration";
import { HeadingLink } from "@/components/HeadingLink";
import { prose } from "@/components/prose";
import { Separator } from "@/components/ui/separator";
import { ZoomableImage } from "@/components/ZoomableImage";

function slugify(str: string): string {
  const strWithAnd = str.replace(/&/g, " and "); // Replace & with 'and'
  return transliterate(strWithAnd, {
    lowercase: true,
    separator: "-", // Replace spaces with -
  }).replace(/--+/g, "-"); // Replace multiple - with single -
}

/** Plain text of a heading's children, used to derive its anchor id. */
function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const CustomHeading = ({ children }: React.ComponentProps<"h1">) => (
    <HeadingLink id={slugify(textOf(children))} level={level}>
      {children}
    </HeadingLink>
  );
  CustomHeading.displayName = `h${level}`;
  return CustomHeading;
}

function CustomLink({ href = "", className, ...props }: React.ComponentProps<"a">) {
  const linkClass = cn(prose.a, className);

  if (href.startsWith("/")) {
    return <Link href={href} className={linkClass} {...props} />;
  }
  if (href.startsWith("#")) {
    return <a href={href} className={linkClass} {...props} />;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass} {...props} />
  );
}

function CustomImage({ src, alt = "" }: React.ComponentProps<"img">) {
  if (typeof src !== "string" || !src) return null;
  return (
    <ZoomableImage src={src} alt={alt} sizes="(max-width: 768px) 100vw, 768px" className="my-6" />
  );
}

const components: MDXRemoteProps["components"] = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  p: (props) => <p className={prose.p} {...props} />,
  a: CustomLink,
  strong: (props) => <strong className={prose.strong} {...props} />,
  ul: (props) => <ul className={prose.ul} {...props} />,
  ol: (props) => <ol className={prose.ol} {...props} />,
  li: (props) => <li className={prose.li} {...props} />,
  blockquote: (props) => <blockquote className={prose.blockquote} {...props} />,
  code: (props) => <code className={prose.code} {...props} />,
  pre: (props) => <pre className={prose.pre} {...props} />,
  hr: () => <Separator className={prose.hr} />,
  img: CustomImage,
  table: (props) => (
    <div className={prose.tableWrapper}>
      <table className={prose.table} {...props} />
    </div>
  ),
  tr: (props) => <tr className={prose.tr} {...props} />,
  th: (props) => <th className={prose.th} {...props} />,
  td: (props) => <td className={prose.td} {...props} />,
};

export function CustomMDX(props: MDXRemoteProps) {
  return (
    <MDXRemote
      options={{ blockJS: false }}
      {...props}
      components={{ ...components, ...props.components }}
    />
  );
}
