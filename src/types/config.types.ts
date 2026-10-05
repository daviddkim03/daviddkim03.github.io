import type { NextFontWithVariable } from "next/dist/compiled/@next/font";

/**
 * Display configuration for UI elements.
 */
export type DisplayConfig = {
  location: boolean;
  time: boolean;
  themeSwitcher: boolean;
};

/**
 * Route configuration for enabled/disabled routes.
 */
export type RoutesConfig = Record<`/${string}`, boolean>;

/**
 * Font configuration. Each font exposes a CSS variable that `globals.css`
 * maps onto Tailwind's `font-sans`, `font-mono` and `font-heading`.
 */
export type FontsConfig = {
  sans: NextFontWithVariable;
  mono: NextFontWithVariable;
  heading: NextFontWithVariable;
};
