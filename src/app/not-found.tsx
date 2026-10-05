import { cn } from "cn";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-3 py-32 text-center">
      <p className="font-heading text-7xl font-semibold tracking-tight md:text-8xl">404</p>
      <h1 className="font-heading text-2xl tracking-tight md:text-3xl">Page not found</h1>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "mt-6 rounded-full")}>
        <LuArrowLeft data-icon="inline-start" />
        Back home
      </Link>
    </section>
  );
}
