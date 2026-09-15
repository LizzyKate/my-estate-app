import { cn } from "@/lib/utils";

/** intentional placeholder for imagery/QR per design handoff: striped box + mono caption */
export function Placeholder({
  caption,
  className,
}: {
  caption: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "placeholder-stripes flex items-center justify-center rounded-card border border-primary/10",
        className
      )}
    >
      <span className="rounded bg-bg/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
        {caption}
      </span>
    </div>
  );
}
