"use client";

import { cn } from "cn";
import { LuArrowUpRight, LuFileText, LuGlobe } from "react-icons/lu";
import { useContent } from "@/components/content/ContentProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { about, person, social } from "@/resources";
import { iconLibrary } from "@/resources/icons";
import { monogram } from "@/utils/monogram";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  const headingId = id.toLowerCase().replace(/\s+/g, "-");

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-6">
      <h2 id={headingId} className="scroll-m-24 font-heading text-xl font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

function EntryLogo({ name, logo }: { name: string; logo?: string }) {
  return (
    <Avatar className="size-12">
      {logo && <AvatarImage src={logo} alt="" />}
      <AvatarFallback className="font-medium">{monogram(name)}</AvatarFallback>
    </Avatar>
  );
}

export function AboutView() {
  const content = useContent();
  const essentialLinks = social.filter((item) => item.essential && item.link);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-14 pt-4 pb-20 md:pt-16">
      {/* Name, role and location, with the avatar alongside */}
      <section className="flex flex-col-reverse gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-col gap-3">
          <h1 className="font-heading text-5xl font-semibold tracking-tight md:text-6xl">
            {content.person.name}
          </h1>
          <p className="font-heading text-2xl text-muted-foreground md:text-3xl">
            {content.person.role}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="mr-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <LuGlobe className="size-4" />
              {content.person.location}
            </span>
            {content.person.languages.map((language) => (
              <Badge key={language} variant="outline">
                {language}
              </Badge>
            ))}
          </div>
        </div>
        <Avatar className="size-32 shrink-0 md:size-40">
          <AvatarImage src={person.avatar} alt={content.person.name} />
          <AvatarFallback className="text-3xl">{monogram(content.person.name)}</AvatarFallback>
        </Avatar>
      </section>

      {/* Social links + résumé */}
      {(essentialLinks.length > 0 || (content.resume.display && content.resume.url)) && (
        <div className="flex flex-wrap gap-2">
          {essentialLinks.map((item) => {
            const Icon = iconLibrary[item.icon];
            const external = item.link.startsWith("http");
            return (
              <a
                key={item.name}
                href={item.link}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
              >
                <Icon data-icon="inline-start" />
                {item.name}
              </a>
            );
          })}
          {content.resume.display && content.resume.url && (
            <a
              href={content.resume.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants(), "rounded-full")}
            >
              <LuFileText data-icon="inline-start" />
              {content.resume.label}
              <LuArrowUpRight data-icon="inline-end" />
            </a>
          )}
        </div>
      )}

      <p className="text-lg/8 text-pretty text-muted-foreground">{content.about.intro}</p>

      {content.about.work.length > 0 && (
        <Section id={about.work.title} title={about.work.title}>
          <ul className="flex flex-col gap-7">
            {content.about.work.map((experience) => (
              <li key={`${experience.company}-${experience.timeframe}`} className="flex gap-4">
                <EntryLogo name={experience.company} logo={experience.logo} />
                <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <h3 className="font-heading font-semibold">{experience.company}</h3>
                    <p className="text-sm text-muted-foreground">{experience.role}</p>
                  </div>
                  <p className="shrink-0 text-xs text-muted-foreground tabular-nums sm:pt-1">
                    {experience.timeframe}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {content.about.studies.length > 0 && (
        <Section id={about.studies.title} title={about.studies.title}>
          <ul className="flex flex-col gap-7">
            {content.about.studies.map((institution) => (
              <li key={institution.name} className="flex gap-4">
                <EntryLogo name={institution.name} logo={institution.logo} />
                <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <h3 className="font-heading font-semibold">{institution.name}</h3>
                    <p className="text-sm text-muted-foreground">{institution.description}</p>
                  </div>
                  {institution.timeframe && (
                    <p className="shrink-0 text-xs text-muted-foreground tabular-nums sm:pt-1">
                      {institution.timeframe}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {content.about.skills.length > 0 && (
        <Section id={about.technical.title} title={about.technical.title}>
          <div className="flex flex-wrap gap-2">
            {content.about.skills.map((skill) => (
              <Badge key={skill} variant="outline" className="h-7 px-3 text-sm font-normal">
                {skill}
              </Badge>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
