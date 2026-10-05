"use client";

import { ThemeProvider } from "next-themes";
import { ContentProvider } from "@/components/content/ContentProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <ContentProvider>{children}</ContentProvider>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
