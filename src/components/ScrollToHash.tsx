"use client";

import { useEffect } from "react";

/** Smooth-scrolls to the element named by the URL hash once the page has mounted. */
export function ScrollToHash() {
  useEffect(() => {
    // Get the hash from the URL
    const hash = window.location.hash;
    if (hash) {
      // Remove the '#' symbol
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return null;
}
