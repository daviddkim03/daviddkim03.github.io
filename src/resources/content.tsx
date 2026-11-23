import site from "@/content/site.json";
import type {
  About,
  BasePageConfig,
  Blog,
  Gallery,
  Home,
  Person,
  Social,
  Training,
  Work,
} from "@/types";

const person: Person = {
  firstName: "David",
  lastName: "Kim",
  name: site.person.name,
  role: site.person.role,
  avatar: "/trademarks/icon.png",
  email: "daviddkim03@gmail.com",
  location: "America/New_York", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  displayLocation: site.person.location, // Human-readable location shown in the header and about page
  languages: site.person.languages, // optional: Leave the array empty if you don't want to display languages
};

const social: Social = [
  // Links are automatically displayed.
  // Register new icons in src/resources/icons.ts
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
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About - ${person.name}`,
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
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Education",
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Skills",
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
  label: "Projects",
  title: `Projects - ${person.name}`,
  description: `Automation, systems, and software projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const freelance: BasePageConfig = {
  path: "/freelance",
  label: "Freelance",
  title: `Freelance - ${person.name}`,
  description: `Freelance software services by ${person.name} through HyberTec`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery - ${person.name}`,
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

const training: Training = {
  path: "/training",
  label: "Training",
  title: `Training - ${person.name}`,
  description: `Gym and workout progress log by ${person.name}`,
  headline: <>Training log</>,
  intro: <>Tracking gym workouts and progress over time. Photos coming soon.</>,
  placeholder: "Progress photos coming soon.",
  // Add { src, alt, orientation } entries as progress photos are uploaded.
  images: [],
};

export { about, blog, freelance, gallery, home, person, social, training, work };
