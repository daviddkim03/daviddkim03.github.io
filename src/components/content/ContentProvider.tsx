"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { defaultContent, type EditableContent } from "@/lib/content";
import { type LiveContent, loadContent } from "@/lib/siteStore";

const fallback: LiveContent = { content: defaultContent, resumeUploaded: false };

const ContentContext = createContext<LiveContent>(fallback);

/**
 * Provides the site content to the app: the copy built into the page first
 * (`src/content/site.json`), then whatever was last saved in `/admin`.
 */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [live, setLive] = useState(fallback);

  useEffect(() => {
    // Offline or unreachable: the built-in content stays.
    loadContent().then(setLive, () => {});
  }, []);

  return <ContentContext.Provider value={live}>{children}</ContentContext.Provider>;
}

/** Read the site content. */
export function useContent(): EditableContent {
  return useContext(ContentContext).content;
}

/** Whether a résumé uploaded in `/admin` replaces the one in the repo. */
export function useResumeUploaded(): boolean {
  return useContext(ContentContext).resumeUploaded;
}
