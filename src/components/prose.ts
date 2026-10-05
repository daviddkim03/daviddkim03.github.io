/**
 * Typography for long-form content (MDX case studies and Markdown project
 * bodies), following the shadcn/ui typography styles. Shared so both
 * renderers stay visually identical.
 */
export const prose = {
  h1: "mt-10 scroll-m-24 font-heading text-3xl font-semibold tracking-tight text-balance first:mt-0",
  h2: "mt-10 scroll-m-24 font-heading text-2xl font-semibold tracking-tight first:mt-0",
  h3: "mt-8 scroll-m-24 font-heading text-xl font-semibold tracking-tight first:mt-0",
  h4: "mt-6 scroll-m-24 font-heading text-lg font-semibold tracking-tight first:mt-0",
  h5: "mt-6 scroll-m-24 font-heading text-base font-semibold tracking-tight first:mt-0",
  h6: "mt-6 scroll-m-24 font-heading text-sm font-semibold tracking-tight first:mt-0",
  p: "leading-7 not-first:mt-4",
  a: "font-medium underline underline-offset-4",
  strong: "font-semibold",
  ul: "my-4 ml-6 list-disc marker:text-muted-foreground [&>li]:mt-2",
  ol: "my-4 ml-6 list-decimal marker:text-muted-foreground [&>li]:mt-2",
  li: "leading-7",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  pre: "my-6 overflow-x-auto rounded-xl border bg-muted/50 p-4 font-mono text-sm [&_code]:bg-transparent [&_code]:p-0 [&_code]:font-normal",
  hr: "mx-auto my-10 data-horizontal:w-10",
  table: "w-full",
  tableWrapper: "my-6 w-full overflow-y-auto",
  tr: "m-0 border-t p-0 even:bg-muted",
  th: "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
  td: "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
} as const;
