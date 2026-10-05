"use client";

import { cn } from "cn";
import { LuLink } from "react-icons/lu";
import { toast } from "sonner";
import { prose } from "@/components/prose";

interface HeadingLinkProps {
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

/** A content heading that copies a link to itself when clicked. */
export function HeadingLink({ id, level, children, className }: HeadingLinkProps) {
  const Heading = `h${level}` as const;

  const copyLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success("Link copied to clipboard."),
      () => toast.error("Failed to copy link."),
    );
  };

  return (
    <Heading id={id} className={cn(prose[Heading], className)}>
      <a
        href={`#${id}`}
        onClick={copyLink}
        className="group inline-flex items-center gap-2 decoration-border decoration-1 underline-offset-[0.25em] hover:underline"
      >
        {children}
        <LuLink
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      </a>
    </Heading>
  );
}
