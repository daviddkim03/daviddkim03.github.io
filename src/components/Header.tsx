"use client";

import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { LuDumbbell, LuImage, LuLayoutGrid, LuMenu, LuRocket, LuUserRound } from "react-icons/lu";
import { useContent } from "@/components/content/ContentProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { about, display, freelance, gallery, person, routes, training, work } from "@/resources";
import { monogram } from "@/utils/monogram";

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

export function Header() {
  const { name } = useContent().person;
  const pathname = usePathname() ?? "";
  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 px-6 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-6">
        <Link
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          className="flex items-center gap-2 rounded-md text-sm font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Avatar size="sm">
            <AvatarImage src={person.avatar} alt="" />
            <AvatarFallback>{monogram(name)}</AvatarFallback>
          </Avatar>
          {name}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {sections.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  buttonVariants({ variant: active ? "secondary" : "ghost" }),
                  !active && "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="-mr-2 ml-auto flex items-center gap-1 text-sm text-muted-foreground">
          {display.time && <TimeDisplay timeZone={person.location} />}
          {display.themeSwitcher && <ThemeToggle />}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" className="md:hidden" />}
            >
              <LuMenu />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-48">
              {sections.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.href}
                    render={<Link href={item.href} aria-current={active ? "page" : undefined} />}
                    className={cn("gap-2 px-2 py-2", active && "bg-accent font-medium")}
                  >
                    <Icon />
                    {item.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
