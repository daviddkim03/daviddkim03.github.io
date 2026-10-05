import "./globals.css";

import { cn } from "cn";
import type { Metadata } from "next";
import { Footer, Header, Providers, RouteGuard } from "@/components";
import { pageMetadata } from "@/lib/seo";
import { fonts, home } from "@/resources";

export const metadata: Metadata = pageMetadata({
  title: home.title,
  description: home.description,
  path: home.path,
  image: home.image,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(fonts.sans.variable, fonts.mono.variable, fonts.heading.variable)}
    >
      <body className="antialiased">
        <Providers>
          <div className="relative isolate flex min-h-svh flex-col">
            <div
              aria-hidden
              className="bg-dot-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem]"
            />
            <Header />
            <main className="flex flex-1 justify-center px-6 max-md:pt-6">
              <RouteGuard>{children}</RouteGuard>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
