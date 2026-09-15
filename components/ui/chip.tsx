import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "bg-ghost text-muted border border-primary/10",
        primary: "bg-primary/14 text-primary border border-primary/20",
        green: "bg-green/12 text-green border border-green/30",
        amber: "bg-amber/12 text-amber border border-amber/30",
        red: "bg-red/12 text-red border border-red/32",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  dot?: boolean;
}

export function Chip({ className, tone, dot, children, ...props }: ChipProps) {
  return (
    <span className={cn(chipVariants({ tone, className }))} {...props}>
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full",
            tone === "green" && "bg-green",
            tone === "amber" && "bg-amber",
            tone === "red" && "bg-red",
            tone === "primary" && "bg-primary",
            (!tone || tone === "neutral") && "bg-muted"
          )}
        />
      )}
      {children}
    </span>
  );
}
