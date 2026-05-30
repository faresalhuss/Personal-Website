import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Width of the inner column. Defaults to the reading column. */
  width?: "prose" | "wide";
};

export function Section({
  id,
  children,
  className,
  width = "prose",
}: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div
        className={cn(
          "mx-auto px-5 sm:px-8",
          width === "prose" ? "max-w-2xl" : "max-w-5xl",
        )}
      >
        {children}
      </div>
    </section>
  );
}
