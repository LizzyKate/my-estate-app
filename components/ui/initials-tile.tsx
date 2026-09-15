import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";
import type { Category } from "@/lib/types";

const categoryTint: Record<Category, string> = {
  VISITOR: "bg-primary/16 text-primary",
  DELIVERY: "bg-green/16 text-green",
  SERVICE: "bg-tertiary/18 text-tertiary",
};

export function InitialsTile({
  name,
  category,
  size = 34,
  className,
}: {
  name: string;
  category?: Category;
  size?: number;
  className?: string;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[10px] font-mono text-[12px] font-bold",
        category ? categoryTint[category] : "bg-ghost text-muted",
        className
      )}
    >
      {initials(name)}
    </div>
  );
}

export const categoryTintText: Record<Category, string> = {
  VISITOR: "text-primary",
  DELIVERY: "text-green",
  SERVICE: "text-tertiary",
};
