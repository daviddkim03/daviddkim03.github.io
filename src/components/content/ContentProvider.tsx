"use client";

import { type EditableContent, defaultContent } from "@/lib/content";
import { createContext, useContext } from "react";

const ContentContext = createContext<EditableContent>(defaultContent);

/**
 * Provides the site content (edited in `src/lib/content.ts`) to the app.
 */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  return <ContentContext.Provider value={defaultContent}>{children}</ContentContext.Provider>;
}

/** Read the site content. */
export function useContent(): EditableContent {
  return useContext(ContentContext);
}
