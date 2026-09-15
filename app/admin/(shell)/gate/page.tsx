"use client";

import { Chip } from "@/components/ui/chip";
import { StatTile } from "@/components/ui/stat-tile";
import { InitialsTile, categoryTintText } from "@/components/ui/initials-tile";
import { EmptyRow, TableHeaderRow, TableRow, TableShell } from "@/components/ui/table";
import { useStore } from "@/lib/store";
import type { PassStatus } from "@/lib/types";

const COLUMNS = "1.4fr 1fr .9fr .9fr .85fr";

const STATUS_CHIP: Record<PassStatus, { tone: "amber" | "green" | "neutral"; label: string }> = {
  waiting: { tone: "amber", label: "Waiting" },
  onsite: { tone: "green", label: "On site" },
  out: { tone: "neutral", label: "Checked out" },
};

export default function AdminGatePage() {
  const estateId = useStore((s) => s.admin.estateId);
  const allPasses = useStore((s) => s.passes);
  const allWalkups = useStore((s) => s.walkups);

  const passes = allPasses.filter((p) => p.estateId === estateId);
  const walkupPending = allWalkups.some(
    (w) => w.estateId === estateId && w.status === "pending"
  );
  const waiting = passes.filter((p) => p.status === "waiting").length;
  const onsite = passes.filter((p) => p.status === "onsite").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-text">Live gate view</h1>
        <p className="mt-1 text-[13.5px] text-muted">
          Fed by whatever residents and security just did — read-only.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatTile label="Passes today" value={passes.length} />
        <StatTile label="On site now" value={onsite} accent="green" />
        <StatTile label="Still waiting" value={waiting} accent="amber" />
        <StatTile
          label="Walk-ups pending"
          value={walkupPending ? 1 : 0}
          accent={walkupPending ? "amber" : undefined}
        />
      </div>

      <TableShell minWidth={680}>
        <TableHeaderRow columns={COLUMNS}>
          <span>Visitor</span>
          <span>Host · house</span>
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
                  <p className={`font-mono text-[11px] ${categoryTintText[pass.cat]}`}>
                    {pass.cat}
                  </p>
                </div>
              </div>
              <span className="truncate text-[13px] text-muted">
                {pass.host} · {pass.house}
              </span>
              <span className="font-mono text-[13px] font-bold text-text">
                {pass.code}
              </span>
              <span className="font-mono text-[12px] text-muted">{pass.window}</span>
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
