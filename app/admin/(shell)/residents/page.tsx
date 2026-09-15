"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { MonoLabel } from "@/components/ui/mono-label";
import { StatTile } from "@/components/ui/stat-tile";
import { TableHeaderRow, TableRow, TableShell, EmptyRow } from "@/components/ui/table";
import { AddResidentDrawer } from "@/components/admin/add-resident-drawer";
import { useStore } from "@/lib/store";
import { getAdminStats } from "@/lib/mock-data";
import { useAdminEstate } from "@/hooks/use-current-estate";
import type { ResidentStatus } from "@/lib/types";

const COLUMNS = "1.3fr .5fr 1.35fr .8fr .85fr";

const STATUS_CHIP: Record<ResidentStatus, "green" | "amber" | "neutral"> = {
  ACTIVE: "green",
  "NOT SIGNED IN": "amber",
  "MOVED OUT": "neutral",
};

export default function AdminResidentsPage() {
  const estate = useAdminEstate();
  const estateId = useStore((s) => s.admin.estateId);
  const allResidents = useStore((s) => s.residents);
  const allPasses = useStore((s) => s.passes);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const residents = allResidents.filter((r) => r.estateId === estateId);
  const passes = allPasses.filter((p) => p.estateId === estateId);
  const stats = getAdminStats(estateId ?? "", residents, passes);

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

      {estate && <ResidentLinkCard slug={estate.slug} />}

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatTile label="Households active" value={stats.householdsActive} />
        <StatTile
          label="App sign-ins"
          value={stats.appSignIns}
          sub={`${stats.appSignInsPct}%`}
          accent="green"
        />
        <StatTile label="Passes this week" value={stats.passesThisWeek} />
        <StatTile
          label="Avg gate time"
          value={stats.avgGateTimeSeconds != null ? `${stats.avgGateTimeSeconds}s` : "—"}
        />
      </div>

      <TableShell minWidth={720}>
        <TableHeaderRow columns={COLUMNS}>
          <span>Resident</span>
          <span>House</span>
          <span>Phone · login</span>
          <span>Household</span>
          <span>Status</span>
        </TableHeaderRow>
        {residents.length === 0 && (
          <EmptyRow>No residents registered yet — add the first one.</EmptyRow>
        )}
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

function ResidentLinkCard({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/resident/sign-in?estate=${slug}`
      : "";

  function copyLink() {
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-[13.5px] font-bold text-text">Resident sign-in link</p>
        <p className="mt-0.5 text-[12.5px] text-muted">
          Text this to a new resident after adding them — it opens the app
          straight to your estate, skipping the estate picker.
        </p>
        <MonoLabel className="mt-2 block truncate">{link}</MonoLabel>
      </div>
      <Button variant="ghost" size="sm" className="shrink-0" onClick={copyLink}>
        {copied ? "Copied" : "Copy link"}
      </Button>
    </Card>
  );
}
