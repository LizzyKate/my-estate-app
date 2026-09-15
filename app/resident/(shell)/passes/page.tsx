"use client";

import { PassesTable } from "@/components/resident/passes-table";
import { InviteFlow } from "@/components/resident/invite-flow";
import { useStore } from "@/lib/store";

export default function ResidentPassesPage() {
  const estateId = useStore((s) => s.resident.estateId);
  const residentId = useStore((s) => s.resident.residentId);
  const allPasses = useStore((s) => s.passes);
  const passes = allPasses.filter(
    (p) => p.estateId === estateId && p.residentId === residentId
  );

  return (
    <div className="space-y-[18px]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-text">Visitors & passes</h1>
          <p className="mt-1 text-[13.5px] text-muted">
            Every pass your household has issued.
          </p>
        </div>
        <InviteFlow />
      </div>
      <PassesTable passes={passes} />
    </div>
  );
}
