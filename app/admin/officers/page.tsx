"use client";

import { Card } from "@/components/ui/card";
import { InitialsTile } from "@/components/ui/initials-tile";
import { MonoLabel } from "@/components/ui/mono-label";
import { Chip } from "@/components/ui/chip";
import { useStore } from "@/lib/store";
import { OFFICER } from "@/lib/mock-data";

export default function AdminOfficersPage() {
  const shiftActive = useStore((s) => s.officer.shiftActive);
  const startedAt = useStore((s) => s.officer.startedAt);

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-text">Security officers</h1>
        <p className="mt-1 text-[13.5px] text-muted">Read-only in Phase 0.</p>
      </div>

      <Card className="flex items-center gap-4 p-5">
        <InitialsTile name={OFFICER.name} size={44} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-text">{OFFICER.name}</p>
          <p className="font-mono text-[11px] text-faint">
            {OFFICER.id} · {OFFICER.gate}
          </p>
        </div>
        <Chip tone={shiftActive ? "green" : "neutral"} dot>
          {shiftActive ? `On shift · ${startedAt}` : "Off shift"}
        </Chip>
      </Card>

      <p className="font-mono text-[10.5px] leading-relaxed text-faint">
        <MonoLabel>Not yet built</MonoLabel>
        <br />
        Adding officers, PIN resets, and shift scheduling are out of scope
        for Phase 0.
      </p>
    </div>
  );
}
