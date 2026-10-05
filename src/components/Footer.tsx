import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { person, social } from "@/resources";
import { iconLibrary } from "@/resources/icons";

const links = [
  { name: "HyberTec", href: "https://hybertec.com", icon: iconLibrary.hybertec },
  ...social
    .filter((item) => item.link)
    .map((item) => ({ name: item.name, href: item.link, icon: iconLibrary[item.icon] })),
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Extra bottom padding on mobile keeps the content clear of the floating nav.
    <footer className="w-full px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 pt-6 pb-28 md:flex-row md:justify-between md:pb-6">
        <p className="text-sm text-muted-foreground">
          © {currentYear} / <span className="text-foreground">{person.name}</span>
        </p>
        <div className="flex items-center gap-1 md:-mr-2">
          {links.map(({ name, href, icon: Icon }) => (
            <Tooltip key={name}>
              <TooltipTrigger
                render={
                  <a
                    href={href}
                    aria-label={name}
                    {...(href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  />
                }
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "rounded-full text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon />
              </TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </footer>
  );
}
