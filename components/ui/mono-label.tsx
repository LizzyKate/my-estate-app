import * as React from "react";
import { cn } from "@/lib/utils";

/** small uppercase monospace label, per design tokens (9.5–11px, tracked, uppercase) */
export function MonoLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint",
        className
      )}
      {...props}
    />
  );
}
