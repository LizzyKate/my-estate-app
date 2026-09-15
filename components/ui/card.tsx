import * as React from "react";
import { cn } from "@/lib/utils";

type Surface = "raised" | "sunken";

export function Card({
  className,
  surface = "raised",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { surface?: Surface }) {
  return (
    <div
      className={cn(
        "rounded-card border",
        surface === "raised"
          ? "bg-surface border-primary/10"
          : "bg-sunken border-primary/10",
        className
      )}
      {...props}
    />
  );
}
