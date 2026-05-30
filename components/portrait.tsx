"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";

/**
 * Fa'res's portrait. next/image with `fill` + `object-cover` so the photo is
 * never stretched — it's cropped to a 3:4 frame with the focal point biased
 * toward his face. Source: /public/fares-portrait.jpg.
 *
 * Until that file exists the image errors gracefully to a labelled placeholder
 * (no broken-image icon).
 */
export function Portrait({
  className,
  sizes = "(min-width: 1024px) 28rem, (min-width: 640px) 24rem, 100vw",
  priority = false,
}: {
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] border border-line bg-night-soft",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background:repeating-linear-gradient(45deg,#fff_0_1px,transparent_1px_14px)]"
      />
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
          <span className="text-[0.7rem] font-medium tracking-[0.2em] text-ink-faint uppercase">
            Portrait — add /public/fares-portrait.jpg
          </span>
        </div>
      ) : null}
      <Image
        src="/fares-portrait.jpg"
        alt="Fa'res Husseini"
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className={cn(
          "object-cover object-[center_28%]",
          failed && "opacity-0",
        )}
      />
    </div>
  );
}
