"use client";

import { type EditableContent, defaultContent, loadContent } from "@/lib/content";
import { createContext, useContext, useEffect, useState } from "react";

const ContentContext = createContext<EditableContent>(defaultContent);

/**
 * Provides the editable content to the app. Starts with the built-in defaults
 * (so the statically-prerendered HTML is correct and SEO-friendly), then loads
 * any Supabase overrides on the client and swaps them in.
 */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<EditableContent>(defaultContent);

  useEffect(() => {
    let active = true;
    loadContent().then((loaded) => {
      if (active) setContent(loaded);
    });
    return () => {
      active = false;
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

/** Read the live (Supabase-overridden) editable content. */
export function useContent(): EditableContent {
  return useContext(ContentContext);
}
