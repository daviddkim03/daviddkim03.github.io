import { cn } from "cn";
import { LuArrowRight, LuCodeXml, LuDatabase, LuMail, LuStore } from "react-icons/lu";
import { JsonLd, PageHeader } from "@/components";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pageMetadata } from "@/lib/seo";
import { freelance, person } from "@/resources";

export const metadata = pageMetadata({
  title: freelance.title,
  description: freelance.description,
  path: freelance.path,
});

const services = [
  {
    title: "Business platforms",
    description:
      "POS systems, waitlist managers, scheduling tools, and business automation for restaurants, salons, real estate, and education.",
    icon: LuStore,
  },
  {
    title: "Full-stack web development",
    description:
      "Custom web solutions built end to end — from data pipelines and APIs to the interface your team actually uses.",
    icon: LuCodeXml,
  },
  {
    title: "Data cleaning & reporting",
    description:
      "Messy upstream inputs turned into clean, structured outputs — API integrations, scraping, and automated reports.",
    icon: LuDatabase,
  },
];

export default function Freelance() {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-20 pt-4 pb-20 md:pt-8">
      <JsonLd
        type="WebPage"
        path={freelance.path}
        title={freelance.title}
        description={freelance.description}
      />
      <PageHeader
        title="Freelance requests"
        description="I take on scoped freelance work through HyberTec — automation, estimation systems, and full-stack platforms for small teams. Short discovery call, scoped proposal, weekly demos, clean handoff."
      >
        <div className="flex flex-wrap justify-center gap-3 pt-3">
          <a
            href="https://hybertec.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "lg" }), "h-10 rounded-full px-5")}
          >
            Request a project at HyberTec
            <LuArrowRight data-icon="inline-end" />
          </a>
          <a
            href={`mailto:${person.email}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-10 rounded-full px-5",
            )}
          >
            <LuMail data-icon="inline-start" />
            Email me directly
          </a>
        </div>
      </PageHeader>

      <section aria-labelledby="services" className="flex flex-col gap-8">
        <h2
          id="services"
          className="text-center font-heading text-2xl font-semibold tracking-tight"
        >
          What I take on
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {services.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="[--card-spacing:--spacing(6)]">
              <CardHeader className="gap-2">
                <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-4" />
                </div>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <CardDescription className="leading-relaxed">{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
