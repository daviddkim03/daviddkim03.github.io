"use client";

import { usePathname } from "next/navigation";
import NotFound from "@/app/not-found";
import { routes } from "@/resources";

const checkRouteEnabled = (pathname: string | null): boolean => {
  if (!pathname) return false;

  if (pathname in routes) {
    return routes[pathname as keyof typeof routes];
  }

  const dynamicRoutes = ["/blog", "/work"] as const;
  for (const route of dynamicRoutes) {
    if (pathname.startsWith(route) && routes[route]) {
      return true;
    }
  }

  return false;
};

/** Renders the 404 page for routes disabled in `site.config.ts`. */
export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (!checkRouteEnabled(pathname)) {
    return <NotFound />;
  }

  return <>{children}</>;
}
