import { Chip } from "@/components/ui/chip";
import { Placeholder } from "@/components/ui/placeholder";
import { cn } from "@/lib/utils";
import type { MaintenanceItem, MaintenanceStatus } from "@/lib/types";

const MAINTENANCE_CHIP: Record<MaintenanceStatus, "amber" | "primary" | "green"> = {
  NEW: "amber",
  "IN PROGRESS": "primary",
  RESOLVED: "green",
};

export function MaintenanceQueue({ items }: { items: MaintenanceItem[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((m) => (
        <div
          key={m.id}
          className={cn(
            "flex items-center gap-3.5 rounded-card border border-primary/10 bg-sunken p-3.5",
            m.status === "RESOLVED" && "opacity-60"
          )}
        >
          <Placeholder caption="Photo" className="size-14 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold text-text">{m.title}</p>
            <p className="mt-0.5 truncate font-mono text-[10.5px] text-faint">
              {m.category} · {m.resident} · {m.house} · {m.loggedAt}
            </p>
          </div>
          <Chip tone={MAINTENANCE_CHIP[m.status]}>{m.status}</Chip>
        </div>
      ))}
    </div>
  );
}
