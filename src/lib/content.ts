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
 * The site's structured content. Edit `defaultContent` below to change what the
 * site shows. Rich/JSX content (case-study bodies) stays in MDX; this is the
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

export const defaultContent: EditableContent = {
  person: {
    name: "David Kim",
    role: "Lead Software Developer",
    location: "Atlanta / Duluth, GA",
    languages: ["English", "Korean"],
  },
  home: {
    headline: "Software & automation",
    subline:
      "I'm David, lead software developer at Young Corporation and founder of HyberTec, where I build web and automation systems. I also tutor SAT Math and play all racket sports.",
    featuredSlug: "takeoff-estimator",
    selectedSlugs: ["restbroker", "takeoff-estimator"],
  },
  about: {
    intro:
      "David is an Atlanta-based software developer and Georgia Tech Computer Science graduate. He leads estimation-automation software at Young Corporation and founded HyberTec LLC, building SaaS products and custom solutions for small businesses across full-stack web, automation, and embedded security.",
    work: [
      {
        company: "Young Corporation",
        role: "Lead Software Developer",
        timeframe: "May 2026 - Present",
        achievements: [
          "Architect an automated estimation system to support and marketize proprietary construction products.",
          "Build software that automates construction processes, reducing manual staff workload and increasing efficiency.",
          "Design internal tools integrating AI-assisted workflows for estimation and operational automation.",
        ],
      },
      {
        company: "HyberTec LLC",
        role: "Founder and Lead Developer",
        timeframe: "Apr 2026 - Present",
        achievements: [
          "Founded and lead a software services company delivering SaaS products and custom solutions to businesses.",
          "Engineer platforms including POS systems, waitlist managers, scheduling tools, and business automation.",
          "Develop full-stack web solutions for restaurants, salons, real estate agents, and education businesses.",
        ],
      },
      {
        company: "Prime Academy",
        role: "Software Engineer Intern",
        timeframe: "Jan 2026 - May 2026",
        achievements: [
          "Designed and maintained internal software systems supporting student performance analytics.",
          "Built tools to process assessment data and automate academic reporting.",
        ],
      },
      {
        company: "Georgia Tech Research Institute (GTRI)",
        role: "Embedded Systems Intern",
        timeframe: "Aug 2024 - Dec 2025",
        achievements: [
          "Reverse engineered embedded firmware using Ghidra to reconstruct high-level logic from compiled binaries.",
          "Conducted side-channel attack research to identify unintended information leakage during hardware execution.",
          "Evaluated mitigation strategies against physical attack vectors affecting embedded systems security.",
        ],
      },
      {
        company: "National Science Foundation",
        role: "Data Analyst Intern",
        timeframe: "Aug 2023 - Dec 2023",
        achievements: [
          "Modeled and simulated geospatial soil datasets to analyze environmental conditions in Turkey.",
          "Applied machine learning techniques to identify anomalies and outliers in ground motion datasets.",
          "Processed and evaluated large-scale environmental data to support predictive analysis using Python scripts.",
        ],
      },
    ],
    studies: [
      {
        name: "Georgia Institute of Technology",
        timeframe: "Dec 2025",
        description: "B.S. Computer Science · 3.65 GPA",
      },
      {
        name: "CompTIA Security+",
        timeframe: "Expected Jul 2026",
        description: "Security certification",
      },
      {
        name: "CompTIA Linux+",
        timeframe: "Expected Dec 2026",
        description: "Linux certification",
      },
    ],
    skills: [
      "Python",
      "Java",
      "C",
      "JavaScript",
      "SQL",
      "Bash",
      "Assembly",
      "HTML/CSS",
      "Node.js",
      "Rust",
      "Tauri",
      "Linux",
      "Ghidra",
      "Software Engineering",
      "Cybersecurity",
      "Networking",
    ],
  },
  resume: {
    display: true,
    label: "Résumé",
    url: "/resumes/david-kim-main.pdf",
  },
  projects: {},
  dynamicProjects: [],
};
