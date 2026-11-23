"use client";

import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Both icons render and CSS picks one, so server and client markup match
  // before the theme is known.
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <LuSun className="hidden dark:block" />
      <LuMoon className="dark:hidden" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
