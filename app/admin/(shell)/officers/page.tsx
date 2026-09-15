"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { InitialsTile } from "@/components/ui/initials-tile";
import { MonoLabel } from "@/components/ui/mono-label";
import { Input } from "@/components/ui/field";
import { AddOfficerDrawer } from "@/components/admin/add-officer-drawer";
import { useStore } from "@/lib/store";
import { EmptyRow } from "@/components/ui/table";

export default function AdminOfficersPage() {
  const estateId = useStore((s) => s.admin.estateId);
  const allOfficers = useStore((s) => s.officers);
  const officers = allOfficers.filter((o) => o.estateId === estateId);
  const shiftActive = useStore((s) => s.officer.shiftActive);
  const startedAt = useStore((s) => s.officer.startedAt);
  const onDutyId = useStore((s) => s.officer.officerId);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="max-w-xl space-y-10">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold text-text">Security officers</h1>
            <p className="mt-1 text-[13.5px] text-muted">
              Registering here is the only way an officer gets a gate PIN.
            </p>
          </div>
          <Button className="h-11 whitespace-nowrap" onClick={() => setDrawerOpen(true)}>
            + Add officer
          </Button>
        </div>

        <Card className="divide-y divide-primary/7 p-0">
          {officers.length === 0 && (
            <EmptyRow>No officers registered yet — add the first one.</EmptyRow>
          )}
          {officers.map((o) => {
            const onDuty = shiftActive && o.id === onDutyId;
            return (
              <div key={o.id} className="flex items-center gap-4 p-4">
                <InitialsTile name={o.name} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-text">{o.name}</p>
                  <p className="font-mono text-[11px] text-faint">
                    {o.id} · {o.gate}
                  </p>
                </div>
                <Chip tone={onDuty ? "green" : "neutral"} dot>
                  {onDuty ? `On shift · ${startedAt}` : "Off shift"}
                </Chip>
              </div>
            );
          })}
        </Card>

        <p className="font-mono text-[10.5px] leading-relaxed text-faint">
          PIN resets and shift scheduling are still out of scope for Phase 0 —
          registering a new officer is the one thing this page can do.
        </p>
      </div>

      <GateDevicesSection />

      <AddOfficerDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}

function GateDevicesSection() {
  const estateId = useStore((s) => s.admin.estateId);
  const allDevices = useStore((s) => s.devices);
  const devices = allDevices.filter((d) => d.estateId === estateId);
  const addDevice = useStore((s) => s.addDevice);
  const revokeDevice = useStore((s) => s.revokeDevice);

  const [label, setLabel] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function activationLink(device: { estateId: string; token: string }) {
    return `${window.location.origin}/security/activate/${device.estateId}/${device.token}`;
  }

  function copyLink(device: { id: string; estateId: string; token: string }) {
    navigator.clipboard?.writeText(activationLink(device)).catch(() => {});
    setCopiedId(device.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    addDevice(label.trim());
    setLabel("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[18px] font-bold text-text">Gate devices</h2>
        <p className="mt-1 text-[13.5px] text-muted">
          Security can only sign in from a device you&rsquo;ve approved here
          — a PIN alone isn&rsquo;t enough on any other browser.
        </p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2.5">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Main Gate tablet"
        />
        <Button type="submit" className="shrink-0" disabled={!label.trim()}>
          Add device
        </Button>
      </form>

      <Card className="divide-y divide-primary/7 p-0">
        {devices.length === 0 && (
          <EmptyRow>No devices approved yet — add one and open its link on the gate tablet.</EmptyRow>
        )}
        {devices.map((d) => (
          <div key={d.id} className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-text">{d.label}</p>
                <p className="font-mono text-[10.5px] text-faint">{d.id}</p>
              </div>
              <Chip tone={d.activatedAt ? "green" : "amber"} dot>
                {d.activatedAt ? "Activated" : "Not yet activated"}
              </Chip>
            </div>
            <div className="flex items-center gap-2">
              <MonoLabel className="truncate">{activationLink(d)}</MonoLabel>
            </div>
            <div className="flex gap-2.5">
              <Button variant="ghost" size="sm" onClick={() => copyLink(d)}>
                {copiedId === d.id ? "Copied" : "Copy link"}
              </Button>
              <Button variant="danger" size="sm" onClick={() => revokeDevice(d.id)}>
                Revoke
              </Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
