"use client";

import { createContext, useContext } from "react";
import { defaultContent, type EditableContent } from "@/lib/content";

const ContentContext = createContext<EditableContent>(defaultContent);

/**
 * Provides the site content (from `src/content/site.json`) to the app.
 */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  return <ContentContext.Provider value={defaultContent}>{children}</ContentContext.Provider>;
}

/** Read the site content. */
export function useContent(): EditableContent {
  return useContext(ContentContext);
}
