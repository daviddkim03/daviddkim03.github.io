"use client";

import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  LuDumbbell,
  LuGlobe,
  LuHouse,
  LuImage,
  LuLayoutGrid,
  LuRocket,
  LuUserRound,
} from "react-icons/lu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { about, display, freelance, gallery, person, routes, training, work } from "@/resources";

interface NavItem {
  href: `/${string}`;
  label: string;
  icon: IconType;
  /** Match only the exact path instead of the whole subtree. */
  exact?: boolean;
}

const sections: NavItem[] = (
  [
    { href: "/about", label: about.label, icon: LuUserRound, exact: true },
    { href: "/work", label: work.label, icon: LuLayoutGrid },
    { href: "/freelance", label: freelance.label, icon: LuRocket },
    { href: "/training", label: training.label, icon: LuDumbbell },
    { href: "/gallery", label: gallery.label, icon: LuImage },
  ] satisfies NavItem[]
).filter((item) => routes[item.href]);

function TimeDisplay({ timeZone, locale = "en-GB" }: { timeZone: string; locale?: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = new Intl.DateTimeFormat(locale, {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const update = () => setTime(format.format(new Date()));
    update();
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <span className="tabular-nums">{time}</span>;
}

function NavLink({
  item,
  active,
  iconOnly = false,
}: {
  item: NavItem;
  active: boolean;
  iconOnly?: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: active ? "secondary" : "ghost",
          size: iconOnly ? "icon" : "default",
        }),
        "rounded-full",
        // Labels collapse to icons on small screens.
        !iconOnly && "max-md:size-8 max-md:px-0",
      )}
    >
      <Icon />
      <span className={iconOnly ? "sr-only" : "sr-only md:not-sr-only"}>{item.label}</span>
    </Link>
  );
}

const navDivider = "mx-0.5 data-vertical:h-4 data-vertical:self-center";

export function Header() {
  const pathname = usePathname() ?? "";
  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <>
      {/* Fades page content out under the floating nav: top on desktop, bottom on mobile. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-28 bg-linear-to-t from-background from-40% to-transparent md:top-0 md:bottom-auto md:h-24 md:bg-linear-to-b"
      />
      <header className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6 md:sticky md:top-0 md:bottom-auto md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4 md:px-6 md:py-4">
        <div className="hidden min-w-0 items-center gap-2 text-sm text-muted-foreground md:flex">
          {display.location && (
            <>
              <LuGlobe className="size-4 shrink-0" />
              <span className="truncate">{person.displayLocation ?? person.location}</span>
            </>
          )}
        </div>
        <nav
          aria-label="Main"
          className="flex items-center gap-1 rounded-full border bg-background/80 p-1 shadow-lg shadow-black/5 backdrop-blur-md"
        >
          {routes["/"] && (
            <>
              <NavLink
                item={{ href: "/", label: "Home", icon: LuHouse }}
                active={pathname === "/"}
                iconOnly
              />
              <Separator orientation="vertical" className={navDivider} />
            </>
          )}
          {sections.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item)} />
          ))}
          {display.themeSwitcher && (
            <>
              <Separator orientation="vertical" className={cn(navDivider, "md:hidden")} />
              <ThemeToggle className="md:hidden" />
            </>
          )}
        </nav>
        <div className="hidden items-center justify-end gap-4 text-sm text-muted-foreground md:flex">
          {display.time && <TimeDisplay timeZone={person.location} />}
          {display.themeSwitcher && <ThemeToggle />}
        </div>
      </header>
    </>
  );
}
