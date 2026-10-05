import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import type { DisplayConfig, FontsConfig, RoutesConfig } from "@/types";

// IMPORTANT: Replace with your own domain address - it's used for SEO in meta tags and schema
const baseURL: string = "https://daviddkim03.github.io";

const routes: RoutesConfig = {
  "/": true,
  "/about": true,
  "/work": true,
  "/freelance": true,
  "/training": true,
  "/blog": false,
  "/gallery": false,
};

const display: DisplayConfig = {
  location: true,
  time: false,
  themeSwitcher: true,
};

// Fonts are exposed as CSS variables and mapped to Tailwind's font-sans,
// font-mono and font-heading in src/app/globals.css.
const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const heading = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const fonts: FontsConfig = { sans, mono, heading };

export { baseURL, display, fonts, routes };
