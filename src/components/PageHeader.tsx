import { cn } from "cn";

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Actions shown below the description, e.g. buttons. */
  children?: React.ReactNode;
  className?: string;
}

/** Centered page title with an optional lead paragraph and actions. */
export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <section className={cn("flex flex-col items-center gap-5 text-center", className)}>
      <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-lg text-balance text-muted-foreground">{description}</p>
      )}
      {children}
    </section>
  );
}
