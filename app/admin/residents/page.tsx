"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { StatTile } from "@/components/ui/stat-tile";
import { TableHeaderRow, TableRow, TableShell } from "@/components/ui/table";
import { AddResidentDrawer } from "@/components/admin/add-resident-drawer";
import { useStore } from "@/lib/store";
import { ADMIN_STATS } from "@/lib/mock-data";
import type { ResidentStatus } from "@/lib/types";

const COLUMNS = "1.3fr .5fr 1.35fr .8fr .85fr";

const STATUS_CHIP: Record<ResidentStatus, "green" | "amber" | "neutral"> = {
  ACTIVE: "green",
  "NOT SIGNED IN": "amber",
  "MOVED OUT": "neutral",
};

export default function AdminResidentsPage() {
  const residents = useStore((s) => s.residents);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-text">Residents</h1>
          <p className="mt-1 text-[13.5px] text-muted">
            Management decides who counts as a verified resident.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Button variant="ghost" className="h-11 whitespace-nowrap">
            Import CSV
          </Button>
          <Button className="h-11 whitespace-nowrap" onClick={() => setDrawerOpen(true)}>
            + Add resident
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatTile label="Households active" value={ADMIN_STATS.householdsActive} />
        <StatTile
          label="App sign-ins"
          value={ADMIN_STATS.appSignIns}
          sub={`${ADMIN_STATS.appSignInsPct}%`}
          accent="green"
        />
        <StatTile label="Passes this week" value={ADMIN_STATS.passesThisWeek} />
        <StatTile label="Avg gate time" value={`${ADMIN_STATS.avgGateTimeSeconds}s`} />
      </div>

      <TableShell>
        <TableHeaderRow columns={COLUMNS}>
          <span>Resident</span>
          <span>House</span>
          <span>Phone · login</span>
          <span>Household</span>
          <span>Status</span>
        </TableHeaderRow>
        {residents.map((r) => (
          <TableRow key={r.id} columns={COLUMNS}>
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-bold text-text">{r.name}</p>
              <p className="font-mono text-[10.5px] text-faint">{r.role}</p>
            </div>
            <span className="text-[13px] text-muted">{r.house}</span>
            <span className="truncate font-mono text-[12px] whitespace-nowrap text-muted">
              {r.phone} · {r.lastLogin ?? "never"}
            </span>
            <span className="text-[13px] text-muted">{r.householdSize}</span>
            <Chip tone={STATUS_CHIP[r.status]} dot>
              {r.status}
            </Chip>
          </TableRow>
        ))}
      </TableShell>

      <AddResidentDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
