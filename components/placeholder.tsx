import { cn } from "@/lib/cn";

/**
 * Labelled image placeholder. Stands in for real photography (which Fa'res
 * doesn't have yet) so the layout reads correctly. Swap for next/image later.
 */
export function Placeholder({
  label,
  className,
  ratioClass = "aspect-[4/3]",
}: {
  label: string;
  className?: string;
  ratioClass?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-night-soft",
        ratioClass,
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background:repeating-linear-gradient(45deg,#fff_0_1px,transparent_1px_14px)]"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
        <span className="text-[0.7rem] font-medium tracking-[0.2em] text-ink-faint uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}
