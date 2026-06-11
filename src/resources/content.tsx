import type {
  About,
  BasePageConfig,
  Blog,
  Gallery,
  Home,
  Newsletter,
  Person,
  Social,
  Work,
} from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "David",
  lastName: "Kim",
  name: `David Kim`,
  role: "Lead Software Developer",
  avatar: "/images/avatar.jpg",
  email: "daviddkim03@gmail.com",
  location: "America/New_York", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  displayLocation: "Atlanta / Duluth, GA", // Human-readable location shown in the header and about page
  languages: ["English", "Korean"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>Occasional notes on automation, systems, and teaching math</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/daviddkim03",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/daviddkim03/",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Software, automation, and thoughtful execution</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Takeoff Estimator</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/takeoff-estimator",
  },
  subline: (
    <>
      I'm David, lead software developer at{" "}
      <Text as="span" size="xl" weight="strong">
        Young Corporation
      </Text>{" "}
      and founder of HyberTec, where I build automation and estimation systems. <br /> I also tutor
      SAT Math and AP Calculus in Korean and English.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from Atlanta / Duluth, Georgia`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        David is an Atlanta-based software developer and Georgia Tech Computer Science graduate (BS,
        December 2025, 3.65 GPA). He leads estimation-automation software at Young Corporation and
        is the founder of HyberTec LLC, a software services company delivering SaaS products and
        custom solutions to small businesses. His background spans construction-estimation
        automation, full-stack web platforms, and embedded security research. He is fully bilingual
        in Korean and English, and tutors SAT Math, AP Calculus, and college-level math on the side.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Young Corporation",
        timeframe: "May 2026 - Present",
        role: "Lead Software Developer",
        achievements: [
          <>
            Architect an automated estimation system to support and marketize proprietary
            construction products.
          </>,
          <>
            Build software that automates construction processes, reducing manual staff workload and
            increasing efficiency.
          </>,
          <>
            Design internal tools integrating AI-assisted workflows for estimation and operational
            automation.
          </>,
        ],
        images: [],
      },
      {
        company: "HyberTec LLC",
        timeframe: "Apr 2026 - Present",
        role: "Founder and Lead Developer",
        achievements: [
          <>
            Founded and lead a software services company delivering SaaS products and custom
            solutions to businesses.
          </>,
          <>
            Engineer platforms including POS systems, waitlist managers, scheduling tools, and
            business automation.
          </>,
          <>
            Develop full-stack web solutions for restaurants, salons, real estate agents, and
            education businesses.
          </>,
        ],
        images: [],
      },
      {
        company: "Prime Academy",
        timeframe: "Jan 2026 - May 2026",
        role: "Software Engineer Intern",
        achievements: [
          <>
            Designed and maintained internal software systems supporting student performance
            analytics.
          </>,
          <>Built tools to process assessment data and automate academic reporting.</>,
        ],
        images: [],
      },
      {
        company: "Georgia Tech Research Institute (GTRI)",
        timeframe: "Aug 2024 - Dec 2025",
        role: "Embedded Systems Intern",
        achievements: [
          <>
            Reverse engineered embedded firmware using Ghidra to reconstruct high-level logic from
            compiled binaries.
          </>,
          <>
            Conducted side-channel attack research to identify unintended information leakage during
            hardware execution.
          </>,
          <>
            Evaluated mitigation strategies against physical attack vectors affecting embedded
            systems security.
          </>,
        ],
        images: [],
      },
      {
        company: "National Science Foundation",
        timeframe: "Aug 2023 - Dec 2023",
        role: "Data Analyst Intern",
        achievements: [
          <>
            Modeled and simulated geospatial soil datasets to analyze environmental conditions in
            Turkey.
          </>,
          <>
            Applied machine learning techniques to identify anomalies and outliers in ground motion
            datasets.
          </>,
          <>
            Processed and evaluated large-scale environmental data to support predictive analysis
            using Python scripts.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Georgia Institute of Technology",
        description: (
          <>
            BS Computer Science, December 2025 — 3.65 GPA. Coursework in Data Structures, Systems
            Architecture, and Information &amp; Network Security.
          </>
        ),
      },
      {
        name: "CompTIA Security+",
        description: <>Certification expected July 2026.</>,
      },
      {
        name: "CompTIA Linux+",
        description: <>Certification expected December 2026.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Automation & estimation systems",
        description: (
          <>
            Production estimation platforms that automate construction takeoff workflows — OCR,
            document parsing, and automated quantity calculations with Python, JavaScript, Rust, and
            Tauri.
          </>
        ),
        tags: [],
        images: [],
      },
      {
        title: "Full-stack web platforms",
        description: (
          <>
            SaaS products at HyberTec — POS systems, waitlist managers, scheduling tools, and
            business automation built with JavaScript, Node.js, and Python.
          </>
        ),
        tags: [],
        images: [],
      },
      {
        title: "Cybersecurity & systems",
        description: (
          <>
            Firmware reverse engineering with Ghidra, side-channel attack research, networking, and
            Linux administration.
          </>
        ),
        tags: [],
        images: [],
      },
      {
        title: "Languages",
        description: <>Python, Java, C, JavaScript, SQL, Bash, Assembly, and HTML/CSS.</>,
        tags: [],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about software and teaching...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Automation, systems, and software projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const freelance: BasePageConfig = {
  path: "/freelance",
  label: "Freelance",
  title: `Freelance – ${person.name}`,
  description: `Freelance software services by ${person.name} through HyberTec`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, freelance, gallery };
