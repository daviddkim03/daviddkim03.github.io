import siteContent from "@/content/site.json";

/** A team member credited on a project (mirrors the MDX `team` frontmatter). */
export interface ProjectTeamMember {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
}

/**
 * A code-authored project (as opposed to the built-in MDX case studies in
 * `src/app/work/projects`). Add entries to `defaultContent.dynamicProjects` to
 * surface them. They appear in every project listing and render on a single
 * client route (`/work/p?slug=…`) since the static export can't pre-render
 * unknown slugs.
 */
export interface DynamicProject {
  slug: string;
  title: string;
  company: string;
  summary: string;
  /** ISO date (YYYY-MM-DD); controls ordering alongside MDX projects. */
  publishedAt: string;
  tech: string[];
  /** Hex accent the generated cover card is built around, e.g. "#38bdf8". */
  accent: string;
  /** Public URL of the cover image (uploaded/generated), shown in cards + hero. */
  image: string;
  /** Optional external link shown on the card. */
  link: string;
  /** Markdown case-study body rendered on the detail route. */
  body: string;
  team: ProjectTeamMember[];
}

/**
 * The site's structured content. The values live in
 * `src/content/site.json`, which `/admin` edits by committing to the repo. Rich/JSX content (case-study bodies) stays in MDX; this is the
 * structured, frequently-edited subset.
 */
export interface EditableContent {
  person: {
    name: string;
    role: string;
    location: string; // human-readable, shown in header/about
    languages: string[];
  };
  home: {
    headline: string;
    subline: string;
    /** slug of the project shown in the hero "Featured work" badge */
    featuredSlug: string;
    /** slugs shown in the home "Selected Work" grid, in order */
    selectedSlugs: string[];
  };
  about: {
    intro: string;
    work: Array<{
      company: string;
      role: string;
      timeframe: string;
      logo?: string;
      achievements: string[];
    }>;
    studies: Array<{
      name: string;
      timeframe: string;
      description: string;
      logo?: string;
    }>;
    skills: string[];
  };
  resume: {
    display: boolean;
    label: string;
    /** public URL of the résumé PDF (e.g. a file in /public) */
    url: string;
  };
  /** Per-project overrides keyed by slug (summary shown in lists). */
  projects: Record<string, { summary?: string; company?: string }>;
  /** Code-authored projects (in addition to the built-in MDX ones). */
  dynamicProjects: DynamicProject[];
}

export const defaultContent: EditableContent = siteContent;
