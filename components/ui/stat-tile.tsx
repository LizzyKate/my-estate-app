import { cn } from "@/lib/utils";
import { MonoLabel } from "./mono-label";

export function StatTile({
  label,
  value,
  accent,
  sub,
  className,
}: {
  label: string;
  value: string | number;
  accent?: "green" | "amber" | "primary";
  sub?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-card border border-primary/10 bg-sunken px-5 py-4",
        className
      )}
    >
      <MonoLabel>{label}</MonoLabel>
      <div className="flex items-baseline gap-2">
        <span className="tabular text-[26px] font-bold text-text">{value}</span>
        {sub && (
          <span
            className={cn(
              "font-mono text-[12px] font-semibold",
              accent === "green" && "text-green",
              accent === "amber" && "text-amber",
              accent === "primary" && "text-primary",
              !accent && "text-muted"
            )}
          >
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}
