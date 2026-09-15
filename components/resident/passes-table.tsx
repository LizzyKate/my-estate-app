import { Chip } from "@/components/ui/chip";
import { InitialsTile } from "@/components/ui/initials-tile";
import { EmptyRow, TableHeaderRow, TableRow, TableShell } from "@/components/ui/table";
import { categoryTintText } from "@/components/ui/initials-tile";
import type { Pass } from "@/lib/types";

const COLUMNS = "1.5fr .85fr .9fr .85fr";

const STATUS_CHIP = {
  waiting: { tone: "amber" as const, label: "Waiting" },
  onsite: { tone: "green" as const, label: "On site" },
  out: { tone: "neutral" as const, label: "Checked out" },
};

export function PassesTable({
  passes,
  title,
}: {
  passes: Pass[];
  title?: string;
}) {
  return (
    <div>
      {title && (
        <h2 className="mb-3 text-[15px] font-bold text-text">{title}</h2>
      )}
      <TableShell>
        <TableHeaderRow columns={COLUMNS}>
          <span>Visitor</span>
          <span>Code</span>
          <span>Window</span>
          <span>Status</span>
        </TableHeaderRow>
        {passes.length === 0 && <EmptyRow>No passes yet.</EmptyRow>}
        {passes.map((pass) => {
          const chip = STATUS_CHIP[pass.status];
          return (
            <TableRow key={pass.id} columns={COLUMNS}>
              <div className="flex items-center gap-3">
                <InitialsTile name={pass.name} category={pass.cat} />
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-bold text-text">
                    {pass.name}
                  </p>
                  <p
                    className={`font-mono text-[11px] ${categoryTintText[pass.cat]}`}
                  >
                    {pass.cat}
                  </p>
                </div>
              </div>
              <span className="font-mono text-[13.5px] font-bold text-text">
                {pass.code}
              </span>
              <span className="font-mono text-[12.5px] text-muted">
                {pass.window}
              </span>
              <Chip tone={chip.tone} dot>
                {chip.label}
              </Chip>
            </TableRow>
          );
        })}
      </TableShell>
    </div>
  );
}
